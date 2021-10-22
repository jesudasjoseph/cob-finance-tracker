import './styles/MobileTable.css';

function MobileTable(props) {
	return (
		<>
			<div>
				{props.children}
			</div>
		</>
	);
}

function ExpenseItem(props) {
	return (
		<>
			<div className='table-item-container'>
				<p className='table-item-date'>{props.date.split('T')[0]}</p>
				<div className='table-item-top-left'>
					<p className='table-item-title'>{props.title}</p>
					<p className='table-item-subtitle'>{props.subtitle}</p>
				</div>
				<div className='table-item-bottom-left'>
					<p className='table-item-total'>{props.total}</p>
					<p className='table-item-quantity'>({props.quantity}</p>
					<p className='table-item-times'>x</p>
					<p className='table-item-unit-price'>{props.unit_price})</p>
				</div>
				<p className='table-item-payment'>{props.payment}</p>
			</div>
		</>
	);
}

function TransactionItem(props) {
	return (
		<>
			<div className='table-item-container'>
				<p className='table-item-date'>{props.date.split('T')[0]}</p>
				<div className='table-item-top-left'>
					<p className='table-item-title'>{props.title}</p>
					<p className='table-item-subtitle'>{props.subtitle}</p>
				</div>
				<div className='table-item-bottom-left'>
					<p className='table-item-total'>{props.total}</p>
					<p className='table-item-quantity'>({props.quantity}</p>
					<p className='table-item-times'>x</p>
					<p className='table-item-unit-price'>{props.unit_price})</p>
				</div>
				<p className='table-item-payment'>{props.payment}</p>
			</div>
		</>
	);
}

MobileTable.ExpenseItem = ExpenseItem;
MobileTable.TransactionItem = TransactionItem;

export default MobileTable;
