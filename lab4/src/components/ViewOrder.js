import { useState } from "react";
import Loading from "./Loading";

const ViewOrder = ({ order, remove, updateSalad }) => {
	const [loading, setLoading] = useState(false);
	const [orderState, setOrderState] = useState();
	const [orderPlaced, setOrderPlaced] = useState(false);

	const submitOrder = async (data) => {
		const url = "http://localhost:8080/orders/";

		const resp = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		});
		console.log("fetch resp: ", resp);
		return resp.json();
	};

	const placeOrder = () => {
		setLoading(true);

		const data = order.map((salad) => Object.keys(salad.ingredients));
		console.log("data: ", data);

		const res = submitOrder(data)
			.then((resp) => {
				console.log("response: ", resp);
				setOrderState(resp);
				// order.forEach((salad) => remove(salad.id));
				setOrderPlaced(true);
				return true;
			})
			.catch((err) => {
				setLoading(false);
				console.error("POST ERROR: ", err);
				return false;
			});

		if (res) {
			//
			setTimeout(() => {
				order.forEach((salad) => remove(salad.id));
				setLoading(false);
			}, 1000);
		}
		// setTimeout(() => {
		// 	setLoading(false);
		// }, 2000);
	};

	const totalPrice = order.reduce(
		(total, salad) => (total += salad.getPrice()),
		0
	);

	console.log("orderPlaced:", orderPlaced);
	console.log("orderState", orderState);

	return (
		<>
			<h2>Beställningen</h2>
			{order.map((salad) => {
				let text = Object.keys(salad.ingredients).reduce(
					(txt, i) => (txt += i + ", "),
					""
				);
				text += salad.getPrice() + "kr";
				return (
					<div className="row" key={salad.id}>
						<div className="col-10">
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
						<div
							className="col btn btn-outline-secondary"
							onClick={() => updateSalad(salad.id)}
						>
							c
						</div>
					</div>
				);
			})}
			<div className="mt-3">
				<h6>Totalt pris: {totalPrice} kr</h6>
			</div>
			<div className="mt-3">
				<button
					style={{ minWidth: 100 }}
					className="btn btn-primary"
					type="button"
					disabled={loading || order.length == 0}
					onClick={() => placeOrder()}
				>
					{loading ? (
						<div style={{ position: "relative" }}>
							<div
								style={{
									position: "absolute",
									left: 0,
									width: "100%",
									height: "100%"
								}}
							>
								<Loading size="small" />
							</div>
							<span style={{ visibility: "hidden" }}>Beställ</span>
						</div>
					) : (
						"Beställ"
					)}
				</button>
			</div>
			{orderPlaced && (
				<div className="mt-3">
					<h5>Orderbekräftelse</h5>
					<p>Status: {orderState.status}</p>
					<p>Ordernummer: {orderState.uuid}</p>
					<p>Tid: {orderState.timestamp}</p>
					{/* <p>Tid: {new Date(orderState.timestamp)}</p> */}
					<p>Antal sallader: {orderState.order.length}</p>
					<p>Pris: {orderState.price} kr</p>
				</div>
			)}
		</>
	);
};

export default ViewOrder;

// curl -isX POST -H "Content-Type: application/json" --data '[["Sallad", "Norsk fjordlax", "Tomat", "Gurka", "Dillmayo"]]' http://localhost:8080/orders/
