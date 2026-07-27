import { Link } from "react-router-dom";

function Navbar() {
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
              <span className="font-medium text-gray-600">
                Hi, {user?.name}
              </span>

              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Logout
              </button>
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