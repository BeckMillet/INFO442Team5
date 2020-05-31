import React, { Component } from 'react';

import './App.css';
import Summary from './Summary'
import EntryForm from './EntryForm'
import HistoryCards from './HistoryCards'
import firebase from 'firebase/app';

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
        this.calcBudgetToDate = this.calcBudgetToDate.bind(this);
    }

    componentDidMount() {
        let currentUser = this.props.currentUser;
        this.setState({ currentUser: currentUser })

        let userRef = firebase.database().ref(currentUser.uid);
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

        document.addEventListener('click', this.calcBudgetToDate());
    }

    calcBudgetToDate() {
        console.log('updated!')
        let currentUser = this.props.currentUser.uid;
        let userRef = firebase.database().ref(currentUser);

        userRef.once("value", snapshot => {
            if (snapshot.exists()) {
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
                    val = val.toFixed(2);

                    /* firebase */
                    let budgetToDateRef = userRef.child('budgetToDate');
                    let lastDateOpenedRef = userRef.child('lastDateOpened');

                    budgetToDateRef.once("value", snapshot => {
                        if (snapshot.exists()) {
                            budgetToDateRef.set(val)
                        }
                        else {
                        }
                    });
                    lastDateOpenedRef.once("value", snapshot => {
                        if (snapshot.exists()) {
                            lastDateOpenedRef.set(today.toLocaleDateString())
                        }
                        else {
                        }
                    });


                    /* state */
                    this.setState({
                        budgetToDate: val
                    })

                    this.setState({
                        lastDateOpened: today.toLocaleDateString()
                    })


                }
            }

        });

    }
    addTransToApp = (entry) => {
        let transactions = this.state.transactions
        transactions.unshift(entry);
        let expensesToDate = Number(this.state.expensesToDate) + Number(entry.amountSpent);
        expensesToDate = expensesToDate.toFixed(2);

        this.updateFirebaseTrans(transactions, expensesToDate)
    }

    updateFirebaseTrans = (transactions, expensesToDate) => {
        /* Requirement 10 */
        let sorted = transactions.sort((a, b) => {
            return Date.parse(b.date) - Date.parse(a.date);
        });
        let id = 1;
        for (let entry of sorted) {
            entry.id = id;
            id++;
        }



        /* firebase */
        let currentUser = this.props.currentUser.uid;
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

    removeTransToApp = (entry) => {
        let transactions = this.state.transactions
        transactions.splice(entry.entryId - 1, 1);
        let expensesToDate = Number(this.state.expensesToDate) - Number(entry.amountSpent);
        expensesToDate.toFixed(2);

        this.updateFirebaseTrans(transactions, expensesToDate)

    }

    handleBudgetChange = (updates) => {
        /* firebase */
        let currentUser = this.state.currentUser.uid;
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
        let currentUser = this.props.currentUser.uid;
        let userRef = firebase.database().ref(currentUser);

        userRef.once("value", snapshot => {
            if (snapshot.exists()) {
                let today = new Date();
                let lastOpened = new Date(this.state.lastDateOpened);

                if (lastOpened.toLocaleDateString() !== today.toLocaleDateString()) {
                    this.calcBudgetToDate()
                }
            }
        })
            


            let content = (
                <div>

                    <Summary
                        calcBudgetToDate={this.calcBudgetToDate}
                        lastDateChanged={this.state.lastDateChanged}
                        dailyBudget={this.state.dailyBudget}
                        budgetToDate={this.state.budgetToDate}
                        expensesToDate={this.state.expensesToDate}
                        handleBudgetChange={this.handleBudgetChange}
                    />

                    <EntryForm
                        calcBudgetToDate={this.calcBudgetToDate}
                        addTransToApp={this.addTransToApp}
                        dailyBudget={this.state.dailyBudget}
                    />

                    {<HistoryCards
                        transactions={this.state.transactions}
                        removeTransToApp={this.removeTransToApp}
                    />}

                </div>
            )
            return (content)
        }

}