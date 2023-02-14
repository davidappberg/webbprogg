import { NavLink } from "react-router-dom";

const NavBar = (props) => {
	return (
		<ul className="nav nav-tabs">
			<li className="nav-item">
				<NavLink to="/" className="nav-link">
					Start
				</NavLink>
				{/* <span className="nav-link active">Komponera en sallad</span> */}
			</li>
			<li className="nav-item">
				<NavLink to="/compose-sallad" className="nav-link">
					Komponera en sallad
				</NavLink>
				{/* <span className="nav-link active">Komponera en sallad</span> */}
			</li>
			<li className="nav-item">
				<NavLink to="/view-order" className="nav-link">
					Visa beställningen
				</NavLink>
			</li>
		</ul>
	);
};

// const NavBarResp = (props) => {
// 	return (
// 		<nav className="navbar navbar-expand-lg bg-light">
// 			<div className="container-fluid">
// 				{/* <span className="navbar-brand">Salladsbaren</span> */}
// 				<button
// 					className="navbar-toggler"
// 					type="button"
// 					data-bs-toggle="collapse"
// 					data-bs-target="#navbarSupportedContent"
// 					aria-controls="navbarSupportedContent"
// 					aria-expanded="false"
// 					aria-label="Toggle navigation"
// 				>
// 					<span className="navbar-toggler-icon"></span>
// 				</button>
// 				<div className="collapse navbar-collapse" id="navbarSupportedContent">
// 					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
// 						<li className="nav-item">
// 							<NavLink to="/compose" className="nav-link">
// 								Komponera en sallad
// 							</NavLink>
// 							{/* <span className="nav-link active">Komponera en sallad</span> */}
// 						</li>
// 						<li className="nav-item">
// 							<NavLink to="/view" className="nav-link">
// 								Visa beställningen
// 							</NavLink>
// 						</li>
// 					</ul>
// 				</div>
// 			</div>
// 		</nav>
// 	);
// };

export default NavBar;
