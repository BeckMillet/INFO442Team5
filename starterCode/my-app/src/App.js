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
      entryAmount: '',
      entryDate: '',
      entryName: '',
      dailyBudget: '',
      budgetToDate: '',
      expensesToDate: '',
      transactions: []
    };
    this.fieldChange = this.fieldChange.bind(this);
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

    /* Submits the form content to the transaction list in state */
    /* TODO add a sorting algorithm that handles a user entering a historical date */
    this.state.transactions.push({
      amountSpent: this.state.entryAmount,
      date: formDate,
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
          {/* {console.log(this.state.transactions)} */} {/* test */}
          {/* Beginning of main page */}



          <div>{/* Beginning of Entry Form */}
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
          </div>{/* End of Entry Form */}

          {/* Beginning of history */}

          
          {<HistoryCards transactions={this.state.transactions} />}

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
