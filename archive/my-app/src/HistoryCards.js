import React, { Component } from 'react';
import './App.css';
import { Card, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import 'firebase/database';


export default class HistoryCards extends Component {
  formatAmountSpent = (amountSpent) => {
    amountSpent = Number(amountSpent).toFixed(2)
    amountSpent = "$" + amountSpent

    return amountSpent
  }

    render() {
      let transactions = this.props.transactions
      let renderedEntries = transactions.map((eachEntry) => {
        /* TODO fix each child should have a unique key*/
        return (
          <div>
            <Card>
              <CardTitle> {this.formatAmountSpent(eachEntry.amountSpent)} </CardTitle>
              <CardSubtitle> {eachEntry.date} </CardSubtitle>
              <CardText>{eachEntry.itemName} </CardText>
            </Card>
          </div>
        )
      });
      return (
        <div>
          History Section
        {renderedEntries}
        </div>
      )
    }
  }