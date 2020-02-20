import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { Container, Typography, Grid, TextField, Button, Link } from '@material-ui/core';
import { sha256 } from 'js-sha256';

class Signup extends Component {
	constructor (props) {
		super(props)
		this.state = {
			submitable:true,
			message:"",
			toLogin:false,
		}
		this.handleInputChange = this.handleInputChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
    e.preventDefault();
		this.setState({submitable:false});
		console.log(JSON.stringify(this.state));
    fetch("http://ryanhill.com:5000/signup", {
			method:"POST",
      headers: {
        'Accept': 'application/json',
    		'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    }).then(res => res.json()).then((data) => {
			if(!data.error){
				this.setState({toLogin:true})
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
		if(this.state.toLogin){
			return <Redirect to='/login'/>;
		}
		return (
			<Container component="main" maxWidth="xs">
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography component="h1" variant="h3">Sign up</Typography>
				<Typography component="h1" variant="h6" color="secondary">{this.state.message}</Typography><br />
        <form style={{width: '100%'}} onSubmit={this.onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth id="name" label="Full Name" name="name" autoComplete="name" onChange={this.handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth id="username" label="Username" name="username" autoComplete="username" onChange={this.handleInputChange} />
            </Grid>
						<Grid item xs={12}>
              <TextField variant="outlined" required fullWidth id="email" label="Email" name="email" autoComplete="email" type="email" onChange={this.handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth name="password" inputProps={{ pattern:"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", title:"Password required to be a minimum of eight in length with one uppercase letter, one lowercase letter, one number, and one special character"}} label="Password" type="password" id="password" autoComplete="passowrd" onChange={this.handleInputChange} />
            </Grid>
						<Grid item xs={12}>
              <TextField variant="outlined" required fullWidth name="repassword" inputProps={{ pattern:"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"}} label="Re-type Password" type="password" id="repassword" autoComplete="password" onChange={this.handleInputChange} />
            </Grid>
          </Grid><br />
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={!this.state.submitable}>Sign Up</Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2" color="inherit">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </form>
      </div>
			</Container>
		);
	}
}

export default Signup
