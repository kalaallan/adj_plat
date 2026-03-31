import type {} from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/loginSlice";
import { useAppDispatch } from "../store/hooks";
import { persistor } from "../store";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.flush();
    localStorage.removeItem("persist:login");
    console.log("Déconnexion...");
    navigate("/login");
  };

  const isWorkspaceActive = location.pathname.startsWith("/Workspace");

  return (
    <header className="bg-white shadow-md rounded-md max-w-6xl mx-auto my-4">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          MonApp
        </div>

        {/* Navigation */}
        <nav className="flex gap-6 text-gray-700 font-medium">

          {/* Dashboard */}
          {isWorkspaceActive ? (
            <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed">
              Dashboard
            </div>
          ) : (
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg cursor-pointer transition ${
                  isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-100 hover:text-blue-600"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}

          {/* Workspace */}
          {isWorkspaceActive ? (
            <NavLink
              to={location.pathname}
              className="px-4 py-2 rounded-lg cursor-pointer transition bg-blue-100 text-blue-600"
            >
              Workspace
            </NavLink>
          ) : (
            <div
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed"
              title="Sélectionnez un examen dans Examen pour accéder"
            >
              Workspace
            </div>
          )}

          {/* Examen */}
          {isWorkspaceActive ? (
            <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed">
              Examen
            </div>
          ) : (
            <NavLink
              to="/Examen"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg cursor-pointer transition ${
                  isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-100 hover:text-blue-600"
                }`
              }
            >
              Examen
            </NavLink>
          )}

        </nav>

        {/* Logout */}
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;