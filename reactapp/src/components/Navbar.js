import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {AppBar, Toolbar, Typography, Button } from '@material-ui/core';
class Navbar extends Component {
	constructor (props) {
		super(props)
		this.state = {
		}
	}

	render () {
		return (
			<div style={{flexGrow:1}}>
				<AppBar position="static" color="inherit">
					<Toolbar variant="dense">
	          <Typography variant="h6" style={{flexGrow:1}} >Freespeech</Typography>
						{!this.props.isSignedIn ? (
								<div>
									<NavLink to='/signup' >
										<Button>Signup</Button>
									</NavLink>
									<NavLink to='/login' >
										<Button>Login</Button>
									</NavLink>
								</div>
							):(
								<NavLink to='/logout' >
									<Button>Logout</Button>
								</NavLink>
							)
						}
	        </Toolbar>
	      </AppBar>
	    </div>
		);
	}
}

export default Navbar
