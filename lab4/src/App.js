import { useEffect, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Routes, Route } from "react-router-dom";
import ComposeSalad from "./components/ComposeSalad";
import ViewOrder from "./components/ViewOrder";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import FourOhFour from "./components/FourOhFour";
import ViewIngredient from "./components/ViewIngredient";
import { PageOuterOutline, PageOutline } from "./components/PageOutline";
import Loading from "./components/Loading";

import Salad from "./Salad";

import { default as localInventory } from "./inventory.ES6";

/** SERVER
 * should kill with ctrl + c
 * otherwise
 * sudo lsof -i :8080 <-- get the PID
 * search 'node' in aktivietskontroll, två resultat. En för server.js och en för node modules
 * kill -9 <PID> <-- kills the process, but not the node modules inside lab4_server
 * ps aux | grep node <-- list all node process, PID and where they're runnning from.
 * curl -i http://localhost:8080/foundations/ <-- check if connected
 */

const isDeepEqual = (object1, object2) => {
	const objKeys1 = Object.keys(object1);
	// const objKeys2 = Object.keys(object2);

	// if (objKeys1.length !== objKeys2.length) {
	// 	return false;
	// }
	for (var key of objKeys1) {
		const value1 = object1[key];
		const value2 = object2[key];

		const isObjects = isObject(value1) && isObject(value2);

		if (
			(isObjects && !isDeepEqual(value1, value2)) ||
			(!isObjects && value1 !== value2)
		) {
			console.log(
				"diff at key: ",
				key,
				"  value1: ",
				{ value1 },
				"   value2: ",
				value2
			);
			return false;
		}
	}
	return true;
};

const isObject = (object) => {
	return object != null && typeof object === "object";
};

const baseUrl = "http://localhost:8080/";
const types = ["foundations/", "proteins/", "extras/", "dressings/"];

function App() {
	const [loading, setLoading] = useState(true);
	const [siteIsDown, setSiteIsDown] = useState(false);
	const [inventory, setInventory] = useState({});
	const [updatingSalad, setUpdatingSalad] = useState();
	const [basket, setBasket] = useState([]);

	const fetchValuesForKey = useCallback(async (typeUrl, key) => {
		let url = typeUrl + key;
		// if (key === "Avocado") {
		// 	url = typeUrl + "avogadro";
		// }
		const resp = await fetch(url);
		if (!resp.ok) {
			throw new Error(`${url} returned status ${resp.status}`);
		}
		const values = await resp.json();
		return { [key]: values };
	}, []);

	//whyyyy
	const fetchKeys = useCallback(
		async (baseUrl, type) => {
			const url = baseUrl + type;
			const resp = await fetch(url);
			if (!resp.ok) {
				throw new Error(`${url} returned status ${resp.status}`);
			}
			const keys = await resp.json();
			const promises = keys.map(async (key) => {
				return await fetchValuesForKey(url, key);
			});
			// console.log(type, "  promises: ", promises);
			return Promise.allSettled(promises);
		},
		[fetchValuesForKey]
	);

	useEffect(() => {
		setLoading(true);

		const inventoryPromises = types.map(async (type) => {
			return fetchKeys(baseUrl, type);
		});
		// console.log("inventoryPromises: ", inventoryPromises);
		Promise.all(inventoryPromises)
			.then((result) => {
				// console.log("result arr: ", result.flat());
				const inventory = result
					.flat()
					.reduce(
						(inv, item) => (item.value ? Object.assign(inv, item.value) : inv),
						{}
					);
				// console.log("inventory final: ", inventory);
				console.log(
					"local and server equal: ",
					isDeepEqual(localInventory, inventory)
				);
				setInventory(inventory);
				setTimeout(() => {
					setLoading(false);
				}, 500);
				// setLoading(false);
				setSiteIsDown(false);
			})
			.catch((err) => {
				console.error("Promise all in inventoryPromises error:", err);
				setSiteIsDown(true);
				throw new Error(`fetching all error`);
			});
	}, [fetchKeys]);

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

	const Routing = () => (
		<Routes>
			<Route element={<PageOutline />}>
				<Route path="/" element={<Welcome />} />
				<Route
					path="/compose-sallad"
					element={
						<ComposeSalad
							inventory={inventory}
							addToBasket={(ingredients) => updateBasket(ingredients)}
							updatingSalad={updatingSalad}
						/>
					}
				/>
				<Route
					path="/view-order"
					element={
						<ViewOrder
							order={basket}
							remove={(id) => removeSalad(id)}
							updateSalad={(salad) => updateSalad(salad)}
						/>
					}
				/>
				<Route
					path="/view-ingredient/:name"
					element={<ViewIngredient inventory={inventory} />}
				/>
				<Route path="*" element={<FourOhFour />} />
			</Route>
		</Routes>
	);

	if (siteIsDown) {
		return (
			<PageOuterOutline>
				<Header />
				<NavBar />
				<PageOutline>
					<FourOhFour title="Ajdå, sidan fungerar inte som den ska." />
				</PageOutline>
				<footer className="pt-3 mt-4 text-muted border-top">
					EDAF90 - webprogrammering
				</footer>
			</PageOuterOutline>
		);
	}

	return (
		<PageOuterOutline>
			<Header />
			<NavBar />
			{loading ? (
				<PageOutline>
					<Loading />
				</PageOutline>
			) : (
				<Routing />
			)}
			<footer className="pt-3 mt-4 text-muted border-top">
				EDAF90 - webprogrammering
			</footer>
		</PageOuterOutline>
	);
}

export default App;

/**
 * Opt: 7.5 (A) räknas ej
 * Opt4learn: 7.5 (A)
 * Statstok: 7.5 (G2)
 * Tidsserie: 7.5 (A)
 * MC: 7.5 (A)
 * Finansvärdering: 7.5 (A)
 *
 */
