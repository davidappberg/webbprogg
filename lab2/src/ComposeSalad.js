import { useEffect, useState } from "react";
import Salad from "./Salad";

const ComposeSalad = (props) => {
	const [foundations, setFoundations] = useState([]);
	const [proteins, setProteins] = useState([]);
	const [extras, setExtras] = useState([]);
	const [dressings, setDressings] = useState([]);

	const [chosenFoundation, chooseFoundation] = useState();
	const [chosenProtein, chooseProtein] = useState();
	const [chosenExtras, chooseExtras] = useState([]);
	const [chosenDressing, chooseDressing] = useState();

	useEffect(() => {
		let foundationProp = [];
		let extrasProp = [];
		let proteinsProp = [];
		let dressingProp = [];
		console.log("--- MOUNTING COMPOSE SALAD ---");
		Object.keys(props.inventory).forEach((name) => {
			// console.log(name)
			if (props.inventory[name].foundation) {
				// console.log("foundation")
				foundationProp.push(name);
			} else if (props.inventory[name].protein) {
				// console.log("protein")
				proteinsProp.push(name);
			} else if (props.inventory[name].extra) {
				// console.log("extra")
				extrasProp.push(name);
			} else if (props.inventory[name].dressing) {
				// console.log("dressing")
				dressingProp.push(name);
			} else {
				console.log("WARNING: unused key: ", name);
			}
		});
		// let extrasProp2 = Object.keys(props.inventory).filter(
		// 	(name) => props.inventory[name].extra
		// );
		setFoundations(foundationProp);
		setProteins(proteinsProp);
		setExtras(extrasProp);
		setDressings(dressingProp);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("submitting");

		let salad = new Salad();
		salad
			.add(chosenFoundation, props.inventory[chosenFoundation])
			.add(chosenProtein, props.inventory[chosenProtein])
			.add(chosenDressing, props.inventory[chosenDressing]);

		chosenExtras.forEach((extra) => salad.add(extra, props.inventory[extra]));

		props.addToBasket(salad);
		chooseFoundation("");
		chooseProtein("");
		chooseExtras([]);
		chooseDressing("");
	};

	const makeCaesar = (e) => {
		e.preventDefault();
		console.log("MAKE CAESAR");
		chooseFoundation("Sallad");
		chooseProtein("Kycklingfilé");
		chooseExtras(["Bacon", "Krutonger", "Parmesan"]);
		chooseDressing("Ceasardressing");
	};

	const makeRandom = (e) => {
		e.preventDefault();
		console.log("MAKE CAESAR");
		chooseFoundation(
			foundations[Math.floor(Math.random() * foundations.length)]
		);
		chooseProtein(proteins[Math.floor(Math.random() * proteins.length)]);
		chooseExtras([
			extras[Math.floor(Math.random() * extras.length)],
			extras[Math.floor(Math.random() * extras.length)]
		]);
		chooseDressing(dressings[Math.floor(Math.random() * dressings.length)]);
	};

	return (
		<div className="container col-12">
			<div className="row h-200 p-5 bg-light border rounded-3">
				<h2>Välj innehållet i din sallad</h2>
				{/* {extras.map((name) => (
					<div key={name} className="col-4">
						{name}
					</div>
				))} */}
				<form onSubmit={(e) => handleSubmit(e)}>
					<Select
						label="Foundation"
						options={foundations}
						chosenValue={chosenFoundation}
						onChange={(val) => chooseFoundation(val)}
						multipleChoice={false}
					/>
					<Select
						label="Protein"
						options={proteins}
						chosenValue={chosenProtein}
						onChange={(val) => chooseProtein(val)}
						multipleChoice={false}
					/>
					<Select
						label="Extras"
						options={extras}
						chosenValue={chosenExtras}
						onChange={(val) => {
							console.log("choosing val: ", val);
							let newExtras = [...chosenExtras];
							if (chosenExtras.includes(val)) {
								newExtras = chosenExtras.filter((name) => name !== val);
							} else {
								newExtras.push(val);
							}
							chooseExtras(newExtras);
						}}
						multipleChoice={true}
					/>
					<Select
						label="Dressing"
						options={dressings}
						chosenValue={chosenDressing}
						onChange={(val) => chooseDressing(val)}
						multipleChoice={false}
					/>
					<button type="submit" className="btn btn-primary">
						Lägg till
					</button>
					<span style={{ padding: 50 }} />
					<button onClick={(e) => makeCaesar(e)} className="btn btn-primary">
						Caesarsallad
					</button>
					<span style={{ padding: 50 }} />
					<button onClick={(e) => makeRandom(e)} className="btn btn-primary">
						Slumpa
					</button>
				</form>
			</div>

			<h2>Din sallad är nu:</h2>
			<p>Foundation: {chosenFoundation}</p>
			<p>Protein: {chosenProtein}</p>
			<p>
				Extras:{" "}
				{chosenExtras.map((e) => (
					<span key={e}>{e} </span>
				))}
			</p>
			<p>Dressing: {chosenDressing}</p>
		</div>
	);
};

const Select = ({ label, options, chosenValue, onChange, multipleChoice }) => {
	if (multipleChoice) {
		return (
			<div className="mb-3">
				<h4>Extras</h4>
				{options.map((name) => (
					<div key={name} className="form-check form-check-inline">
						<input
							className="form-check-input"
							type="checkbox"
							id={name}
							value={name}
							checked={chosenValue.includes(name)}
							onChange={(e) => onChange(e.target.value)}
						/>
						<label className="form-check-label" htmlFor={name}>
							{name}
						</label>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="mb-3">
			{/* <div class="input-group-prepend">
				<label class="input-group-text" for="inputGroupSelect01">
					{label}
				</label>
			</div> */}
			<h4>{label}</h4>
			<select
				className="form-control"
				value={chosenValue}
				defaultValue=""
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="" hidden disabled>
					Välj...
				</option>
				{options.map((name) => (
					<option key={name} value={name}>
						{name}
					</option>
				))}
			</select>
		</div>
	);
};
export default ComposeSalad;
