import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import HomeComponent from './components/Home';
import LoginComponent from './components/Login';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MobileDetailsComponent from './components/MobileDetails';
import { PersistGate } from 'redux-persist/integration/react';
import CartComponent from './components/Cart';
import { Link } from 'react-router-dom';
import { UserProvider } from './components/userContext';
import Footer from './components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faUserCircle, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import PageNotFound from './components/PageNotFound';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedInUser: null,
      usersDetails: [
        {
          userId: 1,
          username: 'user1',
          password: 'user1'
        },
        {
          userId: 2,
          username: 'user2',
          password: 'user2'
        }
      ]
    }
  }

  setLoggedInUser = () => {
    this.setState({
      ...this.state,
      loggedInUser: this.state.usersDetails.find(user => user.userId == localStorage["userId"])
    })
  }

  logout = () => {
    localStorage.removeItem("userId");
    this.setState({
      ...this.state,
      loggedInUser: null
    })
    this.snackbarFunction();
  }

  snackbarFunction() {
    var x = document.getElementById("snackbar");
    x.innerHTML = "You have been logged out successfully!";
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

  render() {

    if (localStorage["userId"] && !this.state.loggedInUser) {
      this.setState({
        ...this.state,
        loggedInUser: this.state.usersDetails.find(user => user.userId == localStorage["userId"])
      });
    }

    return (
      <Provider store={store}>
        <Router>
          <PersistGate persistor={persistor}>
            <div className="App">
              <UserProvider value={this.state.usersDetails}>
                <nav className="navbar navbar-expand-sm bg-dark navbar-dark sticky-top">
                  <div className="navbar-header">
                    <a className="navbar-brand" href="/">Mobile Store</a>
                  </div>
                  <div className="navbar-nav ml-auto" id="collapsibleNavbar">
                    <ul className="navbar-nav ml-auto">
                      {
                        localStorage["userId"] && this.state.loggedInUser
                          ?
                          <li className="dropdown nav-item  navbar-nav">
                            <a className="dropbtn nav-link">{this.state.loggedInUser.username}<FontAwesomeIcon icon={faCaretDown} /></a>
                            <div className="dropdown-content">
                              <a onClick={this.logout}>Logout</a>
                            </div>
                          </li>
                          :
                          <li className="nav-item"><Link className="nav-link" to={`/login`}>SignIn</Link></li>
                      }

                      <li className="nav-item navbar-nav"><Link className="nav-link" to={`/cart`} ><FontAwesomeIcon icon={faShoppingCart} /></Link></li>
                    </ul>
                  </div>
                </nav>
                <div id="snackbar"></div>

                <Switch>
                  <Route path="/mobile/:id">
                    <MobileDetailsComponent />
                  </Route>
                  <Route path="/login">
                    <LoginComponent setLoggedInUser={this.setLoggedInUser} />
                  </Route>
                  <Route path="/cart">
                    <CartComponent />
                  </Route>
                  <Route path="/" exact>
                    <HomeComponent />
                  </Route>
                  <Route path="*">
                      <PageNotFound />
                  </Route>
                </Switch>
                <Footer />
              </UserProvider>
            </div>
          </PersistGate>
        </Router>
      </Provider>

    );
  }


}

export default App;
