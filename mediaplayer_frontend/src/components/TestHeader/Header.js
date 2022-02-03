import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from "../../assets/images/logo.png";
import playlogo2 from "../../assets/images/playlogo2.png";
import SearchIcon from '@mui/icons-material/Search';
import Login from '@mui/icons-material/Login';
import Assignment from '@mui/icons-material/Assignment';
import InputBase from '@mui/material/InputBase';
import { Link } from "react-router-dom";
import { styled, alpha, createTheme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import { purple } from '@mui/material/colors';
import { ReactSession } from 'react-client-session';
import LogoutIcon from '@mui/icons-material/Logout';
import history from '../History/History'
import "./headerStyle.css";
import axios from 'axios';
import { fontFamily } from '@mui/system';





const ResponsiveAppBar = (props) => {
    ReactSession.setStoreType("localStorage");

    const customTheme = createTheme({
        palette: {
            primary: {
                main: '#1976d2',
                contrastText: 'white',
            },
        },
    });

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.primary.main, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.contrastText, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: '40%',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '90',
                '&:focus': {
                    width: '100',
                },
            },
        },
    }));




    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [sign, setSign] = React.useState(false);
    const [login, setLogin] = React.useState(false);
    const [uname, setUname] = React.useState("invalid username");
    const [pass, setPass] = React.useState("invalid password");
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [errorMessages, setErrorMessages] = React.useState({});
    const [searchQuery, setSearchQuery] = React.useState("");
    const { disabled } = props;


    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div style={{ color: "red" }} className="error">{errorMessages.message}</div>
        );


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };


    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const onOpenModal = () => {
        setSign(true);
    };

    const onOpenModalLogin = () => {
        setLogin(true);
    };

    const onCloseModal = () => {
        setSign(false);
    };

    const onCloseModalclose = () => {
        setLogin(false);
    };
    const onSearchChange = (event) => {
        setSearchQuery(event.target.value)
        console.log(searchQuery)
    }
    const database = [
        {
            username: "user1",
            password: "pass1"
        },
        {
            username: "user2",
            password: "pass2"
        }
    ];

    const errors = {
        uname: "invalid Email",
        pass: "invalid password"
    };
    const handleSearch = () => {
        var string = document.getElementById("search").value
        console.log(string)
        if (string != "") {
            history.push('/SearchPage/' + string);
            window.location.reload();


        }

    }

    const handleSignUpSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        var emailRegex=/^([a-zA-Z0-9\._-]+)@([a-zA-Z-]+).([a-z]{2,8})(\.[a-z]{2,8})?(\.[a-z]{2,8})?$/;
        var { name,email, pass, confirmPass } = document.forms["sign-up-form"];
        if (name.value.trim() == "") {
          
          setErrorMessages({ name: "error", message: "name cannot be empty" });
         return
        }
        if (email.value.trim() == "") {
          setErrorMessages({ name: "error", message: "email cannot be empty" });
               return
                   }
        
        if(!emailRegex.test(email.value)){
          setErrorMessages({ name: "error", message: "email not valid" });
         return
        }
        if (pass.value.trim() == "") {
          
          setErrorMessages({ name: "error", message: "password cannot be empty" });
         return
        }
        if(pass.value.length<=5){
          setErrorMessages({ name: "error", message: "password lenght cannot be less than 5" });
         return
        }
        else if(pass.value != confirmPass.value)
        {
         setErrorMessages({ name: "error", message: "entered passwords do not match" });
         return
        }
       
    
        const res = axios({
          method: 'post',
          url: 'http://localhost:44307/api/Users',
          data: {
          "name":  name.value,
            "email": email.value,
            "password": pass.value
          },
          config: {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        })
        console.log("outside then")
        res.then((response) => {
            console.log("in then")
            if (response.status == 200) {
                setSign(false)
                console.log(response.status);
                //{Snack bar logic}
                console.log("user registered")
                window.location.reload();
            }
            
        }).catch((error) => {
          console.log("here in catch")
          console.log(error.response.status);
          if(error.response.status === 409){
            console.log("here in else")
            setErrorMessages({ name: "error", message: "Email already exists try to log in" });      
        
        }
        else{
          setErrorMessages({ name: "error", message: "some error occured please try again" });
        }
        
            
        });
    
      };
    


    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        var email = /^([a-zA-Z0-9\._-]+)@([a-zA-Z-]+).([a-z]{2,8})(\.[a-z]{2,8})?(\.[a-z]{2,8})?$/;
        var { uname, pass } = document.forms["sign-in-form"];
        if (uname.value.trim() == "") {

            setErrorMessages({ name: "uname", message: "cannot be empty" });
            return
        }
        else if (!email.test(uname.value)) {
            setErrorMessages({ name: "uname", message: "not valid email" });
            return
        }
        if (pass.value.trim() == "") {

            setErrorMessages({ name: "pass", message: "cannot be empty" });
            return
        }
        else if (pass.value.length <= 5) {
            setErrorMessages({ name: "pass", message: "password lenght cannot be less than 5" });
            return
        }

        // Find user login info
        //const userData = database.find((user) => user.username === uname.value);
        const res = axios({
            method: 'post',
            url: 'http://localhost:44307/api/Users/login',
            data: {
                "email": uname.value,
                "password": pass.value
            },
            config: {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        })
        console.log("outside then")
        res.then((response) => {
            console.log("in then")
            if (response.status == 200) {
                console.log(response);
                console.log(response.headers)
                console.log("name "+response.headers["uname"])
                ReactSession.set("username", response.headers["uname"]);
                ReactSession.set("isSubmitted", true);
                ReactSession.set("token", response.headers["jwt"])
                ReactSession.set("userId", response.headers["uid"])
                setLogin(false)
                window.location.reload();
            }
            if (response.status == 400) {
                console.log("here")
                setErrorMessages({ name: "uname", message: "invalid username or pass" });

            }
        }).catch((response) => {
            console.log("here")
            console.log(response.status);
            setErrorMessages({ name: "uname", message: "invalid username or pass" });
            console.log(errorMessages)

        });
        // Compare user info
        // if (userData) {

        //   if (userData.password !== pass.value) {
        //     // Invalid password
        //     setErrorMessages({ name: "pass", message: errors.pass });
        //   } else {
        //     setIsSubmitted(true);
        //     ReactSession.set("username", "Bob");
        // 		ReactSession.set("isSubmitted", true);
        // 		setLogin(false);
        // 		window.location.reload();
        //   }
        // } else {
        //   // Username not found
        //   setErrorMessages({ name: "uname", message: errors.uname });
        // }
    };



    const logOut = () => {
        setIsSubmitted(false)
        ReactSession.set("username", null);
        ReactSession.set("isSubmitted", false);
        ReactSession.set("userId", null)
        ReactSession.set("token", null)
        window.location.reload();

    }

    let button;
    if (ReactSession.get("isSubmitted")) {
        button = <Button sx={{ color: 'white', display: 'block' }} className="" onClick={logOut} startIcon={<LogoutIcon />}>

            Logout
        </Button>
    }


    else {
        button = <div style={{ display: "flex" }}><Button sx={{ color: 'white', display: 'block' }} className="" id="signup" onClick={onOpenModal} startIcon={<Assignment />}>SignUp</Button>
            <Button sx={{ color: 'white', display: 'block' }} className="" id="login" onClick={onOpenModalLogin} startIcon={<Login />}>Login</Button></div>
    }

    return (
        
        <>
            <AppBar position="fixed" sx={{
                backgroundColor: '#FF0000'
            }}>
                < Container maxWidth="false" >
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            onClick={() => { history.push("/"); window.location.reload(); }}
                            sx={{ flexGrow: 0.1, mr: 2, display: { xs: 'none', md: 'flex' }, cursor: "pointer" }}
                        >
                            <img src={playlogo2} style={{ paddingLeft: "0px", maxHeight: "40px", maxWidth: "150px" }} />
                            <h1 style={{ fontFamily: 'Lucida Sans', fontSize: '20px', paddingLeft: "10px", paddingTop: "7px" }}>Media Play</h1>
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>


                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'flex', md: 'none' }, width: "80%"
                                }}
                            >
                                {/////------------------------menu for small size-----------------------------------}
                                }
                                <ul style={{ width: "100%" }}>
                                    <li className='nav-link-small' style={{ padding: "10px" }}>
                                        <Link to='/' style={{ display: "flex", alignItems: "center" }}>
                                            <i class="fas fa-home"></i>
                                            Home
                                        </Link>
                                    </li>
                                    <li className='nav-link-small'>
                                        <Link to='/' style={{ display: "block" }}>
                                            <i class="fas fa-thumbs-up"></i>
                                            Liked Videos
                                        </Link>
                                    </li>
                                    <li className='nav-link-small'>
                                        <Link to='/' style={{ display: "block" }}>
                                            <i class="fas fa-file-video"></i>
                                            Library
                                        </Link>
                                    </li>
                                    <li className='nav-link-small'><Link to='/upload' style={{ display: "block" }}>
                                        <i class="fas fa-plus-square"></i>
                                        Add Video
                                    </Link></li>
                                </ul>
                            </Menu>
                        </Box>
                        <Box sx={{ flexGrow: 1.5 }}>
                        </Box>


                        <Search sx={{ display: "flex" }}>

                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                sx={{ width: "100%" }}
                                disabled={disabled}
                                id='search'


                            />

                            <Button sx={{ background: "white" }} onClick={handleSearch}> <SearchIcon /></Button>

                        </Search>
                        <Box sx={{ flexGrow: 0.8 }}>
                        </Box>
                        <Box sx={{ flexGrow: 0.8 }}>
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            {button}

                        </Box>
                    </Toolbar>
                </Container>
            </AppBar >
            <Modal open={sign} onClose={onCloseModal}>
                <div className="modal-body">
                    <h2>SIGN UP</h2>
                    <span className="subtitle">A warm welcome</span>
                    <form name="sign-up-form" className="contact-form form-validate3" noValidate="noValidate" onSubmit={handleSignUpSubmit}>
                        <div className="form-group">
                            <input className="form-control" type="text" name="name" id="name" placeholder="First Name" required="" autoComplete="off" aria-required="true" />

                        </div>
                       
                        <div className="form-group">
                            <input className="form-control" type="email" name="email" placeholder="E-mail" required="" autoComplete="off" aria-required="true" />
                        </div>
                   
                        <div className="form-group">
                            
                            <input type="password" name="pass" className="form-control" placeholder="Password" required="" autoComplete="off" aria-required="true" />
                        </div>
                       
                        <div className="form-group">
                            <input type="password" name="confirmPass" className="form-control" placeholder="Confirm Password" required="" autoComplete="off" aria-required="true" />
                        </div>
                        {renderErrorMessage("error")}
                        <input className="btn-modal" id="sign_up" type="button" value="Sign Up" type="submit" />
                    </form>
                </div>
            </Modal>

            {// <!-- signUp End -->
                //<!-- login --> 
            }

            <Modal open={login} onClose={onCloseModalclose}>

                <div className="modal-body">
                    <h2>Login</h2>
                    <span className="subtitle">Just fill in the form below</span>
                    <form className="contact-form form-validate4" name='sign-in-form' noValidate="noValidate" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username"> Email</label>
                            <input className="form-control" type="email" name="uname" placeholder="E-mail" required="" autoComplete="off" aria-required="true" />

                        </div>
                        {renderErrorMessage("uname")}
                        <div className="form-group">
                            <label htmlFor="username">Password</label>

                            <input type="password" name="pass" className="form-control" placeholder="Password" required="" autoComplete="off" aria-required="true" />

                        </div>
                        {renderErrorMessage("pass")}
                        <center><input className="btn-modal" id="login_btn" type="submit" value="Login" /></center>
                    </form>
                </div>

            </Modal>

        </>
    );
};
export default ResponsiveAppBar;