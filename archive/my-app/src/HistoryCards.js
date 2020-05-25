import React, { Component } from 'react';
import './App.css';
import { Card, CardTitle, CardSubtitle, CardText, Row, Col, Container } from 'reactstrap';
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
            <Row>
            {/* offset wont create distance */}

            <Col className = "cardcol" sm="12" md={{ size: 6, offset: 5 }}>
            <Card className="shadow-sm bg-white rounded history">   
            <Row>
            <CardTitle className="col-7 historytitle"> {eachEntry.itemName} </CardTitle>
            <CardText className=" col-5 historyamount">{this.formatAmountSpent(eachEntry.amountSpent)} </CardText>
            </Row>
            <Col>
            <CardSubtitle className="historydate"> {eachEntry.date} </CardSubtitle>
            </Col>
            
            </Card>
            </Col>
            </Row>
          </div>
        )
      });
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