# Sprout Architecture Specification 
## Views 
JavaScript
- All components stubs are located under https://github.com/BeckMillet/INFO442Team5/tree/master/sprout-app.
### Add Your Daily Budget View
- This component allows the new user to enter and initiate a daily budget.
- Resides on client-side
- Communicates the entry numerical value with the Daily Budget controller to receive the amount for daily budget and updates the Budget Summary View
- This view will constrain the user inputs by accepting only valid inputs(defined in requirements doc) and display feedback to the user what type of input is valid.
### Budget Summary View
- This component displays the daily budget and overall balance amount (expenses to date subtracted from budget to date)
- Resides on client-side
- Communicates with the Daily Budget controller and Balance controller by retrieving and displaying the controller values.
### Change Your Daily Budget View
- This component allows the user to enter and update a new daily budget for existing users
- Resides on client-side
- Communicates with the Daily Budget Controller by retrieving and displaying the controller values to receive an accurate update of the daily budget amount
### Enter Transaction View 
- This component allows the user to enter the item name, price, and date the transaction occurred.
- Resides on client-side
- Communicates with the Transaction controllers to send a completed form to the SproutModel.
- This view will constrain the user inputs by accepting only valid inputs (positive, non-zero numbers) and display feedback to the user what type of input is valid.
### Latest Transaction View 
- This component lists transaction information (date, name, and cost) in order of most recent transactions. 
- Resides on the client-side 
- Communicates with the Model to retrieve the most up to date array of transactions
## Model
- JavaScript
### SproutModel 
- All data related to the user will be stored in a state object as per React best practices. This object will hold the array of transactions the user enters, their daily budget value, the budget to date value, the expenses to date value, and any values that support the update and management of this model. 
- Resides on the client-side in the state variable
- Communicates with all controller components, giving various controllers access to the state variable with which they manipulate and receive the updated values. Therefore, the state will be defined at the top level and passed down via properties. 
## Controller
- Javascript
### Daily Budget Controller
- When the user fills out a new daily budget and hits the submit button, this component will take the value from the View (input form) and send it to update the model with a new daily budget value
- Resides on client-side
- Communicates with the model to update the daily budget (upon submit) and with the Daily Budget View so that the view can render the value.
### Transaction Controller
- When the user adds a new transaction using the entry form, this function adds the transaction to the array of transactions in the model
- Resides on client-side
- Communicates between the Enter Transaction View (input form) and the model to update the list of transactions. 
### Balance Controller
- When the user adds a new transaction using the entry form, this function will update the expenses to date value in the model. 
- At each new date, this function will add today's daily budget value to the budget to date value in the model
- Resides on client-side
- Communicates with the model to update the expenses to date value and sends the most up to date value to the Budget Summary View for the rendering of the overall balance. 
