import React from 'react'
import {Link} from 'react-router-dom'

function Header() {
    return (
        <header style={headerStyle}>
            <h1>College Of Buisness App</h1>
            <Link style={linkStyle} to="/">Dashboard</Link> | 
            <Link style={linkStyle} to="/transactions"> Transactions </Link> | 
            <Link style={linkStyle} to="/Expenses"> Expenses </Link> | 
            <Link style={linkStyle} to="/profile"> Profile </Link>
        </header>
    )
}
const headerStyle = {
    background: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px'
}
const linkStyle = {
    color: '#fff',
    textDecoration: 'none'
}
export default Header;