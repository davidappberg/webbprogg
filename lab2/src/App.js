// import logo from "./logo.svg";
// import "./App.css";
// import "./my.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import inventory from "./inventory.ES6";
import ComposeSalad from "./ComposeSalad";
import Basket from "./Basket";
import ViewOrder from "./ViewOrder";

function App() {
	const [basket, setBasket] = useState([]);
	const [updatingSalad, setUpdatingSalad] = useState({});

	const [basketObj, setBasketObj] = useState(new Basket());

	const updateBasket = (salad) => {
		basketObj.addSalad(salad);
		let newBasket = [...basket];
		newBasket.push(salad);
		setBasket(newBasket);
	};
	const removeSalad = (id) => {
		let newBasket = [...basket];
		newBasket = newBasket.filter((s) => s.id !== id);
		setBasket(newBasket);
	};

	const updateSalad = (id) => {
		const salad = basket.find((s) => s.id === id);

		console.log("updating");
	};
	return (
		<div className="container py-4">
			<header className="pb-3 mb-4 border-bottom">
				<span className="fs-4">Min egen salladsbar</span>
			</header>
			<ViewOrder
				order={basket}
				remove={(id) => removeSalad(id)}
				updateSalad={(salad) => updateSalad(salad)}
			/>
			<ComposeSalad
				inventory={inventory}
				addToBasket={(salad) => updateBasket(salad)}
				// updatingSalad={updatingSalad}
				// updateSalad={(salad) => updateSalad(salad)}
			/>

			<footer className="pt-3 mt-4 text-muted border-top">
				EDAF90 - webprogrammering
			</footer>
		</div>
	);
}

export default App;
