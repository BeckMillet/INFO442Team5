import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import StyledFirebaseAuth from '../node_modules/react-firebaseui/StyledFirebaseAuth';
import firebase from '../node_modules/firebase';
import { Card, CardTitle, CardSubtitle, CardText } from 'reactstrap';

class App extends Component{
  componentDidMount(){
    this.setState({
      dailyBudget: 0
    })
    this.setState({
      budgetSummary: 0
    })
    this.setState({
      changeDailyBudget: 0
    })
    this.setState({
      enterTransaction: 0
    })
    this.setState({
      Date: 0
    })
  }

}

class SproutView extends Component{
  dailyBudget = () => {
  }

  budgetSummary = () => {
  }

  changeDailyBudget = () => {
  }

  enterTransaction = () => {
  }
}

class SproutModel extends Component{


}

class SproutController extends Component{

}

export default App;