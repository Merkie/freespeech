import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { Container, Typography, Grid, TextField, Button, Link } from '@material-ui/core';
import { sha256 } from 'js-sha256';

class Login extends Component {
	constructor (props) {
		super(props)
		this.state = {
			submitable:true,
			message:"",
		}
		this.handleInputChange = this.handleInputChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
    e.preventDefault();
		this.setState({submitable:false});
    fetch(window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '')+"/login", {
			method:"POST",
      headers: {
        'Accept': 'application/json',
    		'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    }).then(res => res.json()).then((data) => {
			if(!data.error){
	      this.props.update(true, data.accessToken, data.refreshToken, data.preferredVoiceId);
			}else{
				this.setState({submitable:true, message:data.error});
			}
    }).catch(console.log);
  }

	handleInputChange(event) {
    const target = event.target;
    const value = (target.type === 'password')?sha256(target.value):target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

	render () {
		if(this.props.isSignedIn){
			return <Redirect to='/home'/>;
		}
		return (
			<Container component="main" maxWidth="xs">
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography component="h1" variant="h3" style={{marginTop:'5px'}}>Login</Typography>
				<Typography component="h1" variant="h6" color="secondary">{this.state.message}</Typography><br />
        <form id="loginform" onSubmit={this.onSubmit} style={{width: '100%'}}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField variant="outlined" required fullWidth id="username" label="Username" name="username" autoComplete="username" onChange={this.handleInputChange} />
						</Grid>
						<Grid item xs={12}>
              <TextField variant="outlined" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="password" onChange={this.handleInputChange} />
            </Grid>
          </Grid><br />
	          <Button type="submit" fullWidth variant="contained" color="primary" disabled={!this.state.submitable}>Login</Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" hidden variant="body2" color="inherit">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2" color="inherit">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
		);
	}
}

export default Login
