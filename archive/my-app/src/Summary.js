import React, { Component } from 'react';
import './App.css';
import firebase from '../node_modules/firebase';
import { Card, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import 'firebase/database';

export default class Summary extends Component {
    constructor(props) {
      super(props);
      this.state = {
        updateDailyBudget: '',
      };
      this.fieldChange = this.fieldChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
  
    fieldChange(elem) {
      const newState = {};
      newState[elem.currentTarget.name] = elem.currentTarget.value;
      this.setState(newState);
    }
  
    handleSubmit = (event) => {
      event.preventDefault();
  
      let newDateChanged = new Date();
      this.props.handleBudgetChange({
        lastDateChanged: newDateChanged.toLocaleDateString(),
        dailyBudget: Number(this.state.updateDailyBudget)
      })
  
      /* resets the form content */
      this.setState({
        updateDailyBudget: '',
      })
  
    }
  
  
    render() {
      let overallBalance = Number(this.props.budgetToDate) + Number(this.props.dailyBudget) - Number(this.props.expensesToDate);
      return (
        <div className="">
          <div>
            Summary Section
          </div>
          <form onSubmit={this.handleSubmit} noValidate>
            <div>
              <input className="form-control"
                type="number"
                name="updateDailyBudget"
                placeholder='change daily budget'
                required
                /* TODO require positive non-zero numbers */
                value={this.state.updateDailyBudget}
                onChange={this.fieldChange} />
            </div>
  
  
            {/* button */}
            <button type="submit" className="btn">Update!</button>
  
          </form>
  
          <div>
            <Card>
              <CardTitle>Overall Balance is:  {overallBalance} </CardTitle>
              <CardSubtitle>Your daily budget is: {this.props.dailyBudget} </CardSubtitle>
              <CardText> Your budget to date is: {(this.props.budgetToDate + this.props.dailyBudget)}</CardText>
            </Card>
          </div>
        </div>
      )
    }
  }
  