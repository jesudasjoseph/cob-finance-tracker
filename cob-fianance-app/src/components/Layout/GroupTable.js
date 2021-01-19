import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import ProfitProgress from '../Layout/ProfitProgress';

export class Tables extends Component {
    render() {
        return (
            <Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Group Name</th>
                        <th> Instructor </th>
                        <th>Revenue</th>
                        <th>Expenses</th>
                        <th>Profits</th>
                        <th>Sales Goals</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Benny Beavers</td>
                                <td> Omar </td>
                                <td>1000$</td>
                                <td>750$</td>
                                <td>250$</td>
                                <td><ProfitProgress /></td>
                                </tr>
                                <tr>
                                <td>Benny Beavers</td>
                                <td> Omar </td>
                                <td>1000$</td>
                                <td>750$</td>
                                <td>250$</td>
                                <td><ProfitProgress /></td>
                                </tr>
                                <tr>
                                <td>Benny Beavers</td>
                                <td> Omar </td>
                                <td>1000$</td>
                                <td>750$</td>
                                <td>250$</td>
                                <td><ProfitProgress /></td>
                                </tr>
                                    </tbody>
                                    </Table>
        )
    }
}

export default Tables
