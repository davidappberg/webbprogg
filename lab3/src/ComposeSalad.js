import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import Salad from "./Salad";

const randomNumber = (max, except) => {
	let num = Math.floor(Math.random() * max);
	return num === except ? randomNumber(max, except) : num;
};

const ComposeSalad = (props) => {
	const [foundations, setFoundations] = useState([]);
	const [proteins, setProteins] = useState([]);
	const [extras, setExtras] = useState([]);
	const [dressings, setDressings] = useState([]);

	const [chosenFoundation, chooseFoundation] = useState();
	const [chosenProtein, chooseProtein] = useState();
	const [chosenExtras, chooseExtras] = useState([]);
	const [chosenDressing, chooseDressing] = useState();

	const [showExtraError, setExtraError] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		let foundationProp = [];
		let extrasProp = [];
		let proteinsProp = [];
		let dressingProp = [];
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
	}, [props.inventory]);

	useEffect(() => {
		if (props.updatingSalad) {
			const { ingredients } = props.updatingSalad;
			Object.entries(ingredients).forEach(([key, value]) => {
				if (value.foundation) chooseFoundation(key);
				else if (value.protein) chooseProtein(key);
				else if (value.dressing) chooseDressing(key);
				else {
					if (!value.extra) {
						console.log("What is this ingredient???");
						return;
					}
					chooseExtras((prev) => [...prev, key]);
				}
			});
		}
	}, [props.updatingSalad]);

	useEffect(() => {
		// const extrasInvalid = chosenExtras.length < 3 || chosenExtras.length > 9;
		// setExtraError(extrasInvalid);
		if (showExtraError) {
			const extrasInvalid = chosenExtras.length < 3 || chosenExtras.length > 9;
			!extrasInvalid && setExtraError(false);
		}
		// if (chosenExtras.length > 9) {
		// 	setExtraError(true)
		// }
		// who do I get a warning if showExtraError is not in the dependency array?
	}, [chosenExtras, showExtraError]);

	const handleSubmit = (e) => {
		e.preventDefault();
		e.target.classList.add("was-validated");
		const extrasInvalid = chosenExtras.length < 3 || chosenExtras.length > 9;
		setExtraError(extrasInvalid);
		if (!e.target.checkValidity() || extrasInvalid) {
			console.log("Form is invalid!");
			return;
		}
		console.log("submitting");

		const ingredients = {};
		ingredients[chosenFoundation] = props.inventory[chosenFoundation];
		ingredients[chosenProtein] = props.inventory[chosenProtein];
		ingredients[chosenDressing] = props.inventory[chosenDressing];
		chosenExtras.forEach(
			(extra) => (ingredients[extra] = props.inventory[extra])
		);
		props.addToBasket(ingredients);
		// let salad = new Salad();
		// salad
		// 	.add(chosenFoundation, props.inventory[chosenFoundation])
		// 	.add(chosenProtein, props.inventory[chosenProtein])
		// 	.add(chosenDressing, props.inventory[chosenDressing]);

		// chosenExtras.forEach((extra) => salad.add(extra, props.inventory[extra]));

		// props.addToBasket(salad);
		chooseFoundation("");
		chooseProtein("");
		chooseExtras([]);
		chooseDressing("");
		navigate("/view-order");
	};

	const makeCaesar = (e) => {
		e.preventDefault();
		chooseFoundation("Sallad");
		chooseProtein("Kycklingfilé");
		chooseExtras(["Bacon", "Krutonger", "Parmesan"]);
		chooseDressing("Ceasardressing");
	};

	const makeRandom = (e) => {
		e.preventDefault();
		chooseFoundation(foundations[randomNumber(foundations.length, -1)]);
		chooseProtein(proteins[randomNumber(proteins.length, -1)]);
		const extra1 = randomNumber(extras.length, -1);
		chooseExtras([extras[extra1], extras[randomNumber(extras.length, extra1)]]);
		chooseDressing(dressings[randomNumber(dressings.length, -1)]);
	};

	const title = props.updatingSalad
		? "Ändra innehållet i din sallad"
		: "Välj innehållet i din sallad";
	const buttonText = props.updatingSalad ? "Uppdatera" : "Lägg till";
	return (
		<div className="container col-12">
			<div className="row h-200 p-5 bg-light border rounded-3">
				<h2 className="mb-4">{title}</h2>
				<form onSubmit={(e) => handleSubmit(e)} noValidate>
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
							chooseExtras((prev) => {
								if (prev.includes(val)) {
									return prev.filter((name) => name !== val);
								}
								return [...prev, val];
							});
							// let newExtras = [...chosenExtras];
							// if (chosenExtras.includes(val)) {
							// 	newExtras = chosenExtras.filter((name) => name !== val);
							// } else {
							// 	newExtras.push(val);
							// }
							// chooseExtras(newExtras);
						}}
						multipleChoice={true}
						showExtraError={showExtraError}
					/>

					<Select
						label="Dressing"
						options={dressings}
						chosenValue={chosenDressing}
						onChange={(val) => chooseDressing(val)}
						multipleChoice={false}
					/>
					<button type="submit" className="btn btn-primary">
						{buttonText}
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

			{/* <h2>Din sallad är nu:</h2>
			<p>
				Foundation:{" "}
				<Link to={"/view-ingredient/" + chosenFoundation}>
					{chosenFoundation}
				</Link>
			</p>
			<p>Protein: {chosenProtein}</p>
			<p>
				Extras:{" "}
				{chosenExtras.map((e) => (
					<span key={e}>{e} </span>
				))}
			</p>
			<p>Dressing: {chosenDressing}</p> */}
		</div>
	);
};

const Select = (props) => {
	const { label, options, chosenValue, onChange, multipleChoice } = props;
	const preOnChange = (e, value) => {
		// e.target.parentElement.classList.add("was-validated");
		onChange(value);
	};

	if (multipleChoice) {
		const { showExtraError } = props;
		return (
			<div className="mb-3">
				<h4>Extras</h4>
				{options.map((name) => (
					<div key={name} className="form-check form-check-inline">
						<input
							className="form-check-input"
							style={{ borderColor: "rgba(0,0,0,0.25" }}
							type="checkbox"
							id={name}
							name={name}
							checked={chosenValue.includes(name)}
							onChange={(e) => preOnChange(e, e.target.name)}
						/>
						<label className="form-check-label">
							<Link to={"/view-ingredient/" + name} className="link-dark">
								{name}
							</Link>
						</label>
						{/* <label className="form-check-label" htmlFor={name}>
							{name + " "}
						</label>
						<Link to={"/view-ingredient/" + name} className="link-secondary">
							( i )
						</Link> */}
					</div>
				))}
				{showExtraError && (
					<div className="invalid-feedback" style={{ display: "block" }}>
						Välj mellan 3 - 9 stycken
					</div>
				)}
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
			<div className="row">
				<div className="col-10">
					<select
						required
						className="form-control"
						value={chosenValue}
						defaultValue=""
						onChange={(e) => preOnChange(e, e.target.value)}
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
					<div className="invalid-feedback">Obligatorisk</div>
					{/* <div className="valid-feedback">Ok</div> */}
				</div>
				<div className="col-2">
					{chosenValue && (
						<Link
							to={"/view-ingredient/" + chosenValue}
							className="align-middle link-secondary"
						>
							Info
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};
export default ComposeSalad;
