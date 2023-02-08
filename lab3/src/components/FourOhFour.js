const FourOhFour = ({ title }) => (
	<div className="container col-12">
		<div className="row h-200 p-5 bg-light border rounded-3">
			{title ? <h2>{title}</h2> : <h2>404 sidan finns ej</h2>}
		</div>
	</div>
);
export default FourOhFour;
