import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
export class Buttons extends Component {
    render() {
        return (
        <>
        <Button type="submit">Add Transaction</Button>{' '}
        <Button as="input" type="button" value="Sync Square Transactions" />{' '}
        <Button as="input" type="reset" value="Reset" />
        </>

        )
    }
}

export default Buttons
