import React from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';
import HomePage from './containers/HomePage/HomePage'
import UploadPage from './containers/UploadPage/UploadPage'
import SearchPage from './containers/SearchPage/SearchPage'
import LikedPage from './containers/LikedPage/LikedPage'
import LibraryPage from './containers/LibraryPage/LibraryPage'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import WatchPage from './containers/WatchPage/WatchPage';
import SmallSidebar from './components/SmallSidebar/SmallSidebar'
import Header from './components/TestHeader/Header'


class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
        <Header />
        <div className='below-navigation'>
        <SmallSidebar/>
        <div style={ {width : "95%", marginTop: "65px"}}>
          <Switch>
            <Route exact path='/' >
              <HomePage />
            </Route>

            <Route exact path='/watch/:id' >
              <WatchPage />
            </Route>

            <Route exact path='/Upload' >
              <UploadPage />
            </Route>

            <Route exact path='/SearchPage/:id' >
              <SearchPage />
            </Route>

            <Route exact path='/LibraryPage' >
              <LibraryPage />
            </Route>

            <Route exact path='/LikedPage' >
              <LikedPage />
            </Route>

          </Switch>
          </div>
          </div>
        </Router>
        
        </div>
       
     
    );
  }
}

export default App;