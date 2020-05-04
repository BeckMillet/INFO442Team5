import React, { Component } from 'react';

import './App.css';
import Summary from './Summary'
import EntryForm from './EntryForm'
import HistoryCards from './HistoryCards'

import StyledFirebaseAuth from '../node_modules/react-firebaseui/StyledFirebaseAuth';
import firebase from '../node_modules/firebase';
import 'firebase/database';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            lastDateChanged: '',
            lastDateOpened: '',
            dailyBudget: '',
            budgetToDate: '',
            expensesToDate: '',
            transactions: []
        };
    }

    componentDidMount() {
        let currentUser = this.props.currentUser;
        this.setState({ currentUser: currentUser })

        let userRef = firebase.database().ref(currentUser.displayName);
        let lastDateOpenedRef = userRef.child('lastDateOpened');
        let lastDateChangedRef = userRef.child('lastDateChanged');
        let dailyBudgetRef = userRef.child('dailyBudget');
        let budgetToDateRef = userRef.child('budgetToDate');
        let expensesToDateRef = userRef.child('expensesToDate');
        let transactionsRef = userRef.child('transactions');

        lastDateOpenedRef.on('value', (snapshot) => {
            //captures the values
            let lastDateOpened = snapshot.val();
            this.setState({ lastDateOpened: lastDateOpened })
        });

        lastDateChangedRef.on('value', (snapshot) => {
            //captures the values
            let lastDateChanged = snapshot.val();
            this.setState({ lastDateChanged: lastDateChanged })
        });

        dailyBudgetRef.on('value', (snapshot) => {
            //captures the values
            let dailyBudget = snapshot.val();
            this.setState({ dailyBudget: dailyBudget })
        });

        budgetToDateRef.on('value', (snapshot) => {
            //captures the values
            let budgetToDate = snapshot.val();
            this.setState({ budgetToDate: budgetToDate })
        });

        expensesToDateRef.on('value', (snapshot) => {
            //captures the values
            let expensesToDate = snapshot.val();
            this.setState({ expensesToDate: expensesToDate })
        });

        transactionsRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
            //captures the values
            let transactions = snapshot.val();

            //places the values into a local array
            let localArr = Object.values(transactions)
            this.setState({ transactions: localArr })
            }
        });

        this.calcBudgetToDate()
    }

    calcBudgetToDate() {
        let currentUser = this.props.currentUser.displayName;
        let userRef = firebase.database().ref(currentUser);

        userRef.once("value", snapshot => {
            let today = new Date();
            let lastOpened = new Date(this.state.lastDateOpened);

            if (lastOpened.toLocaleDateString() !== today.toLocaleDateString()) {

                /* caluculate days that have passed. I know its ugly. I hate it */

                lastOpened = Date.UTC(lastOpened.getFullYear(), lastOpened.getMonth(), lastOpened.getDate());
                let present = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
                let oneDay = 1000 * 60 * 60 * 24;
                let days = ((present - oneDay) - lastOpened) / oneDay;

                /* calculates amount to add to budget to date */

                let val = days * Number(this.state.dailyBudget) + Number(this.state.budgetToDate)

                /* firebase */
                let budgetToDateRef = userRef.child('budgetToDate');
                let lastDateOpenedRef = userRef.child('lastDateOpened');

                budgetToDateRef.set(val)
                lastDateOpenedRef.set(today.toLocaleDateString())

                /* state */
                this.setState({
                    budgetToDate: val
                })

                this.setState({
                    lastDateOpened: today.toLocaleDateString()
                })


            }

        });

    }
    addTransToApp = (entry) => {
        let transactions = this.state.transactions
        transactions.unshift(entry);

        /* Requirement 10 */
        let sorted = transactions.sort((a, b) => {
            return Date.parse(b.date) - Date.parse(a.date);
        });
        let id = 1;
        for (let entry of sorted) {
            entry.id = id;
            id++;
        }

        let expensesToDate = Number(this.state.expensesToDate) + Number(entry.amountSpent);

        /* firebase */
        let currentUser = this.props.currentUser.displayName;
        let userRef = firebase.database().ref(currentUser);

        let transactionsRef = userRef.child('transactions');
        transactionsRef.set(sorted)

        let expensesToDateRef = userRef.child('expensesToDate');
        expensesToDateRef.set(expensesToDate)

        /* state */
        this.setState({
            transactions: sorted
        });        
        this.setState({
            expensesToDate: expensesToDate
        });
    }


    handleBudgetChange = (updates) => {
        /* firebase */
        let currentUser = this.state.currentUser.displayName;
        let userRef = firebase.database().ref(currentUser);
        let lastDateChangedRef = userRef.child('lastDateChanged');
        let dailyBudgetRef = userRef.child('dailyBudget');

        lastDateChangedRef.set(updates.lastDateChanged)
        dailyBudgetRef.set(updates.dailyBudget)

        /* state */
        this.setState({
            lastDateChanged: updates.lastDateChanged
        })
        this.setState({
            dailyBudget: updates.dailyBudget
        })
    }


    render() {
        //this.calcBudgetToDate()
        let content = (
            <div>
                {/* Beginning of main page */}

                <Summary
                    lastDateChanged={this.state.lastDateChanged}
                    dailyBudget={this.state.dailyBudget}
                    budgetToDate={this.state.budgetToDate}
                    expensesToDate={this.state.expensesToDate}
                    handleBudgetChange={this.handleBudgetChange}
                /* calcBudgetToDate={this.calcBudgetToDate} */
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

            </div>
        )
        return (content)
    }

}