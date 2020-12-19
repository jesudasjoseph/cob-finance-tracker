import React, {Component} from 'react';
import {BrowserRouter as Router , Route} from 'react-router-dom'
import Todos from './components/Todos';
import AddTodo from './components/AddTodo';
import Header from './components/Layout/Header';
import Dashboard from './components/pages/Dashboard';
import Expenses from './components/pages/Expenses';
import Navibar from './components/Layout/MyNavbar';
import Buttons from './components/Layout/TransactionsButtons';
import Transactions from './components/pages/Transactions';
import Login from './components/pages/Login';
import QueryTestPage from './components/pages/QueryTestPage';
import './App.css';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';

const hostname = "http://localhost";
const port = "2700";

class App extends Component{
  state = {
    todos: []
  }
  render(){
  return (
    <Router>
    <div className="App" style={{background: '#d3d3d3', backgroundSize: 'cover',   width: '100%' , height: '100vh' , minHeight: '100%' }}>
      <Navibar />
      <div className="container">
      <Route exact path="/" component={Login} />
      <Route path="/home" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/expenses" component={Expenses} />
	  <Route path="/querytestpage" component={QueryTestPage} />
      </div>
      </div>
      </Router>
      );
    }
  }

export default App;
