import React, {Component} from '../node_modules/@types/react';
import './App.css';

import StyledFirebaseAuth from '../node_modules/react-firebaseui/StyledFirebaseAuth';
import firebase from '../node_modules/firebase';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {user: null, loading: true};
  }

  uiConfig = {
    signInOptions: [{
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true
    },
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
    credentialHelper: 'none',
    signInFlow: 'popup'
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged( (firebaseUser) => {
      this.setState({loading: false});
      this.setState({user: firebaseUser});
    })
    
    
  }

  handleSignOut = () => {
    this.setState({errorMessage:null});
    firebase.auth().signOut();
  }

  render(){
    let content = null;

    if (this.state.loading) {
      content = (
        <div className="text-center">
          <i className="fa fa-spinner fa-spin fa-3x" aria-label="Connecting..."></i>
        </div>
      );
    } else if(!this.state.user) {
      content = (
        <div className="container">
          <h1>Sign Up</h1>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth = {firebase.auth()}/>
        </div>
      );
    } else {
      content = (
        <div>
          content to render here
          <button className="btn btn-warning" onClick={this.handleSignOut}>
            Log Out {this.state.user.displayName}
          </button>
        </div>
      )
    }
    return (content);
  }

}

export default App;
