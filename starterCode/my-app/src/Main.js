import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/database';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = { currentUser: null, entries: [], taglist: [], startDate: null, dailyBudget: null };; //tester code
    };
}