import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { sha256 } from 'js-sha256';

class Login extends Component {
	constructor (props) {
		super(props)
		this.state = {
		}
	}

	render () {
		this.props.update(false,"","",0);
		return (
			<Redirect to="/login" />
		)
	}
}

export default Login
