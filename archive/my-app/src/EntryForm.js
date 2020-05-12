import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
  validate,
} from '@material-ui/pickers';


import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';



export default class EntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entryAmount: '',
      amountError: "",
      entryDate: '',
      dateError: "",
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

    if(this.state.entryAmount < .01){
      isError = true;
      errors.amountError = 'Must be positive and non-zero'
    }

    if(this.state.entryName === ""){
      isError = true;
      errors.nameError = 'Required!'
    }

    if(isError){
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
    console.log(this.state)
    return (
      <div>
        Entry Form Section
        <form onSubmit={this.handleSubmit} classname="" noValidate>

          {/* FormFields */}


          {/* <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel> */}
          <TextField
            name="entryAmount"
            id="outlined-error-helper-text"
            value={this.state.entryAmount}
            error ={this.state.amountError.length === 0 ? false : true }
            helperText={this.state.amountError}
            onChange={this.fieldChange}
            placeholder="Amount Spent*"
            /* TODO require positive non-zero numbers */
          />

          {/*  <InputLabel>Item Name</InputLabel> */}
          <TextField
            required
            id="standard-required entryFormItemName"
            name="entryName"
            label="Item Name"
            onChange={this.fieldChange}
            type="text"
            error ={this.state.nameError.length === 0 ? false : true }
            helperText={this.state.nameError}
            required
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
        {/* FormSubmit */}

      </div>
    )
  }
}
