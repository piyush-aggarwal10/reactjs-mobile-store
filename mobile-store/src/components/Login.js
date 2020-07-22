import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import UserContext, { UserConsumer } from './userContext';

class LoginComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            redirect: false,
            usersDetails: null
        }
    }

    componentDidMount() {
        this.setUserDetails(this.context);
    }

    inputChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        var isUserLoggedIn = false;
        for (var i = 0; i < this.state.usersDetails.length; i++) {
            if (this.state.username === this.state.usersDetails[i].username && this.state.password === this.state.usersDetails[i].password) {
                localStorage.setItem('userId', this.state.usersDetails[i].userId);
                isUserLoggedIn = true;
                this.setState({ redirect: true });
                this.props.setLoggedInUser();
                break;
            }
        }

        if (!isUserLoggedIn) {
            alert("Invalid Credentials");
        }
    }

    resetForm = () => {
        this.setState({
            ...this.state,
            username: '',
            password: ''
        })
    }


    setUserDetails = (usersDetails) => {
        this.setState({
            ...this.state,
            usersDetails: usersDetails
        });
    }

    render() {

        const { username, password, redirect } = this.state;

        if (redirect) {
            return <Redirect to="/" />
        }

        return (
            <div className="login-main">
            <h4>Login</h4>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Enter username" name="username" value={username} onChange={this.inputChangeHandler} required />
                    </div>
                    <div className="form-group">
                        <input type="password" class="form-control" placeholder="Enter password" name="password" value={password} onChange={this.inputChangeHandler} required />
                    </div>
                        <button className="btn btn-primary login-submit" type="submit">Login</button>
                </form>
                <button className="btn btn-secondary login-reset" onClick={this.resetForm}>Reset</button>
            </div>
        )
    }
}

LoginComponent.contextType = UserContext

export default LoginComponent
