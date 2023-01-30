import React from "react";

class Basket extends React.Component {
	basket = [];
	constructor() {
		super(this.props);
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
	getBasket() {
		return this.basket;
	}
}
export default Basket;
