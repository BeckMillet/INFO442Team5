import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Container, Row } from 'reactstrap';

import InputAdornment from '@material-ui/core/InputAdornment';

export default class EntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entryAmount: '',
      amountError: "",
      entryDate: '',
      entryName: '',
      nameError: ""
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
    
    if (this.state.entryAmount < .01) {
      isError = true;
      errors.amountError = 'Must be positive and non-zero'
    } else {
      errors.amountError = ''
    }

    if (this.state.entryName === "") {
      isError = true;
      errors.nameError = 'Required!'
    } else if (this.state.entryName.length > 24) {
      isError = true;
      errors.nameError = 'must be less than 25 char'
    }else {
      errors.nameError = ''
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
      let formDate = this.state.entryDate;
      if (formDate === '') {
        /* requirement 9 */
        formDate = new Date();
      } else {
        /* requirement 8 */
        formDate = formDate.substring(5, 10) + "-" + formDate.substring(0, 4)
        formDate = new Date(formDate);
      };
      this.props.addTransToApp({
        id: 0,
        amountSpent: Number(this.state.entryAmount).toFixed(2).toString(),
        date: formDate.toLocaleDateString(),
        itemName: this.state.entryName
      })

      /* resets the form content */
      this.setState({
        entryAmount: '',
        entryName: '',
        amountError: "",
        nameError: ""
      })
    }
  }

  getToday() {
    let today = new Date()
    let year = today.getFullYear().toString()
    let month = today.getMonth() + 1
    if (month < 10) {
      month = month.toString()
      month = "0" + month
    } else {
      month = month.toString()
    }
    let day = today.getDate().toString()
    if (day < 10) {
      day = day.toString()
      day = "0" + day
    } else {
      day = day.toString()
    }

    return year + "-" + month + "-" + day
  }

  render() {
    let today = this.getToday()
    let content;

    if (this.props.dailyBudget !== 0) {
      content = (
        <form onSubmit={this.handleSubmit} className="" noValidate>
          

          <TextField
            required
            id="standard-required entryFormItemName"
            name="entryName"
            className="itemform"
            value={this.state.entryName}
            placeholder="Item Name"
            onChange={this.fieldChange}
            type="text"
            variant="outlined"
            error={this.state.nameError.length === 0 ? false : true}
            helperText={this.state.nameError}
          />

          <TextField
            name="entryAmount"
            id="standard-required"
            type="number"
            variant="outlined"
            className="amountform"
            value={this.state.entryAmount}
            error={this.state.amountError.length === 0 ? false : true}
            helperText={this.state.amountError}
            onChange={this.fieldChange}
            placeholder="Amount"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  $
                </InputAdornment>
              ),
            }}
          />

          <TextField
            id="entryFormDate"
            name="entryDate"
            label=""
            variant="outlined"
            onChange={this.fieldChange}
            type="date"
            className="dateform"
            defaultValue={today}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Row className="submitbuttonrow">
            <Button 
              type="submit" 
              variant="outlined" 
              className="submitbutton">
                Submit
            </Button>
          </Row>
        </form>
      )
    } else {
      content = (
        <div>
          To get started, add your daily budget in the form above!
        </div>
      )
    }
    return (
      <div>
      <div className="transactionBanner">
        ENTER TRANSACTION
        </div>
        <Container className="form">
        {content}
        </Container>
      </div>
    )
  }
}
