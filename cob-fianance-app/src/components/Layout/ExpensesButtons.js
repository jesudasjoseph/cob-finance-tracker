import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
export class Expenses extends Component {
    render() {
        return (
        <>
        <Button type="submit">Add Expense</Button>{' '}
        <Button as="input" type="button" value="Sync Square Purchase" />{' '}
        <Button as="input" type="reset" value="Reset" />
        </>

        )
    }
}

export default Expenses