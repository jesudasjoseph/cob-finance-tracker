import React from 'react'


export default function Login() {
    return (
        <React.Fragment style={ButtonStyle}>
            <div style={{textAlign: 'center', padding:'100px'}}>
            <button style={ButtonStyle}>Login as Student</button>
            </div>
            <div style={{textAlign: 'center', padding:'100px'}}>
            <button style={ButtonStyle}>Login as Instructor</button>
            </div>

        </React.Fragment>
    )
}

const ButtonStyle = {
    flex: '1',
    background: '#add8e6',
    color: '#333',
    textAlign: 'center',
    //padding: '25px , 200px',
    justifyContent: 'center',
    alignItems: 'center',
    size:'lg',
    width:'700px',
    display: 'inline-block',
    height: '100px'
}
