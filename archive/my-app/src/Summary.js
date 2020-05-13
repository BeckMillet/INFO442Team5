import React, { Component } from 'react';
import './App.css';
import { Card, CardTitle, Row, Col, Jumbotron} from 'reactstrap';
import 'firebase/database';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateDailyBudget: '',
      dailyBudgetError: "",
      showHideUpdate: false,
    };
    this.fieldChange = this.fieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  fieldChange(elem) {
    const newState = {};
    newState[elem.currentTarget.name] = elem.currentTarget.value;
    this.setState(newState);
  }

  validate = () => {
    let isError = false;
    let errors = {}

    if (this.state.updateDailyBudget <= 0) {
      isError = true;
      errors.dailyBudgetError = 'Must be positive and non-zero'
    } else {
      isError = false;
      errors.amountError = ''
    }

    if (isError) {
      this.setState({
        ...this.state,
        ...errors
      })
    }

    return isError;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let err = this.validate();
    if (!err) {
      let newDateChanged = new Date();
      this.props.handleBudgetChange({
        lastDateChanged: newDateChanged.toLocaleDateString(),
        dailyBudget: Number(this.state.updateDailyBudget)
      })

      /* resets the form content */
      this.setState({
        updateDailyBudget: '',
        dailyBudgetError: ""
      })
    }
  }

  showHideButton = () => {
    let button;
    if(this.props.dailyBudget === 0){
      button = (<Button type="submit" className="btn primary">Add your daily budget</Button>)
    }
    if (this.state.updateDailyBudget !== '' & this.props.dailyBudget !== 0){
      button = (<Button type="submit" className="btn">Update!</Button>)
    }

  return button
  }


  render() {
    let overallBalance = Number(this.props.budgetToDate) + Number(this.props.dailyBudget) - Number(this.props.expensesToDate);

    return (
      <div>
        
        <Jumbotron>
          <div className="date">
            Date object here please
          </div>
 
          <Row>
            <Col>
              <Card body className = 'budget'>
                <CardTitle>Daily Budget: {this.props.dailyBudget} </CardTitle>
              </Card>
            </Col>
            <Col>
              <Card body className = 'balance'>
                <CardTitle>Overall Balance: {overallBalance} </CardTitle>
              </Card>
            </Col>
          </Row>
        </Jumbotron> 

        <form onSubmit={this.handleSubmit} noValidate>
          <TextField
            className=""
            type="number"
            name="updateDailyBudget"
            placeholder={this.props.dailyBudget.toString()}
            required
            error={this.state.dailyBudgetError.length === 0 ? false : true}
            helperText={this.state.dailyBudgetError}
            value={this.state.updateDailyBudget}
            onChange={this.fieldChange} />
          {/* button */} 
          {this.showHideButton()}
        </form>

      </div>
    )
  }
}
