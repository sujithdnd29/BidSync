import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, PlusCircle, Home } from "lucide-react";

import { getMyAuctions,getWonAuctions, } from "../services/auctionService";
import AuctionCard from "../components/AuctionCard";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [myAuctions, setMyAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [wonAuctions, setWonAuctions] = useState([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

const fetchProfileData = async () => {
    try {
        const [created, won] = await Promise.all([
            getMyAuctions(),
            getWonAuctions(),
        ]);

        setMyAuctions(created.auctions);
        setWonAuctions(won.auctions);
    } catch (error) {
        toast.error(
            error.response?.data?.message ||
            "Failed to fetch profile."
        );
    } finally {
        setLoading(false);
    }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const activeAuctions = myAuctions.filter(
    (auction) => auction.status === "ACTIVE"
  ).length;

  const endedAuctions = myAuctions.filter(
    (auction) => auction.status === "ENDED"
  ).length;

  const filteredAuctions = useMemo(() => {
    if (filter === "ACTIVE")
      return myAuctions.filter((auction) => auction.status === "ACTIVE");

    if (filter === "ENDED")
      return myAuctions.filter((auction) => auction.status === "ENDED");

    return myAuctions;
  }, [filter, myAuctions]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Profile Card */}

      <div className="bg-white rounded-3xl shadow-lg p-8">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
            {initials}
          </div>

          <div className="flex-1">

            <h1 className="text-3xl font-bold">
              {user.name}
            </h1>

            <p className="text-gray-500 mt-2">
              {user.email}
            </p>

            <span className="inline-block mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
              {user.role}
            </span>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-3xl font-bold">
            {myAuctions.length}
          </p>
          <p className="text-gray-500 mt-2">
            Auctions Created
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-green-600">
            {activeAuctions}
          </p>
          <p className="text-gray-500 mt-2">
            Active Auctions
          </p>
        </div>

       <div className="bg-white rounded-xl p-6 shadow">
    <p className="text-3xl font-bold text-yellow-600">
        {wonAuctions.length}
    </p>

    <p className="text-gray-500 mt-2">
        Won Auctions
    </p>
</div>

      </div>

      {/* Quick Actions */}

      <div className="flex flex-wrap gap-4 mt-8">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl"
        >
          <Home size={18} />
          Home
        </button>

        <button
          onClick={() => navigate("/create-auction")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          <PlusCircle size={18} />
          Create Auction
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-5 py-3 rounded-xl"
        >
          Logout
        </button>

      </div>

      {/* Auctions */}

      <div className="mt-12">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold">
            My Auctions
          </h2>

          <div className="flex gap-3">

            {["ALL", "ACTIVE", "ENDED"].map((type) => (

              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full transition ${
                  filter === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {type}
              </button>

            ))}

          </div>

        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredAuctions.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <User className="mx-auto mb-4" size={40} />

            <h3 className="text-xl font-semibold">
              No Auctions Found
            </h3>

            <p className="text-gray-500 mt-2">
              Start by creating your first auction.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredAuctions.map((auction) => (

              <AuctionCard
                key={auction._id}
                auction={auction}
                isOwner={true}
              />

            ))}

          </div>
          

        )}
          {/* ===================== WON AUCTIONS ===================== */}

        <div className="mt-16">

          <h2 className="text-3xl font-bold mb-6">
            🏆 Auctions I've Won
          </h2>

          {wonAuctions.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <User className="mx-auto mb-4" size={40} />

              <h3 className="text-xl font-semibold">
                No Auctions Won Yet
              </h3>

              <p className="text-gray-500 mt-2">
                Start bidding to win your first auction.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {wonAuctions.map((auction) => (

                <AuctionCard
                  key={auction._id}
                  auction={auction}
                  isOwner={false}
                />

              ))}

            </div>

          )}

        </div>

      </div>

      </div>

    
  );
}

export default Profile;