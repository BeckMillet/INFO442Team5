import React, { Component } from 'react';

import './App.css';
import Main from './Main'

import StyledFirebaseAuth from '../node_modules/react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/database';
import { Row } from 'reactstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
    };
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
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      this.setState({ loading: false });
      this.setState({ user: firebaseUser });
    })

  }

  /* firebase */
  handleSignOut = () => {
    this.setState({ errorMessage: null });
    firebase.auth().signOut();
  }



  handleNewUser = () => {
    let currentUser = this.state.user.uid;
    let userRef = firebase.database().ref(currentUser);

    let lastDateOpenedRef = userRef.child('lastDateOpened');
    let dailyBudgetRef = userRef.child('dailyBudget');
    let budgetToDateRef = userRef.child('budgetToDate');
    let expensesToDateRef = userRef.child('expensesToDate');
    //let transactionsRef = userRef.child('transactions');

    let today = new Date();
    today = today.toLocaleDateString()


    userRef.once("value", snapshot => {
      if (!snapshot.exists()) {
        //constructs the schema for new users
        lastDateOpenedRef.set(today)
        dailyBudgetRef.set(0)
        /* transactionsRef.push(
          {
            "id": 1,
            "amountSpent": 0,
            "itemName": "Sample Transaction!",
            "date": today
          }) */
        budgetToDateRef.set(0)
        expensesToDateRef.set(0)
        //future iterations will allow users to create and modify a 'tag' list for categorization. Sample below
        /* let defaultTagList = ["food", "fitness", "social", "hobbies", "gas", "parking"]
        tagListRef.set(defaultTagList) */
      }
      else {
      }
    });

  }


  render() {
    let content = null;
    /* firebase userauth */
    if (this.state.loading) {
      content = (
        <div className="text-center">
          <i className="fa fa-spinner fa-spin fa-3x" aria-label="Connecting..."></i>
        </div>
      );
    } else if (!this.state.user) {
      content = (
        <div className="container">
          <h1>Sign In</h1>
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()} />
        </div>
      );
    } else {
      this.handleNewUser()
      content = (
        <div>
          <Main currentUser={this.state.user} />
          <Row className="logoutbuttonrow">
            <button className="btn logoutbutton" onClick={this.handleSignOut}>
              LOG OUT
            </button>
          </Row>
        </div>
      )
    }
    return (content);
  }

}




export default App;
