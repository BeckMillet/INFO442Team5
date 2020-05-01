import React, { Component } from 'react';
import './App.css';
import firebase from '../node_modules/firebase';
import { Card, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import 'firebase/database';


export default class HistoryCards extends Component {
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