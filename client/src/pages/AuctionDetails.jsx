import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getAuctionById } from "../services/auctionService";
import { placeBid,getBidHistory, } from "../services/bidService";
import socket from "../services/socket";
function AuctionDetails() {

    const { id } = useParams();

    const [auction, setAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [bids, setBids] = useState([]);
    

    const fetchAuction = async () => {

        try {

            const data = await getAuctionById(id);

            setAuction(data.auction);

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
    if (!auction) {

        return <h2>Loading...</h2>;

    }

    return (

        <div>

            <h1>{auction.title}</h1>

            <p>{auction.description}</p>

            <h2>₹ {auction.currentPrice}</h2>

            <p>Seller : {auction.seller.name}</p>

            <p>Highest Bidder : {auction.highestBidder?.name || "No bids yet"}</p>

            <p>Status : {auction.status}</p>

          <div style={{ marginTop: "20px" }}>

    <input
        type="number"
        placeholder="Enter your bid"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
    />

    <button
        onClick={handleBid}
        disabled={loading}
    >
        {loading ? "Placing Bid..." : "Place Bid"}
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