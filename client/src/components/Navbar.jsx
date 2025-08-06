import logo from "../assets/images/logo.png";
import { NavLink, Link } from "react-router-dom";
import useAuthValue from "../hooks/useAuthValue";

const Navbar = () => {
  const { user, logOut } = useAuthValue();

  return (
    <nav className="w-full shadow-sm bg-white">
      <div className="navbar max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img className="h-8 w-auto" src={logo} alt="SoloSphere Logo" />
            <span className="text-xl font-bold tracking-wide text-gray-800">
              SoloSphere
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium uppercase tracking-wide transition hover:text-blue-600 ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-600"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `text-sm font-medium uppercase tracking-wide transition hover:text-blue-600 ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-600"
                  }`
                }
              >
                All Jobs
              </NavLink>
            </li>

            {!user && (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-sm font-medium uppercase tracking-wide transition hover:text-blue-600 ${
                      isActive
                        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                        : "text-gray-600"
                    }`
                  }
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>

          {/* User Dropdown */}
          {user && (
            <div className="dropdown dropdown-end z-50">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div
                  className="w-10 h-10 rounded-full ring-2 ring-blue-500"
                  title={user?.displayName}
                >
                  <img
                    referrerPolicy="no-referrer"
                    alt="User Profile"
                    src={user?.photoURL}
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg bg-white rounded-lg w-52 space-y-1"
              >
                <li>
                  <NavLink
                    to="/add-job"
                    className={({ isActive }) =>
                      `text-sm font-medium uppercase tracking-wide transition hover:text-blue-600 ${
                        isActive
                          ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                          : "text-gray-600"
                      }`
                    }
                  >
                    Add Job
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-posted-jobs"
                    className={({ isActive }) =>
                      `text-sm font-medium uppercase tracking-wide transition hover:text-blue-600 ${
                        isActive
                          ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                          : "text-gray-600"
                      }`
                    }
                  >
                    My Posted Jobs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-bids"
                    className={({ isActive }) =>
                      `text-sm font-medium uppercase tracking-wide transition hover:text-blue-600 ${
                        isActive
                          ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                          : "text-gray-600"
                      }`
                    }
                  >
                    My Bids
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/bid-requests"
                    className={({ isActive }) =>
                      `text-sm font-medium uppercase tracking-wide transition hover:text-blue-600 ${
                        isActive
                          ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                          : "text-gray-600"
                      }`
                    }
                  >
                    Bid Requests
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={logOut}
                    className="w-full text-left px-3 py-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
