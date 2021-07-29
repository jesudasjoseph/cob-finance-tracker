import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ResetDatabaseDialog from './components/ResetDatabaseDialog';
import ImportDatabaseDialog from './components/ImportDatabaseDialog';

import { AppContext } from '../../../AppContext';

import './styles/DatabaseManagementPage.css';

const exportUtil = require('./utils/exportFunctions');

export default class DatabaseManagementPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			showResetDialog: false,
			showImportDialog: false,
			progressPercent: 0,
			progressLabel: 'Import/Export Progress'
		}

		this.exportOnClick = this.exportOnClick.bind(this);
		this.resetOnClick = this.resetOnClick.bind(this);

		this.updateExportProgress = this.updateExportProgress.bind(this);
		this.updateImportProgress = this.updateImportProgress.bind(this);
	}

	//Import Database
	updateImportProgress(progress, label){
		this.setState({progressPercent: progress, progressLabel: label});
	}

	//Export Database
	exportOnClick(){
		exportUtil.startExport(this.updateExportProgress);
	}
	updateExportProgress(progress, label){
		this.setState({progressPercent: progress, progressLabel: label});
	}

	//Reset Database
	resetOnClick(){
		this.setState({showResetDialog: true});
	}

	render(){
		return(
			<>
				<div className='database-management-page-container'>
					<div className='flex-container'>
						<h3>Manage Database</h3>
					</div>
					<div className='flex-container button-container'>
						<Button className='left' onClick={this.exportOnClick}>Export Database</Button>
						<Button className='middle' onClick={() => {this.setState({showImportDialog: true})}}>Import Database</Button>
						<Button className='right' variant='danger' onClick={this.resetOnClick}>Reset Database</Button>
					</div>
					<div className='flex-container'>
						<ProgressBar now={this.state.progressPercent} label={`${this.state.progressPercent}%`}/>
						<h4 className='progress-label'>{this.state.progressLabel}</h4>
					</div>
				</div>
				<ImportDatabaseDialog show={this.state.showImportDialog} handleClose={() => {this.setState({showImportDialog: false})}} updateProgress={(progress, label) => {this.setState({progressPercent: progress, progressLabel: label})}}/>
				<ResetDatabaseDialog show={this.state.showResetDialog} handleClose={() => {this.setState({showResetDialog: false})}}/>
			</>
		);
	}
}
DatabaseManagementPage.contextType = AppContext;
