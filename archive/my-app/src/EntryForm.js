import React, { Component } from 'react';
import './App.css';
import firebase from '../node_modules/firebase';
import 'firebase/database';


export default class EntryForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        entryAmount: '',
        entryDate: '',
        entryName: ''
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
  
    render() {
      return (
        <div>
          <form onSubmit={this.handleSubmit} noValidate>
            <div>
  
              {/* FormFields */}
              <div className='card'>
                <div>
                  <input className="form-control"
                    type="number"
                    name="entryAmount"
                    placeholder="Amount*"
                    required
                    /* TODO require positive non-zero numbers */
                    value={this.state.entryAmount}
                    onChange={this.fieldChange} />
                </div>
                <div>
                  <input className="form-control"
                    type="text"
                    name="entryName"
                    placeholder="Item name"
                    /* TODO add a maximimum length */
                    value={this.state.entryName}
                    onChange={this.fieldChange} />
                </div>
                <div>
                  <input className="form-control"
                    type="date"
                    name="entryDate"
                    placeholder=""
                    /* TDO how to signal that this autofills if empty? */
                    value={this.state.entryDate}
                    onChange={this.fieldChange} />
                </div>
              </div>
  
            </div>
  
            {/* FormSubmit */}
            <button type="submit" className="btn">Submit!</button>
  
          </form>
        </div>)
    }
  }
  