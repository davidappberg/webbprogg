import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useLocation } from "react-router-dom";
import Salad from "../Salad";

const ViewOrder = ({ order, remove, updateSalad, clearBasket }) => {
	const [loading, setLoading] = useState(false);
	const [orderState, setOrderState] = useState({});
	const [orderPlaced, setOrderPlaced] = useState(false);
	const [theOrder, setTheOrder] = useState([]);
	const [prevOrders, setPrevOrders] = useState([]);
	const [latestOrder, setLatestOrder] = useState([]);

	const location = useLocation();

	useEffect(() => {
		console.log("mounting ViewOrder");
	}, []);

	useEffect(() => {
		const url = "http://localhost:8080/view-orders/";
		const fetchOrders = async () => {
			const resp = await fetch(url);
			const prevs = await resp.json();
			setPrevOrders(prevs);
		};
		fetchOrders();
	}, [location]);

	useEffect(() => {
		const latestOrderCache = window.localStorage.getItem("Latest order");
		setLatestOrder(Salad.parseArray(latestOrderCache));
	}, [location, orderPlaced]);

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

	const placeOrder = async () => {
		setLoading(true);

		const data = order.map((salad) => Object.keys(salad.ingredients));

		const res = await submitOrder(data)
			.then((resp) => {
				console.log("response: ", resp);
				// setOrderState(resp);
				// setOrderPlaced(true);
				// clearBasket();
				// setLoading(false);
				return resp;
			})
			.catch((err) => {
				setLoading(false);
				console.error("POST ERROR: ", err);
				return null;
			});

		if (res) {
			setOrderState(res);
			// order.forEach((salad) => remove(salad.id));
			setOrderPlaced(true);
			window.localStorage.setItem("Latest order", JSON.stringify(order));

			setTheOrder([...order]); // copy all Salad objects from array

			clearBasket();
		}
		setTimeout(() => {
			setLoading(false);
		}, 500);
	};

	const totalPrice = order.reduce(
		(total, salad) => (total += salad.getPrice()),
		0
	);
	// console.log("orderPlaced:", orderPlaced);
	// console.log("orderState", orderState);

	return (
		<>
			<h2>Beställningen</h2>
			{order.map((salad) => {
				let text = Object.keys(salad.ingredients).reduce(
					(txt, i) => (txt += i + ", "),
					""
				);
				text += salad.getPrice() + " kr";
				return (
					<div className="row" key={salad.id}>
						<div className="col-10">
							<input
								type="text"
								readOnly
								className="form-control"
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
				{order.length > 0 ? (
					<h6>Totalt pris: {totalPrice} kr</h6>
				) : (
					<h6>
						<i>Inga sallader</i>
					</h6>
				)}
			</div>

			<div className="mt-3">
				<button
					style={{ minWidth: 100 }}
					className="btn btn-primary"
					type="button"
					disabled={loading || order.length === 0}
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
				<div className="mt-3 pt-3 border-top">
					<h5>Orderbekräftelse</h5>
					<p>Status: {orderState.status}</p>
					<p>Ordernummer: {orderState.uuid}</p>
					<p>Tid: {orderState.timestamp}</p>
					{/* <p>Tid: {new Date(orderState.timestamp)}</p> */}
					<p>Antal sallader: {orderState.order.length}</p>
					<p>Pris: {orderState.price} kr</p>
					<h6>Din beställning</h6>
					{theOrder.map((salad) => {
						let text = Object.keys(salad.ingredients).reduce(
							(txt, i) => (txt += i + ", "),
							""
						);
						text += salad.getPrice() + "kr ";
						return (
							<div className="row" key={salad.id}>
								<input
									type="text"
									readOnly
									disabled
									className="form-control"
									value={text}
								/>
							</div>
						);
					})}
				</div>
			)}
			{latestOrder.length > 0 && !orderPlaced && (
				<div className="mt-3 pt-3 border-top">
					<h5>Din senaste beställning</h5>
					{latestOrder.map((salad) => {
						// let text = Object.keys(salad.ingredients).reduce(
						// 	(txt, i) => (txt += i + ", "),
						// 	""
						// );
						let text = Object.keys(salad.ingredients).join(", ");
						text += ". " + salad.getPrice() + " kr";
						return (
							<div className="row" key={salad.id}>
								<input
									type="text"
									readOnly
									disabled
									className="form-control"
									value={text}
								/>
							</div>
						);
					})}
				</div>
			)}
			{prevOrders.length > 0 && (
				<div className="mt-3 pt-3">
					<h5>Orderhistorik</h5>
					{prevOrders.reverse().map((prev) => (
						<div key={prev.uuid} className="pt-3 border-top mb-3">
							<p>Ordernummer: {prev.uuid}</p>
							<p>Tid: {prev.timestamp}</p>
							<p>Antal sallader: {prev.order.length}</p>
							<p>Pris: {prev.price} kr</p>
							<h6>Din beställning</h6>
							{prev.salads.map((salad, i) => {
								let text = salad.ingredients.join(", ");
								text += ". " + salad.price + " kr";
								return (
									<div key={text + i} className="row">
										<input
											type="text"
											readOnly
											disabled
											className="form-control"
											value={text}
										/>
									</div>
								);
							})}
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default ViewOrder;

// curl -isX POST -H "Content-Type: application/json" --data '[["Sallad", "Norsk fjordlax", "Tomat", "Gurka", "Dillmayo"]]' http://localhost:8080/orders/
