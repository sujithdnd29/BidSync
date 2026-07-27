import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>BidSync</h2>

      <Link to="/">Home</Link>

      <Link to="/login">Login</Link>

      <Link to="/register">Register</Link>

      <Link to="/profile">Profile</Link>
      <Link to="/create-auction">Create Auction</Link>
    </nav>
  );
}

export default Navbar;