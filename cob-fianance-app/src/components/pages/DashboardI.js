import React from 'react'
import GroupTable from '../Layout/GroupTable';
import NavibarI from '../Layout/MyNavBarI';

export default function DashboardI() {
    return (
      <React.Fragment>
      <NavibarI/>
          <h1 style={{textAlign:'center'}}> Dashboard </h1>
          <div style={{textAlign: 'right'}}>
          </div>
          <h2 style={{textAlign:'left'}}> Welcome Instructor </h2>
          <GroupTable style = {{paddingTop: '10px 20px'}}></GroupTable>
      </React.Fragment>
  )
}
