import { Outlet } from "react-router-dom";

export const PageOutline = ({ children }) => (
	<div className="container col-12">
		<div className="row h-200 p-5 bg-light border rounded-3">
			<Outlet />
			{children}
		</div>
	</div>
);

export const PageOuterOutline = ({ children }) => (
	<div className="container py-4">{children}</div>
);
