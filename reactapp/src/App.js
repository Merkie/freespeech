import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Navbar from './components/Navbar';
import Freespeech from './pages/Freespeech';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Logout from './pages/Logout';
import Error404 from './pages/Error404';

class App extends Component {
	constructor (props) {
		super(props)
		this.state = {
			isSignedIn:false,
			accessToken:"",
			refreshToken:"",
			preferredVoiceId:0,
		}
		this.update = this.update.bind(this);
	}

	update(isSignedIn, accessToken, refreshToken, preferredVoiceId){
		this.setState({isSignedIn:isSignedIn, accessToken:accessToken, refreshToken:refreshToken, preferredVoiceId:preferredVoiceId});
	}

	render () {
		const theme = createMuiTheme({
		  palette: {
		    type: 'dark',
		  },
		});

		return (
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				<Router>
					<Navbar isSignedIn={this.state.isSignedIn}/>
					<Container><br />
						<Switch>
							<Route path="/" exact component={Welcome} />
							<Route path="/home" ><Freespeech theme={theme} isSignedIn={this.state.isSignedIn} accessToken={this.state.accessToken} refreshToken={this.state.refreshToken}  SpeechSynth={window.speechSynthesis} /></Route>
							<Route path="/signup"><Signup isSignedIn={this.state.isSignedIn} /></Route>
							<Route path="/login" ><Login update={this.update} isSignedIn={this.state.isSignedIn}/></Route>
							<Route path="/logout" ><Logout update={this.update} isSignedIn={this.state.isSignedIn} /></Route>
							<Route path="*" component={Error404} />
						</Switch>
					</Container>
				</Router>
			</MuiThemeProvider >
		)
	}
}

export default App
