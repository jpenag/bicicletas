import React, {Component} from "react";
import logo from './images/logo.png';
import './App.css';
import { withRouter } from "react-router";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      response: '',
      post: '',
      responseToPost: '',
      isLogin: false,
      userData: ''
    };
  }


  componentDidMount() {
    const userData = sessionStorage.getItem("userData");
    const user = JSON.parse(userData);
    if (userData) {
      this.setState({ isLogin: true });
      this.setState({ userData: user.name });
      this.props.history.push("/views/Home");
    }
  }

  render() {
    return (
      <div className="App">
        <br /><br /><br />
        <img src={logo} className="App-logo" alt="logo" />
        <br /><br /><br />
        {!this.state.isLogin &&
        <h4>Para empezar, por favor inicie sesion con una cuenta de google</h4>}
      </div>
    );
  }
}

export default withRouter(App);
