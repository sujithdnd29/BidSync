import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getAuctionById,deleteAuction } from "../services/auctionService";
import { placeBid,getBidHistory, } from "../services/bidService";
import socket from "../services/socket";
import { useNavigate } from "react-router-dom";
function AuctionDetails() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [auction, setAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [bids, setBids] = useState([]);
   const [countdown, setCountdown] = useState({
    label: "",
    value: "",
    phase: "",
});
const [selectedImage, setSelectedImage] = useState("");
const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
);
    

    const fetchAuction = async () => {

        try {

            const data = await getAuctionById(id);

           setAuction(data.auction);

if (data.auction.images?.length > 0) {
    setSelectedImage(data.auction.images[0].url);
}

        } catch (error) {

            console.log(error);

        }

    };
    const fetchBidHistory = async () => {

    try {

        const data = await getBidHistory(id);

        setBids(data.bids);

    } catch (error) {

        console.log(error);

    }
   

};
const calculateTimeLeft = () => {

    if (!auction) return;

    const now = new Date();

    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);

    let difference;
    let label;
    let phase;

    if (now < start) {

        difference = start - now;
        label = "Starts In";
        phase = "UPCOMING";

    } else if (now < end) {

        difference = end - now;
        label = "Ends In";
        phase = "ACTIVE";

    } else {

        setCountdown({
            label: "Auction",
            value: "Ended",
            phase: "ENDED",
        });

        return;

    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    setCountdown({
        label,
        value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        phase,
    });

};
const getStatusBadge = () => {

    switch (countdown.phase) {

        case "UPCOMING":
            return (
                <span className="status-badge upcoming">
                    🟡 Upcoming
                </span>
            );

        case "ACTIVE":
            return (
                <span className="status-badge active">
                    🟢 Active
                </span>
            );

        case "ENDED":
            return (
                <span className="status-badge ended">
                    🔴 Ended
                </span>
            );

        default:
            return null;
    }

};
const handleBid = async () => {
    if (!bidAmount || Number(bidAmount) <= 0) {
    alert("Please enter a valid bid amount.");
    return;
}

    try {

        setLoading(true);

        await placeBid(id, Number(bidAmount));

        await fetchAuction();

        await fetchBidHistory();


        setBidAmount("");

        alert("Bid placed successfully!");

    } catch (error) {

        alert(
            error.response?.data?.message ||
            "Something went wrong."
        );

    } finally {

        setLoading(false);

    }

};
const handleDelete = async () => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this auction?"
    );

    if (!confirmDelete) return;

    try {

        await deleteAuction(id);

        alert("Auction deleted successfully.");

        navigate("/");

    } catch (error) {
        console.log(error);
console.log(error.response);

alert(
    error.response?.data?.message ||
    error.message ||
    "Failed to delete auction."
);

        alert(
            error.response?.data?.message ||
            "Failed to delete auction."
        );

    }

};
  useEffect(() => {

    fetchAuction();
    fetchBidHistory();

    socket.emit("join-auction", id);

    socket.on("new-bid", () => {

        fetchAuction();
        fetchBidHistory();

    });

    return () => {

        socket.emit("leave-auction", id);

        socket.off("new-bid");

    };

}, [id]);
useEffect(() => {

    if (!auction) return;

    calculateTimeLeft();

    const interval = setInterval(() => {

        calculateTimeLeft();

    }, 1000);

    return () => clearInterval(interval);

}, [auction]);
    if (!auction) {

        return <h2>Loading...</h2>;

    }
    const isSeller =
    currentUser &&
    auction.seller &&
    currentUser.id === auction.seller._id;

    return (

        <div>

            <h1>{auction.title}</h1>
            {auction.images?.length > 0 && (
    <div style={{ marginBottom: "20px" }}>
        <img
            src={selectedImage}
            alt={auction.title}
            style={{
                width: "100%",
                maxWidth: "600px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "10px",
            }}
        />
    </div>
)}
{auction.images?.length > 1 && (
    <div
        style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
        }}
    >
        {auction.images.map((image) => (
            <img
                key={image.public_id}
                src={image.url}
                alt="Auction"
                onClick={() => setSelectedImage(image.url)}
                style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border:
                        selectedImage === image.url
                            ? "3px solid blue"
                            : "1px solid gray",
                }}
            />
        ))}
    </div>
)}

            <p>{auction.description}</p>

            <h2>₹ {auction.currentPrice}</h2>

            <p>Seller : {auction.seller.name}</p>

            <p>Highest Bidder : {auction.highestBidder?.name || "No bids yet"}</p>

           <p>
    <strong>Status:</strong> {getStatusBadge()}
</p>
{isSeller && countdown.phase === "UPCOMING" && (
    <button
        onClick={handleDelete}
        style={{
            background: "red",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
        }}
    >
        Delete Auction
    </button>
)}
            {countdown.phase === "ENDED" && (
    <div style={{ marginTop: "20px" }}>
        <h3>🏆 Auction Result</h3>

        <p>
            Winner:{" "}
            {auction.highestBidder?.name || "No Winner"}
        </p>

        <p>
            Winning Bid: ₹ {auction.currentPrice}
        </p>
    </div>
)}
         <p>
    <strong>⏳ {countdown.label}:</strong>{" "}
    {countdown.value}
</p>

          <div style={{ marginTop: "20px" }}>

    <input
        type="number"
        placeholder="Enter your bid"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
    />
<button
    onClick={handleBid}
    disabled={
        loading ||
        countdown.phase !== "ACTIVE"
    }
>
   {
loading
? "Placing Bid..."
: countdown.phase === "UPCOMING"
? "Auction Not Started"
: countdown.phase === "ENDED"
? "Auction Ended"
: "Place Bid"
}
</button>
    <h2>Bid History</h2>

{bids.length === 0 ? (
    <p>No bids yet.</p>
) : (
    bids.map((bid) => (
        <div key={bid._id}
         style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "8px"
    }}>
            <p>
                <strong>{bid.bidder.name}</strong>
            </p>
            <p>₹ {bid.amount}</p>
            <p>
    {new Date(bid.createdAt).toLocaleString()}
</p>
        </div>
    ))
)}

</div>

        </div>

    );

}

export default AuctionDetails;