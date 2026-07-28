
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
const [showMenu, setShowMenu] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-blue-600"
        >
         <span className="text-4xl font-extrabold tracking-tight text-blue-600">
  Bid<span className="text-slate-900">Sync</span>
</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="text-gray-600 font-medium hover:text-blue-600 transition duration-300"
          >
            Home
          </Link>

          <Link
            to="/create-auction"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Sell
          </Link>

          {token ? (
            <>
              <div className="relative">
  <button
    onClick={() => setShowMenu(!showMenu)}
    className="font-medium text-gray-700 hover:text-blue-600 transition"
  >
    Hi, {user?.name} ▼
  </button>

  {showMenu && (
    <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border overflow-hidden">
      <button
        onClick={() => {
          navigate("/profile");
          setShowMenu(false);
        }}
        className="w-full text-left px-4 py-3 hover:bg-gray-100"
      >
        👤 Profile
      </button>

      <button
        onClick={() => {
          navigate("/create-auction");
          setShowMenu(false);
        }}
        className="w-full text-left px-4 py-3 hover:bg-gray-100"
      >
        ➕ Sell an Item
      </button>

      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
      >
        🚪 Logout
      </button>
    </div>
  )}
</div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;