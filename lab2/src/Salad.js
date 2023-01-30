class Salad {
	// static #instanceCounter = 0;
	static instanceCounter = 0; // does # do anything?
	// #id; // # means private...
	// should I use self?
	// ingredients = {};
	constructor(salad) {
		if (salad instanceof Salad) {
			this.ingredients = { ...salad.ingredients };
		} else if (typeof salad === "string") {
			// JSON
			this.ingredients = { ...JSON.parse(salad).ingredients };
		} else {
			this.ingredients = {};
		}

		this.id = "salad_" + Salad.instanceCounter++;
		// this.uuid = uuidv4();
		// Object.defineProperty(this, "id", {
		// 	value: "salad_" + Salad.instanceCounter++,
		// 	writable: false
		// });
	}
	add(name, properties) {
		this.ingredients[name] = properties;
		return this;
	}
	// add = (name, properties) => {
	// 	this.ingredients[name] = properties;
	// 	return this;
	// };
	remove(name) {
		delete this.ingredients[name];
		return this;
	}

	getPrice() {
		return Object.values(this.ingredients).reduce(
			(total, { price }) => (total += price),
			0
		);
	}
}

export default Salad;
