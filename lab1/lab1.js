"use strict";
const { v4: uuidv4 } = require("uuid");
const imported = require("./inventory.js");
console.log(imported.inventory["Sallad"]);

let names = Object.keys(imported.inventory);
// names
// 	.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
// 	.forEach((name) => console.log(name));
names.sort((a, b) => a.localeCompare(b, "sv", { sensitivity: "case" }));
//.forEach((name) => console.log(name));

console.log("\n--- Assignment 1 ---------------------------------------");

function makeOptions_alt(inv, prop) {
	function myReducer(total, key, value) {
		let val = `<option value="${key}"> ${key}, ${value.price} kr </option>`;
		return [...total, val];
	}
	let res = Object.keys(inv)
		.filter((key) => inv[key][prop])
		.reduce(
			(total, key) =>
				// myReducer(total, key, inv[key])
				[
					...total,
					`<option value="${key}"> ${key}, ${inv[key].price} kr </option>`
				],
			[]
		);
	return res;
}
const makeOptions = (inv, prop) => {
	return Object.entries(inv)
		.filter(([key, value]) => value[prop])
		.map(([key, value]) => {
			return `<option value="${key}"> ${key}, ${value.price} kr </option>`; //
			// return <option value={key}>"{key + ", " + value.price + " kr"}</option>;
		});
};

let htmlOptions = makeOptions(imported.inventory, "foundation");
console.log(htmlOptions);
// let htmlOptions_alt = makeOptions_alt(imported.inventory, "foundation"); // same as above

console.log("\n--- Assignment 2 ---------------------------------------");

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
			this.ingredients = { ...JSON.parse(salad).ingredients }; // behöver ej kopieras
		} else {
			this.ingredients = {};
		}

		this.id = "salad_" + Salad.instanceCounter++;
		this.uuid = uuidv4();
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
}

let myCaesarSalad = new Salad()
	.add("Sallad", imported.inventory["Sallad"])
	.add("Kycklingfilé", imported.inventory["Kycklingfilé"])
	.add("Bacon", imported.inventory["Bacon"])
	.add("Krutonger", imported.inventory["Krutonger"])
	.add("Parmesan", imported.inventory["Parmesan"])
	.add("Ceasardressing", imported.inventory["Ceasardressing"])
	.add("Gurka", imported.inventory["Gurka"]);
console.log(JSON.stringify(myCaesarSalad) + "\n");
// console.log(myCaesarSalad);
myCaesarSalad.remove("Gurka");
console.log(JSON.stringify(myCaesarSalad) + "\n");
// console.log(myCaesarSalad);

console.log("\n--- Assignment 3 ---------------------------------------");

// can this be written with arrow syntax?
Salad.prototype.getPrice = function () {
	return Object.values(this.ingredients).reduce(
		(total, { price }) => (total += price),
		0
	);
};
Salad.prototype.count = function (property) {
	return Object.values(this.ingredients).filter((val) => val[property]).length;
};

console.log("En ceasarsallad kostar " + myCaesarSalad.getPrice() + "kr");
// En ceasarsallad kostar 45kr
console.log(
	"En ceasarsallad har " +
		myCaesarSalad.count("lactose") +
		" ingredienser med laktos"
); // En ceasarsallad har 2 ingredienser med laktos
console.log(
	"En ceasarsallad har " + myCaesarSalad.count("extra") + " tillbehör"
); // En ceasarsallad har 3 tillbehör

const reflectionQuestion3 = () => {
	console.log(
		"\n--- reflection question 3 ---------------------------------------"
	);
	console.log("Salad:", Salad);
	console.log("typeof Salad:", typeof Salad);
	console.log("Salad.prototype:", Salad.prototype);
	console.log("typeof Salad.prototype:", typeof Salad.prototype);
	console.log("Salad.prototype.prototype:", Salad.prototype.prototype);
	console.log(
		"typeof Salad.prototype.prototype:",
		typeof Salad.prototype.prototype
	);

	console.log("myCaesarSalad:", myCaesarSalad);
	console.log("typeof myCaesarSalad:", typeof myCaesarSalad);
	console.log("myCaesarSalad.prototype:", myCaesarSalad.prototype);
	console.log(
		"typeof myCaesarSalad.prototype:",
		typeof myCaesarSalad.prototype
	);

	console.log(
		"check 1: " + (Salad.prototype === Object.getPrototypeOf(myCaesarSalad))
	); // true
	console.log(
		"check 2: " + (Object.prototype === Object.getPrototypeOf(Salad.prototype))
	); // true
};
reflectionQuestion3();

console.log("\n--- Assignment 4 ---------------------------------------");
const objectCopy = new Salad(myCaesarSalad);
const json = JSON.stringify(myCaesarSalad);
const jsonCopy = new Salad(json);
console.log("myCesarSalad\n" + JSON.stringify(myCaesarSalad));
console.log("copy from object\n" + JSON.stringify(objectCopy));
console.log("copy from json\n" + JSON.stringify(jsonCopy));
objectCopy.add("Gurka", imported.inventory["Gurka"]);
console.log("originalet kostar kostar " + myCaesarSalad.getPrice() + " kr");
console.log("med gurka kostar den " + objectCopy.getPrice() + " kr");

class GourmetSalad extends Salad {
	constructor(props) {
		super(props);
		// when creating from copy
		Object.values(this.ingredients).forEach((prop) => (prop.size = 1));
	}
	add(ingredient, props, size = 1) {
		if (this.ingredients[ingredient]) {
			this.ingredients[ingredient].size += size;
			this.ingredients[ingredient].price += props.price * size;
			return this;
		}
		let propsWithSize = { ...props };
		propsWithSize.size = size;
		propsWithSize.price *= size;

		return super.add(ingredient, propsWithSize);
	}
}

console.log("\n--- Assignment 5 ---------------------------------------");

// let myGourmetSalad = new GourmetSalad();

let myGourmetSalad = new GourmetSalad()
	.add("Sallad", imported.inventory["Sallad"], 0.5)
	.add("Kycklingfilé", imported.inventory["Kycklingfilé"], 2)
	.add("Bacon", imported.inventory["Bacon"], 0.5)
	.add("Krutonger", imported.inventory["Krutonger"])
	.add("Parmesan", imported.inventory["Parmesan"], 2)
	.add("Ceasardressing", imported.inventory["Ceasardressing"]);
console.log(
	"Min gourmetsallad med lite bacon kostar " + myGourmetSalad.getPrice() + " kr"
);
console.log("Bacon: ", myGourmetSalad.ingredients.Bacon);
myGourmetSalad.add("Bacon", imported.inventory["Bacon"], 1);
console.log("Med extra bacon kostar den " + myGourmetSalad.getPrice() + " kr");
console.log("Bacon: ", myGourmetSalad.ingredients.Bacon);

console.log("\n--- Assignment 6 ---------------------------------------");

console.log("Min gourmetsallad har id: " + myGourmetSalad.id);
myGourmetSalad.id = "salad_30";
console.log("Min gourmetsallad har nytt id: " + myGourmetSalad.id);
console.log("Min gourmetsallad har uuid: " + myGourmetSalad.uuid);

// for (let i = 0; i < 10; i++) {
// 	let s = new GourmetSalad();
// 	console.log("Test gourmetsallad id: " + s.id);
// }
console.log("\n--- Extra ---------------------------------------");

class Order {
	// basket = [];
	constructor() {
		this.basket = [];
	}
	addSalad(salad) {
		this.basket.push(salad);
		return this;
	}
	removeSalad(salad) {
		this.basket = this.basket.filter((s) => s.uuid !== salad.uuid);
		return this;
	}
	getBasketPrice() {
		return this.basket.reduce((total, s) => total + s.getPrice(), 0);
	}
}

let myOrder = new Order();

// objectCopy, jsonCopy, myGourmetSalad
myOrder
	.addSalad(myCaesarSalad)
	.addSalad(objectCopy)
	.addSalad(jsonCopy)
	.addSalad(myGourmetSalad);
console.log("Basket price: ", myOrder.getBasketPrice());

myOrder.removeSalad(objectCopy).removeSalad(jsonCopy);
console.log("Basket price: ", myOrder.getBasketPrice());

// console.log("myCaesarSalad price: ", myCaesarSalad.getPrice());
// console.log("objectCopy price: ", objectCopy.getPrice());
// console.log("jsonCopy price: ", jsonCopy.getPrice());
// console.log("myGourmetSalad price: ", myGourmetSalad.getPrice());
// console.log(
// 	myCaesarSalad.getPrice() +
// 		objectCopy.getPrice() +
// 		jsonCopy.getPrice() +
// 		myGourmetSalad.getPrice()
// );
// console.log(myCaesarSalad.getPrice() + myGourmetSalad.getPrice());
