import React, { Component } from 'react';
import './App.css';
import { Container } from 'reactstrap';
import 'firebase/database';

import HistoryItem from './HistoryItem'


export default class HistoryCards extends Component {
  render() {
    let transactions = this.props.transactions
    let renderedEntries = "Looks like you haven't added any transactions!"

    if (Object.keys(transactions).length > 0) {
      renderedEntries = transactions.map((eachEntry) => {

        return (
          <HistoryItem
            key={eachEntry.id}
            id={eachEntry.id}
            itemName={eachEntry.itemName}
            amountSpent={eachEntry.amountSpent}
            date={eachEntry.date}
            removeTransToApp={this.props.removeTransToApp}
          />
        )
      });
    }
    return (
      <div>
        <div className="activityBanner">LATEST ACTIVITY</div>
        <Container className="historyContainer">
          {renderedEntries}
        </Container>
      </div>
    )

  }
}

