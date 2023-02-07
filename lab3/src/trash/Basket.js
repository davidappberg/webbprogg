// import React from "react";

class Basket {
	// basket = [];
	constructor() {
		// super(this.props);
		this.basket = [];
	}
	addSalad(salad) {
		this.basket.push(salad);
		return this;
	}
	removeSalad(id) {
		this.basket = this.basket.filter((s) => s.id !== id);
		return this;
	}
	getBasketPrice() {
		return this.basket.reduce((total, s) => total + s.getPrice(), 0);
	}
	getBasket() {
		return this.basket;
	}
}
export default Basket;
