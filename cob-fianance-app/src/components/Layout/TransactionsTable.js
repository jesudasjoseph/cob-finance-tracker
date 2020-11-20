import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';

export class Tables extends Component {
    render() {
        return (
            <Table responsive="sm" size="xl" style={{paddingBottom:'40px' , paddingTop: '10px'}} striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Date:</th>
                        <th>Name</th>
                        <th>Customer</th>
                        <th>Location</th>
                        <th>Payment Method</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price(per unit)</th>
                        <th>Total:</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>10/29/2020</td>
                                <td>Jackson</td>
                                <td>Jimmy</td>
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
                                <td>Bob</td>
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
                                <td>Bill</td>
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

export default Tables
