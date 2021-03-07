import React, { Component } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';


const now = 30;
//const progressInstance = <ProgressBar now={now} label={`${now}%`} />;

export class ProfitProgress extends Component {
  constructor(props){
    super(props);
    this.state = {
        betternow: "",
        businessTable: []}
        this.get_businesses = this.get_businesses.bind(this);
        this.get_businesses();
        this.state.betternow = this.state.businessTable.deposit_total;
          }

  get_businesses(){
    fetch('http://' + '71.193.191.23' + ':2021/business?start=' + '0' + '&end=' + '50', {
      mode: 'cors',
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': window.localStorage.getItem('jwt')
      }
    }).then(response => {
      console.log(response);
      return response.json();
    }).then(data => {
      console.log('Success:', data);
      this.setState({businessTable:data});
    }).catch((error) => {
      console.error('Error:', error);
    });
  }


    render() {
        if(now<25){
        return (
            <ProgressBar style= {{height:'50px'}} now={now} variant="danger" label={`${now}%`} />
        )
        }
        if(now>25 && now<100){
            return (
                <ProgressBar style= {{height:'50px'}} now={now} variant="warning" label={`${now}%`} />
                )
            }
        if(this.now>=100){
            return (
            <ProgressBar style= {{height:'50px'}} now={now} variant="success" label={`GOAL REACHED: ${now}%`} />
            )
        }

    }
}


export default ProfitProgress
