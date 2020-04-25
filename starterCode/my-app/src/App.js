import React, { Component } from 'react';
import './App.css';
import StyledFirebaseAuth from '../node_modules/react-firebaseui/StyledFirebaseAuth';
import firebase from '../node_modules/firebase';
import { Card, CardTitle, CardSubtitle, CardText } from 'reactstrap';

//test data
import SAMPLE_TRANSACTIONS from './testData.json'; //a sample list of dogs (model)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      lastDateOpened: '',
      dailyBudget: '',
      budgetToDate: '',
      expensesToDate: '',
      transactions: []
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
    /* TODO delete sample data */
    this.setState({ transactions: SAMPLE_TRANSACTIONS.transactions })
  }

  /* firebase */
  handleSignOut = () => {
    this.setState({ errorMessage: null });
    firebase.auth().signOut();
  }


  addTransToApp = (entry) => {
    let transactions =  this.state.transactions
    transactions.push(entry);

    /* Requirement 10 */
    let sorted = transactions.sort((a, b) => {
      return Date.parse(b.date) - Date.parse(a.date);
    });
    let id = 1;
    for (let entry of sorted) {
      entry.id = id;
      id++;
    }
    this.setState({
      transactions: sorted
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
          <h1>Sign Up</h1>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      );
    } else {
      content = (

        <div>
          {/* Beginning of main page */}

          <Summary
            lastDateOpened={this.state.lastDateOpened}
            dailyBudget={this.state.dailyBudget}
            budgetToDate={this.state.budgetToDate}
            expensesToDate={this.state.expensesToDate}
          />
          {/* Beginning of Entry Form */}
          <EntryForm
            addTransToApp={this.addTransToApp}
          />
          {/* End of Entry Form */}

          {/* Beginning of history */}

          {<HistoryCards
            transactions={this.state.transactions} />}

          {/* End of main page */}
          <button className="btn btn-warning" onClick={this.handleSignOut}>
            Log Out {this.state.user.displayName}
          </button>
        </div>
      )
    }
    return (content);
  }

}

class Summary extends Component {


  render() {
    let rollover = this.props.budgetToDate - this.props.expensesToDate;

    return 'the summary!'
  }
}

class EntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entryAmount: '',
      entryDate: '',
      entryName: ''
    };
    this.fieldChange = this.fieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fieldChange(elem) {
    const newState = {};
    newState[elem.currentTarget.name] = elem.currentTarget.value;
    this.setState(newState);
  }

  handleSubmit = (event) => {

    event.preventDefault();
    let formDate = this.state.entryDate;
    if (formDate === '') {
      /* requirement 9 */
      formDate = new Date();
    } else {
      /* requirement 8 */
      formDate = new Date(formDate);
    };
    this.props.addTransToApp({
      amountSpent: this.state.entryAmount,
      date: formDate.toLocaleDateString(),
      itemName: this.state.entryName
    })

    /* resets the form content */
    this.setState({
      entryAmount: '',
      entryName: '',
      entryDate: '',
    })

  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} noValidate>
          <div>

            {/* FormFields */}
            <div className='card'>
              <div>
                <input className="form-control"
                  type="number"
                  name="entryAmount"
                  placeholder="Amount*"
                  required
                  /* TODO require positive non-zero numbers */
                  value={this.state.entryAmount}
                  onChange={this.fieldChange} />
              </div>
              <div>
                <input className="form-control"
                  type="text"
                  name="entryName"
                  placeholder="Item name"
                  /* TODO add a maximimum length */
                  value={this.state.entryName}
                  onChange={this.fieldChange} />
              </div>
              <div>
                <input className="form-control"
                  type="date"
                  name="entryDate"
                  placeholder=""
                  /* TDO how to signal that this autofills if empty? */
                  value={this.state.entryDate}
                  onChange={this.fieldChange} />
              </div>
            </div>

          </div>

          {/* FormSubmit */}
          <button type="submit" className="btn btn-block btn-dark margin">Submit!</button>

        </form>
      </div>)
  }
}

class HistoryCards extends Component {
  render() {
    let transactions = this.props.transactions
    let renderedEntries = transactions.map((eachEntry) => {
      /* TODO fix each child should have a unique key*/
      return (
        <div>
          <Card>
            <CardTitle> {eachEntry.amountSpent} </CardTitle>
            <CardSubtitle> {eachEntry.date} </CardSubtitle>
            <CardText>{eachEntry.itemName} </CardText>
          </Card>
        </div>

      )
    });
    return renderedEntries
  }
}

function daysBetween(passedDate) {
  let present = new Date();
  passedDate = new Date(passedDate);
  let days = (present.getTime() - passedDate.getTime()) / (1000 * 3600 * 24);
  return days;
}


export default App;
