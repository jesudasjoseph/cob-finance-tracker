import React from 'react'
import Buttons from '../Layout/UserMButtons';
import NavibarI from '../Layout/MyNavBarI';
import Table from '../Layout/UserMTable';

export default function UserInstructor() {
    return (
        <React.Fragment>
          <NavibarI/>
            <h1 style={{textAlign:'center'}}> Instructor Name</h1>
            <h2 style={{textAlign: 'left'}}> Class Sections: </h2>
        </React.Fragment>
    )
}
