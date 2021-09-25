import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import GoogleLogin from 'react-google-login';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
          isLogin: false,
          userData: ''
        }
    }

    componentDidMount() {
        const userData = sessionStorage.getItem("userData");
        const user = JSON.parse(userData);
        if (userData) {
            this.setState({ isLogin: true });
            this.setState({ userData: user.name });
        }
    }

    responseGoogle = (response) => {
        if(response.profileObj.googleId) {
            this.setState({ userData: response.profileObj.name });
            this.setState({ isLogin: true });
            sessionStorage.setItem("userData", JSON.stringify(response.profileObj));
            this.props.history.push("/views/Home");
        }
    };

    logout = e => {
        e.preventDefault();
        sessionStorage.clear();
        this.setState({ isLogin: false });
        this.setState({ userData: '' });
        this.props.history.push("/");
    };

    // componentWillReceiveProps(props) {
    //     this.setState({ login: props.login })
    //     this.setState({ nombreUsuario: props.nombreUsuario })
    // }

    render() {
    return (
        <div className="container" style={{ padding: 0, margin: 0, width: '100%', maxWidth: '100%' }}>
            <div className="row" style={{ marginRight: '0px' }}>
                <div className="col-4 App-header" style={{ alignItems: 'flex-start' }}>
                    <p className="usuario">{this.state.userData}</p>
                </div>
                <div className="col-8 App-header">
                    <nav>
                        {this.state.isLogin &&
                        <NavLink exact className="itemHeader" activeClassName="active" to="/views/Home">
                            Home
                        </NavLink>}
                        {!this.state.isLogin &&
                        <NavLink exact className="itemHeader" activeClassName="active" to="/">
                            Home
                        </NavLink>}&nbsp;
                        {this.state.isLogin &&
                        <NavLink className="itemHeader" activeClassName="active" to="/views/Bicicletas">
                            Bicicletas
                        </NavLink>}&nbsp;
                        <NavLink className="itemHeader" activeClassName="active" to="/views/Alquiler">
                            Alquiler
                        </NavLink>&nbsp;
                        {!this.state.isLogin &&
                        <GoogleLogin
                        clientId="1027776016751-2djjsclb41293rbdc8splr67oigougej.apps.googleusercontent.com"
                        buttonText="Ingresar"
                        render={ renderProps => (
                            <NavLink onClick={renderProps.onClick} className="itemHeader" activeClassName="active" to="/">
                            Login
                            </NavLink>
                        )}
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                      />}
                      {this.state.isLogin &&
                        <NavLink onClick={this.logout} className="itemHeader" activeClassName="active" to="/views/bicicletas">
                            Logout
                        </NavLink>}
                    </nav>
                </div>
            </div>
        </div>
    );
    }
}

export default withRouter(Header);