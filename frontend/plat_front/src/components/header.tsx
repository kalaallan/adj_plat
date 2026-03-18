import type {} from "react";
import { NavLink } from "react-router-dom";


const Header = () => {
  return (
    <header className="bg-white shadow-md rounded-md max-w-6xl mx-auto my-4">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          MonApp
        </div>

        {/* Navigation centrale */}
        <nav className="flex gap-6 text-gray-700 font-medium">
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

          <NavLink
            to="/Workspace"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg cursor-pointer transition ${
                isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-100 hover:text-blue-600"
              }`
            }
          >
            Workspace
          </NavLink>

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
        </nav>

        {/* Logout */}
        <div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
            Logout
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;