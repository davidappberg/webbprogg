import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Routes, Route } from "react-router-dom";
import inventory from "./inventory.ES6";
import ComposeSalad from "./ComposeSalad";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import FourOhFour from "./components/FourOhFour";
import ViewOrder from "./ViewOrder";
import Salad from "./Salad";

function App() {
	const [updatingSalad, setUpdatingSalad] = useState();
	const [basket, setBasket] = useState([]);

	const updateBasket = (ingredients) => {
		if (updatingSalad) {
			// setBasket(prev => {
			// 	const salad = prev.find(updatingSalad);

			// })
			// tveksam till detta, states ska ju vara immutable.
			updatingSalad.ingredients = ingredients; // denna ändrar salladsobjektet, men triggar inte render.
			setUpdatingSalad(null); // denna triggar render.
		} else {
			const salad = new Salad(ingredients);
			setBasket((prev) => [...prev, salad]);
		}
	};
	const removeSalad = (id) => {
		setBasket((prev) => prev.filter((s) => s.id !== id));
	};

	const updateSalad = (id) => {
		const salad = basket.find((s) => s.id === id);
		setUpdatingSalad(salad);
	};

	const Routing = (props) => (
		<Routes>
			<Route path="/" element={<Welcome />} />
			<Route
				path="compose-sallad"
				element={
					<ComposeSalad
						inventory={inventory}
						addToBasket={(ingredients) => updateBasket(ingredients)}
						updatingSalad={updatingSalad}
						// updateSalad={(salad) => updateSalad(salad)}
					/>
				}
			/>
			<Route
				path="view-order"
				element={
					<ViewOrder
						order={basket}
						remove={(id) => removeSalad(id)}
						updateSalad={(salad) => updateSalad(salad)}
					/>
				}
			/>
			<Route path="*" element={<FourOhFour />} />
		</Routes>
	);

	return (
		<div className="container py-4">
			<Header />
			<NavBar />
			<Routing />
			<footer className="pt-3 mt-4 text-muted border-top">
				EDAF90 - webprogrammering
			</footer>
		</div>
	);
}

export default App;
