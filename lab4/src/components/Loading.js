import { useEffect, useState } from "react";

const sizes = {
	large: {
		outerClassNames: "d-flex justify-content-center",
		width: "3em",
		class: "mx-3"
	},
	small: {
		outerClassNames: "d-flex justify-content-between align-items-center",
		width: "1em",
		class: "" // "mx-1"
	}
};

const Loading = ({ size = "large" }) => {
	const [second, showSecond] = useState(false);
	const [third, showThird] = useState(false);

	useEffect(() => {
		setTimeout(() => showSecond(true), 50);
		setTimeout(() => showThird(true), 100);
	}, []);

	// let outerClassNames = "d-flex justify-content-center"
	// if (size == "small")
	return (
		<div className={sizes[size].outerClassNames} style={{ height: "100%" }}>
			<Dot visible={true} params={sizes[size]} />
			<Dot visible={second} params={sizes[size]} />
			<Dot visible={third} params={sizes[size]} />
			{/* {second ? <Dot size={sizes[size]} /> : <Empty />}
					{third ? <Dot size={sizes[size]} /> : <Empty />} */}
			{/* <Dot />
					{second ? <Dot /> : <Empty />}
					{third ? <Dot /> : <Empty />} */}
		</div>
	);
};

const Dot = ({ visible, params }) => {
	if (visible) {
		return (
			<div
				className={["spinner-grow", params.class].join(" ")}
				style={{ width: params.width, height: params.width }}
				role="status"
			>
				<span className="visually-hidden">Loading...</span>
			</div>
		);
	} else {
		return (
			<div
				className={params.class}
				style={{ width: params.width, height: params.width }}
			/>
		);
	}
};

// const Empty = ({ size }) => (

// );

export default Loading;
