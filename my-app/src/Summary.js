import React, { Component } from 'react';
import './App.css';
import { Card, CardTitle, Row, Jumbotron, CardSubtitle } from 'reactstrap';
import 'firebase/database';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
// import PropTypes from "prop-types";
// import { withStyles } from "@material-ui/core/styles";

// const styles = {
//   root: {
//     background: "black"
//   },
//   input: {
//     color: "white"
//   }
// };


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
      let rounded = Number(this.state.updateDailyBudget).toFixed(2)
      this.props.handleBudgetChange({
        lastDateChanged: newDateChanged.toLocaleDateString(),
        dailyBudget: rounded
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
    if (this.props.dailyBudget === 0) {
      button = (
        <Button
          type="submit"
          className="btn primary">
          Add your daily budget
        </Button>
      )
    }
    if (this.state.updateDailyBudget !== '' & this.props.dailyBudget !== 0) {
      button = (
        <Button
          type="submit"
          className="btn">
          Update!
        </Button>
      )
    }

    return button
  }

  calcMonthName() {
    let month = new Array(12);
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    return month;
  }

  render() {
    let overallBalance = Number(this.props.budgetToDate) + Number(this.props.dailyBudget) - Number(this.props.expensesToDate);

    let today = new Date();
    let month = this.calcMonthName()
    today = month[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear()

    let placeholder = 0
    if (this.props.dailyBudget != null) {
      placeholder = this.props.dailyBudget.toString()
    }

    return (
      <div>

        <Jumbotron>
          <div className="date">
            {today}
          </div>
          <form onSubmit={this.handleSubmit} noValidate>
            <Row className='head'>

              <Card className='col-6 budget'>
                <CardTitle className="budgetTitle">Daily Budget:
                     <TextField
                    type="number"
                    name="updateDailyBudget"
                    variant="outlined"
                    placeholder={placeholder}
                    required
                    error={this.state.dailyBudgetError.length === 0 ? false : true}
                    helperText={this.state.dailyBudgetError}
                    value={this.state.updateDailyBudget}
                    onChange={this.fieldChange}

                    InputProps={{

                      startAdornment: (
                        <InputAdornment className="" position="start">
                          $
                        </InputAdornment>
                      ),
                    }}
                  />
                </CardTitle>
              </Card>


              <Card className='col-6 balance'>
                <CardTitle>Overall Balance:</CardTitle>
                <CardSubtitle className='balanceSub'>${overallBalance}</CardSubtitle>
              </Card>

            </Row>
            {this.showHideButton()}
          </form>
        </Jumbotron>



      </div>
    )
  }
}
