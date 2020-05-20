import React from 'react'
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

export default function MyComponent() {

    
  const [value, setValue] = React.useState();

  return (
    <CurrencyTextField
        label="Amount"
        variant="standard"
        value={value}
        currencySymbol="$"
        outputFormat="string"
        onChange={(event, value)=> setValue(value)}
    />
  );
}