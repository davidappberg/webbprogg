import { useParams } from "react-router-dom";
import FourOhFour from "./FourOhFour";

const names = {
	gluten: "Gluten",
	lactose: "Laktos",
	vegan: "Vegatarisk",
	foundation: "Typ: Bas",
	extra: "Typ: Extra",
	dressing: "Typ: Dressing",
	protein: "Typ: Protein"
};
const ViewIngredient = ({ inventory }) => {
	let { name } = useParams();
	const info = inventory[name];
	if (!info) {
		return <FourOhFour title="404 Ingredienten hittades inte" />;
	}
	return (
		<div className="container col-12">
			<div className="row h-200 p-5 bg-light border rounded-3">
				<h2>{name}</h2>
				<p>Pris: {info.price}</p>
				{Object.keys(info).map((property) =>
					names[property] ? <p key={property}>{names[property]}</p> : null
				)}
			</div>
		</div>
	);
};
export default ViewIngredient;
