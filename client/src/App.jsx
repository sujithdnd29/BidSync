import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateAuction from "./pages/CreateAuction";
import AuctionDetails from "./pages/AuctionDetails";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/profile" 
          element={
           <ProtectedRoute>
              <Profile />
           </ProtectedRoute>
          }
        />
       <Route path="/create-auction"
         element={
          <ProtectedRoute>
             <CreateAuction />
          </ProtectedRoute>
         }
      />
      <Route
    path="/auction/:id"
    element={<AuctionDetails />}
/>
      </Routes>
    </>
  );
}

export default App;