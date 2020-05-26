import React, { Component } from 'react';
import './App.css';
import { Card, CardTitle, CardSubtitle, CardText, Row, Col, Container } from 'reactstrap';
import 'firebase/database';
import Button from '@material-ui/core/Button';


export default class HistoryCards extends Component {


  render() {
    let transactions = this.props.transactions
    let renderedEntries = transactions.map((eachEntry) => {
      /* TODO fix each child should have a unique key*/
      return (
        <HistoryItem
          key={eachEntry.id}
          id={eachEntry.id}
          itemName={eachEntry.itemName}
          amountSpent={eachEntry.amountSpent}
          date={eachEntry.date}
          removeTransToApp={this.props.removeTransToApp}
        //doSomething={this.doSomething} 
        />
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

export class HistoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonsAreHidden: false,
    };
  }

  componentDidMount() {
    this.setState({
      buttonsAreHidden: true
    })
  }


  formatAmountSpent = (amountSpent) => {
    amountSpent = Number(amountSpent).toFixed(2)
    amountSpent = "$" + amountSpent

    return amountSpent
  }

  toggleButtons = (evt) => {  //click handlier
    this.setState({
      buttonsAreHidden: !this.state.buttonsAreHidden
    })

    //this.props.howToToggle(this.props.task.id)
    //App.toggleTask(this.id);
  };

  render() {
    return (
      <div>
        <Row>
          {/* offset wont create distance */}

          <Col className="cardcol" sm="12" md={{ size: 6, offset: 5 }}>
            <Card className="shadow-sm bg-white rounded history" onClick={this.toggleButtons} >
              <Row>
                <CardTitle className="col-7 historytitle"> {this.props.itemName} </CardTitle>
                <CardText className="col-5 historyamount">{this.formatAmountSpent(this.props.amountSpent)} </CardText>
              </Row>
              <Col>
                <CardSubtitle className="historydate"> {this.props.date} </CardSubtitle>
              </Col>
            </Card>
          </Col>
          <RemovalButtons
            entryId={this.props.id}
            amountSpent={this.props.amountSpent}
            buttonsAreHidden={this.state.buttonsAreHidden}
            removeTransToApp={this.props.removeTransToApp}
            toggleButtons={this.toggleButtons}
          />
        </Row>
      </div>
    )
  }
}

class RemovalButtons extends Component {

  doRemove = (evt) => {
    this.props.removeTransToApp({
      entryId : this.props.entryId,
      amountSpent: this.props.amountSpent
    })
    this.props.toggleButtons()
  }

  render() {
    let content;
    if (!this.props.buttonsAreHidden) {
      content = (
        <div>
          <Button
            onClick={this.doRemove}
            variant="outlined"
            className="submitbutton">
            Remove
        </Button>
        </div>)
    }
    else {
      content = "";
    }

    return content
  }
}