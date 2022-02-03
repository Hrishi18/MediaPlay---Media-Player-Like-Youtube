import React, { Component } from "react";
import home from "../../assets/images/home.svg";
import homeRed from "../../assets/images/homeRed.svg";
import { Link } from "react-router-dom";
import library from "../../assets/images/library.svg";
import subscriptions from "../../assets/images/subscriptions.svg";
import trending from "../../assets/images/trending.svg";
import Box from '@mui/material/Box';
import "./small-sidebar.css";
import ReactSession from "react-client-session/dist/ReactSession";
import Snackbar from '@mui/material/Snackbar';
export default class SmallSidebar extends Component {
	constructor(props) {
		super(props)

		this.state = {
			openSnack: false,

		}
	}
	handleClick = () => {
		this.setState({ openSnack: true });
		console.log(this.state.openSnack)
	};
	handleClose = () => {
		this.setState({ openSnack: false });
	};
	render() {
		let loginNavigation;
		if (ReactSession.get("isSubmitted")) {
			loginNavigation = <ul>
				<li>
					<Link to='/' className="new_video" style={{ display: "block" }}>
						<i class="fas fa-home"></i>
						Home
					</Link>
				</li>
				<li>
					<Link to='/LikedPage' className="new_video" style={{ display: "block" }}>
						<i class="fas fa-thumbs-up"></i>
						Liked Videos
					</Link>
				</li>
				<li>
					<Link to='/LibraryPage' className="new_video" style={{ display: "block" }}>
						<i class="fas fa-file-video"></i>
						Library
					</Link>
				</li>
				<li><Link to='/upload' className="new_video" style={{ display: "block" }}>
					<i class="fas fa-plus-square"></i>
					Add Video
				</Link></li>
			</ul>
		}
		else {
			loginNavigation = <ul>
				<li>
					<Link to='/' className="new_video" style={{ display: "block" }}>
						<i class="fas fa-home"></i>
						Home
					</Link>
				</li>
				<li>
					<Link onClick={this.handleClick} className="new_video" style={{ display: "block" }}>
						<i class="fas fa-thumbs-up"></i>
						Liked Videos
					</Link>
				</li>
				<li>
					<Link onClick={this.handleClick} className="new_video" style={{ display: "block" }}>
						<i class="fas fa-file-video"></i>
						Library
					</Link>
				</li>
				<li><Link onClick={this.handleClick} className="new_video" style={{ display: "block" }}>
					<i class="fas fa-plus-square"></i>
					Add Video
				</Link></li>
			</ul>
		}
		const { openSnack } = this.state;
		return (

			<section class="sidebar_small" >
				<Box position="fixed" sx={{ width: 76, zIndex: '100', bgcolor: '#EEEEEE', display: { xs: 'none', md: 'flex' } }}>
					{loginNavigation}
					<Snackbar
						open={openSnack}
						autoHideDuration={3000}
						onClose={this.handleClose}
						message="Please Sign-In first"


					/>
				</Box>
			</section >

		);
	}
}