const { v4: uuidv4 } = require("uuid");

class Salad {
	// should I use self?
	// ingredients = {};
	constructor(salad) {
		if (salad instanceof Salad) {
			this.ingredients = { ...salad.ingredients };
		} else if (typeof salad === "string") {
			// JSON
			this.ingredients = JSON.parse(salad).ingredients;
		} else if (typeof salad === "object") {
			if (salad.ingredients && salad.id) {
				this.ingredients = salad.ingredients;
				this.id = salad.id;
			} else {
				this.ingredients = salad;
			}
		} else {
			this.ingredients = {};
		}
		if (!this.id) {
			this.id = uuidv4();
		}

		// Object.defineProperty(this, "id", {
		// 	value: "salad_" + Salad.instanceCounter++,
		// 	writable: false
		// });
	}

	static parseArray(saladsJSON) {
		return JSON.parse(saladsJSON).map((salad) => new Salad(salad));
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
