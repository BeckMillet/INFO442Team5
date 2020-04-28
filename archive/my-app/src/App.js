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
      lastDateChanged: '',
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
    this.setState({
      transactions: SAMPLE_TRANSACTIONS.transactions
    })
    this.setState({
      dailyBudget: 25
    })
    this.setState({
      lastDateChanged: '4/20/2020'
    })
    this.setState({
      expensesToDate: 79.36
    })

    this.setState({
      budgetToDate: 100
    })

    this.setState({
      lastDateOpened: new Date('4/23/2020')
    })

  }

  /* firebase */
  handleSignOut = () => {
    this.setState({ errorMessage: null });
    firebase.auth().signOut();
  }


  addTransToApp = (entry) => {
    let transactions = this.state.transactions
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
    /* updates expenses to date */
    let expensesToDate = this.state.expensesToDate + entry.amountSpent;
    this.setState({
      expensesToDate: expensesToDate
    });
  }

  handleBudgetChange = (updates) => {
    this.setState({
      lastDateChanged: updates.lastDateChanged
    })
    this.setState({
      dailyBudget: updates.dailyBudget
    })
  }

  calcBudgetToDate = () => {
    let today = new Date();
    let lastOpened = new Date(this.state.lastDateOpened);

    if (lastOpened.toLocaleDateString() !== today.toLocaleDateString()) {

      /* caluculate days that have passed. I know its ugly. I hate it */
      lastOpened = Date.UTC(lastOpened.getFullYear(), lastOpened.getMonth(), lastOpened.getDate());
      let present = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
      let oneDay = 1000 * 60 * 60 * 24;
      let days = ((present -oneDay) - lastOpened) / oneDay;

      /* calculates amount to add to budget to date */
      let val = this.state.budgetToDate + days * this.state.dailyBudget
      this.setState({
        budgetToDate: val
      })

      this.setState({
        lastDateOpened: today.toLocaleDateString()
      })
    
    }

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
      this.calcBudgetToDate()
      content = (

        <div>
          {/* Beginning of main page */}

          <Summary
            lastDateChanged={this.state.lastDateChanged}
            dailyBudget={this.state.dailyBudget}
            budgetToDate={this.state.budgetToDate}
            expensesToDate={this.state.expensesToDate}
            handleBudgetChange={this.handleBudgetChange}
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
  constructor(props) {
    super(props);
    this.state = {
      updateDailyBudget: '',
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
    
    let newDateChanged = new Date();
    this.props.handleBudgetChange({
      lastDateChanged: newDateChanged.toLocaleDateString(),
      dailyBudget: Number(this.state.updateDailyBudget)
    })

    /* resets the form content */
    this.setState({
      updateDailyBudget: '',
    })

  }


  render() {
    let rollover = this.props.budgetToDate + this.props.dailyBudget - this.props.expensesToDate;
    return (
      <div>
        <form onSubmit={this.handleSubmit} noValidate>
          <div>
            <input className="form-control"
              type="number"
              name="updateDailyBudget"
              placeholder='change daily budget'
              required
              /* TODO require positive non-zero numbers */
              value={this.state.updateDailyBudget}
              onChange={this.fieldChange} />
          </div>


          {/* button */}
          <button type="submit" className="btn">Update!</button>

        </form>

        <div>
          <Card>
            <CardTitle>Rollover is:  {rollover} </CardTitle>
            <CardSubtitle>Your daily budget is: {this.props.dailyBudget} </CardSubtitle>
            <CardText> Your budget to date is: {(this.props.budgetToDate + this.props.dailyBudget)}</CardText>
          </Card>
        </div>
      </div>
    )
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
          <button type="submit" className="btn">Submit!</button>

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


export default App;
