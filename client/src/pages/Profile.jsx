import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <>
      <h1>Profile</h1>

      <button onClick={handleLogout}>
        Logout
      </button>
    </>
  );
}

export default Profile;