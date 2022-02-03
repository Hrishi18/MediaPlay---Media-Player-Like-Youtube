import React, { Component } from "react";
import { Link } from "react-router-dom";

import menuSVG from "../../assets/images/menu.svg";
import icon1SVG from "../../assets/images/icon1.svg";
import logo from "../../assets/images/logo.png";
import searchSVG from "../../assets/images/search.svg";
import searchBtnSVG from "../../assets/images/searchBtn.svg";
import newVideoSVG from "../../assets/images/newVideo.svg";
import appsSVG from "../../assets/images/apps.svg";
import notificationsSVG from "../../assets/images/notifications.svg";
//import Modal from "react-responsive-modal";
import Modal from '@mui/material/Modal';
import 'react-responsive-modal/styles.css';
import { ReactSession } from 'react-client-session';
import axios from "axios";

import "./header.css";

export default class Header extends Component {
	onLogoClick = () => {
		console.log("here")
		this.props.history.push('/')
	}
	constructor(props) {
		super(props)
		ReactSession.setStoreType("localStorage");

		this.state = {
			sign: false,
			login: false,
			uname: "invalid username",
			pass: "invalid password",
			isSubmitted: false,
			errorMessages: {},
			username: "user1",
			password: "pass1"
		}
		// login state

	}

	//model state
	onOpenModal = () => {
		this.setState({ sign: true });
	};

	onOpenModalLogin = () => {
		this.setState({ login: true });
	};

	onCloseModal = () => {
		this.setState({ sign: false });
	};

	onCloseModalclose = () => {
		this.setState({ login: false });
	};
	logOut = () => {
		this.setState({ isSubmitted: false })
		ReactSession.set("username", null);
		ReactSession.set("isSubmitted", false);
		window.location.reload();

	}
	getCookie(key) {
		var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
		return b ? b.pop() : "";
	}

	//modal state end
	handleSubmit = (event) => {
		//Prevent page reload
		event.preventDefault();
		let errors = {};
		var { uname, pass } = document.forms[0];
		var name = document.getElementById("uname").value;
		var name2 = name["name"];
		var password = document.getElementById("pass").value;
		// Find user login info
		let userPass = this.state.password.value;
		let userName = this.state.username.value;
		console.log(name)

		// Compare user info
		const json = JSON.stringify({ email: name, password: password });
		console.log(json)
		if (true) {
			const res = axios({
				method: 'post',
				url: 'http://localhost:31772/api/Users/login',
				data: {
					"email": name,
					"password": password
				},
				config: {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}
			})
			//	const res = axios.post("http://localhost:31772/api/Users/login", json)
			if (res.status == 200) {
				// test for status you want, etc
				console.log(res.status)
			}
			res.then((response) => {
				if (response.status == 200) {
					console.log(response);
					console.log(response.headers)
					ReactSession.set("username", name);
					ReactSession.set("isSubmitted", true);
					ReactSession.set("token", response.headers["jwt"])
					this.state.set({ sign: true })
				}
				else {
					const error = { "name": "invalid" }
					this.setState({ errorMessages: error })
				}
			}).catch((response) => {

				const error = { "name": "invalid" }
				this.setState({ errorMessages: error })
			});


		}

	};



	render() {
		const { login, sign } = this.state;
		let button;
		if (ReactSession.get("isSubmitted")) {
			button = <button className="user_avatar" onClick={this.logOut}>

				LogOut
			</button>
		}


		else {
			button = <div style={{ display: "flex", width: "12%" }}><button className="user_avatar1" id="signup" onClick={this.onOpenModal}>SignUp</button>
				<button className="user_avatar1" id="login" onClick={this.onOpenModalLogin}>Login</button></div>
		}

		return (
			<>
				<header className="top">
					<button onClick={this.props.onSearchBtnClick} className="back_btn">

					</button>

					<Link to='/' className="logo" >
						<img src={logo} alt="menu" className="logoImg" />
					</Link>

					<div className="search">
						<input type="text" name="search" placeholder="Search" />
						<button className="search_btn">
							<img src={searchSVG} alt="menu" />
						</button>
					</div>



					<Link to='/upload' className="new_video">
						<i className="fas fa-plus-square" style={{ fontSize: "25px" }}></i>
						Add Video
					</Link>

					{button}
				</header>
				<Modal open={sign} onClose={this.onCloseModal}>
					<div className="modal-body">
						<h2>Get Started Absolutely<span> Free!</span></h2>
						<span className="subtitle">No credit card needed</span>
						<form className="contact-form form-validate3" novalidate="novalidate">
							<div className="form-group">
								<input className="form-control" type="text" name="name" id="name" placeholder="First Name" required="" autocomplete="off" aria-required="true" />

							</div>
							<div className="form-group">
								<input className="form-control" type="email" name="email" placeholder="E-mail" required="" autocomplete="off" aria-required="true" />
							</div>
							<div className="form-group">
								<input type="password" name="pass" className="form-control" placeholder="Password" required="" autocomplete="off" aria-required="true" />
							</div>
							<input className="btn-modal" id="sign_up" type="button" value="Sign Up" />
						</form>
					</div>
				</Modal>

				{// <!-- signUp End -->
					//<!-- login --> 
				}

				<Modal open={login} onClose={this.onCloseModalclose}>

					<div className="modal-body">
						<h2>Login</h2>
						<span className="subtitle">Just fill in the form below</span>
						<form className="contact-form form-validate4" novalidate="novalidate" onSubmit={this.handleSubmit}>
							<div className="form-group">
								<label for="username"> Username</label>
								<input className="form-control" type="email" name="uname" id="uname" placeholder="E-mail" required="" autocomplete="off" aria-required="true" />

							</div>
							<span style={{ color: "red" }}>{this.state.errorMessages["name"]}</span>
							<div className="form-group">
								<label for="username">Password</label>

								<input type="password" name="pass" id="pass" className="form-control" placeholder="Password" required="" autocomplete="off" aria-required="true" />

							</div>
							<span style={{ color: "red" }}>{this.state.errorMessages["pass"]}</span>
							<center><input className="btn-modal" id="login_btn" type="submit" value="Login" /></center>
						</form>
					</div>

				</Modal>

			</>
		);
	}
}
