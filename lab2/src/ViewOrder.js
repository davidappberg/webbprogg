import { useEffect } from "react";

const ViewOrder = ({ order, remove }) => {
	console.log("View order: basket", order);
	if (!order) {
		return <></>;
	}
	let sallads = [];
	// useEffect(() => {
	// 	console.log("RE-RENDER VIEW ORDER");
	// 	// sallads = basket.getBasket();
	// }, [basket.length]);

	return (
		<div className="container col-12">
			<div className="row h-200 p-5 bg-light border rounded-3">
				<h2>Beställningen</h2>
				{order.map((salad) => {
					let text = Object.keys(salad.ingredients).reduce(
						(txt, i) => (txt += i + ", "),
						""
					);
					text += salad.getPrice() + "kr";
					return (
						<div className="row" key={salad.id}>
							<div className="col-11">
								<input
									type="text"
									readOnly
									className="form-control"
									id="staticEmail"
									value={text}
								/>
							</div>
							<div
								className="col btn btn-outline-danger"
								onClick={() => remove(salad.id)}
							>
								x
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ViewOrder;
