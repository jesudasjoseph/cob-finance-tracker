import React from 'react'
import Button from 'react-bootstrap/Button';


export default function Login() {
    return (
        <React.Fragment >
            <h2 style={{paddingTop:'25px' , textAlign:'center'}} >Sign in with your ONID credentials</h2>
            <div style={{flex: '1', paddingTop:'100px', paddingBottom:'50px' , textAlign: 'center' }}>
            <>
            <Button style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '100px' }} as="input" type="button" value="Login as Student" />{' '}
            </>
            </div>
            <div style={{ flex: '1', padding: '50px 100px' , textAlign: 'center'}}>
             <>
             <Button style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '100px' }} as="input" type="button" value="Login as Instructor" />{' '}
             </>
             </div>

        </React.Fragment>
    )
}

