import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';

export class ExpensesTables extends Component {
    render() {
        return (
            <Table style={{padding: '10px'}} striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Date:</th>
                        <th>Name</th>
                        <th>Vendor</th>
                        <th>Location</th>
                        <th>Payment Method</th>
                        <th>Product Purchased</th>
                        <th>Quantity</th>
                        <th>Price(per unit)</th>
                        <th>Total Cost:</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>10/29/2020</td>
                                <td>Jackson</td>
                                <td>Vendor 1</td>
                                <td>In-Person</td>
                                <td>Square</td>
                                <td>Candles</td>
                                <td>2000</td>
                                <td>$4</td>
                                <td>$8000</td>
                                </tr>
                                <tr>
                                <td>10/24/2020</td>
                                <td>Jess</td>
                                <td>Online Vendor 1</td>
                                <td>Online</td>
                                <td>Square</td>
                                <td>Matches</td>
                                <td>1</td>
                                <td>$10</td>
                                <td>$10</td>
                                </tr>
                                <tr>
                                <td>10/29/2020</td>
                                <td>Ghaith</td>
                                <td>Online Vendor 2</td>
                                <td>Online</td>
                                <td>Square</td>
                                <td>Pumpkin</td>
                                <td>3</td>
                                <td>$15</td>
                                <td>$45</td>
                                </tr>
                                    </tbody>
                                    </Table>
        )
    }
}

export default ExpensesTables