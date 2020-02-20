import React, { Component } from 'react'
import { Redirect } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { Container, Grid, Paper, Card, CardContent } from '@material-ui/core';

class Freespeech extends Component {
  constructor (props) {
    super(props)
    this.state = {
			speechItems:[]
    }
  }

	speakText(text, voiceId){
		let voices = this.props.SpeechSynth.getVoices();
		let utterThis = new SpeechSynthesisUtterance(text);
		utterThis.voice = voices[voiceId];
		this.props.SpeechSynth.speak(utterThis);
	}

	componentDidMount() {
		if(this.props.isSignedIn){
			fetch(window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '')+"/speechItems", {
				method:"GET",
	      headers: {
	        'Accept': 'application/json',
	    		'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + this.props.accessToken,
	      }
	    }).then(res => res.json()).then((data) => {
				if(!data.error){
					this.setState({speechItems:data})
				}else{
					this.setState({submitable:true, message:data.error});
				}
	    }).catch(console.log);
		}
  }

	componentWillUnmount() {
		this.props.SpeechSynth.cancel();
  }

  render () {
		const theme = this.props.theme;
		const Nested = withStyles({
			root: {
		    display: 'flex',
		    '& > *': {
		      margin: theme.spacing(1),
		      width: theme.spacing(16),
		      height: theme.spacing(16),
		    },
		  },
		})(({ classes }) => {
			return this.state.speechItems.map((speechItem)=>{
				return (
					<Grid item xs={12} sm={3} md={2} lg={2} xl={2} className={classes.root}>
		      	<Paper variant="outlined" id={speechItem.id}>{speechItem.text}</Paper>
		    	</Grid>
				)
			});
		});
		// const SpeechItems = this.state.speechItems.map((speechItem)=>{ return ( <SpeechItem key={person.name} person={person} /> ) });

		if(!this.props.isSignedIn){
			return <Redirect to='/login'/>;
		}

    return (
			<Grid container>
				<Nested />
			</Grid>
		)
  }
}

export default Freespeech
