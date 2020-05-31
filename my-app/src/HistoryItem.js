import React, { Component } from 'react';
import './App.css';

import { Card, CardTitle, CardSubtitle, CardText, Row, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';
import onClickOutside from 'react-onclickoutside'

class HistoryItem extends Component {
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
    };

    handleClickOutside = evt => {
      this.setState({
        buttonsAreHidden: true
      })
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
        entryId: this.props.entryId,
        amountSpent: this.props.amountSpent
      })
      this.props.toggleButtons()
    }
  
    render() {
      let content = "";
  
      if (!this.props.buttonsAreHidden) {
        content = (
          <div>
            <Button
              onClick={this.doRemove}
              variant="outlined"
              className="removebutton">
              Remove
          </Button>
          </div>)
  
      }
  
      return content
    }
  }
  
  export default onClickOutside(HistoryItem);