import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';

export class Tables extends Component {
    render() {
        return (
            <Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Group Name</th>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Instructor</th>
                        <th>Class Section</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Benny Beavers</td>
                                <td>Jackson Miller</td>
                                <td>933272728</td>
                                <td>Omar Trendad</td>
                                <td>4</td>
                                </tr>
                                <tr>
                                <td>Benny Beavers</td>
                                <td>Jess </td>
                                <td>933434</td>
                                <td>Omar Trendad</td>
                                <td>4</td>
                                </tr>
                                <tr>
                                <td>Benny Beavers</td>
                                <td> Ghaith</td>
                                <td>9332734</td>
                                <td>Omar Trendad</td>
                                <td>4</td>
                                </tr>
                                    </tbody>
                                    </Table>
        )
    }
}

export default Tables
