import { useState } from "react";
import { useEffect } from "react";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
      const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
const loading = toast.loading("Signing in...");

    try {
      const data = await loginUser(formData);

      // Store JWT and user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.dismiss(loading);
    toast.success("Welcome back! 👋");

setTimeout(() => {
   window.location.href = "/";
}, 800);


      console.log(data);
    } catch (error) {
       toast.dismiss(loading);
      toast.error(
    error.response?.data?.message || "Login failed"
);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
        navigate("/");
    }
}, [navigate]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 lg:grid lg:grid-cols-2">

    {/* Left Section */}
    <div className="hidden lg:flex flex-col justify-center px-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">

      <h1 className="text-6xl font-extrabold">
        Bid<span className="text-blue-200">Sync</span>
      </h1>

      <p className="mt-5 text-2xl font-semibold">
        Bid. Win. Own.
      </p>

      <p className="mt-4 text-blue-100 text-lg leading-8">
        Experience real-time online auctions with a secure and modern
        bidding platform.
      </p>

      <div className="mt-12 space-y-6">

        <div className="flex items-center gap-4">
          <span className="text-3xl">⚡</span>
          <span className="text-xl">Live Auctions</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-3xl">🔒</span>
          <span className="text-xl">Secure Authentication</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-3xl">🏆</span>
          <span className="text-xl">Trusted Marketplace</span>
        </div>

      </div>

    </div>

    {/* Right Section */}

    <div className="flex justify-center items-center px-6 py-10">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

        <h2 className="text-4xl font-bold text-gray-800">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 mt-2">
          Login to continue to BidSync
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">

  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
  >
    {showPassword ? "🙈" : "👁️"}
  </button>

</div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </button>
        </p>

      </div>

    </div>

  </div>
);
}

export default Login;