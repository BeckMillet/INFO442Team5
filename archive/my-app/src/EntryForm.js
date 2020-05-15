import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { Container } from 'reactstrap';

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
      isError = false;
      errors.amountError = ''
    }

    if (this.state.entryName === "") {
      isError = true;
      errors.nameError = 'Required!'
    } else {
      isError = false;
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
        amountSpent: this.state.entryAmount,
        date: formDate.toLocaleDateString(),
        itemName: this.state.entryName
      })

      /* resets the form content */
      this.setState({
        entryAmount: '',
        entryName: '',
        entryDate: '',
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
          <CurrencyTextField
            name="entryAmount"
            id="standard-required"
            currencySymbol="$"
            decimalCharacter="."
            digitGroupSeparator=","
            value={this.state.entryAmount}
            error={this.state.amountError.length === 0 ? false : true}
            helperText={this.state.amountError}
            onChange={this.fieldChange}
            placeholder="Amount Spent*"
          />

          <TextField
            required
            id="standard-required entryFormItemName"
            name="entryName"
            value={this.state.entryName}
            placeholder="Item Name"
            onChange={this.fieldChange}
            type="text"
            error={this.state.nameError.length === 0 ? false : true}
            helperText={this.state.nameError}
          />

          <TextField
            id="entryFormDate"
            name="entryDate"
            label="Birthday"
            onChange={this.fieldChange}
            type="date"
            defaultValue={today}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button type="submit" className="btn">Submit!</Button>
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
        <Container>
        {content}
        </Container>
      </div>
    )
  }
}
