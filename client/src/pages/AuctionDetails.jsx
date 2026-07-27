import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAuctionById,
    deleteAuction,
} from "../services/auctionService";

import {
    placeBid,
    getBidHistory,
} from "../services/bidService";

import socket from "../services/socket";

function AuctionDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [auction, setAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [bids, setBids] = useState([]);

    const [selectedImage, setSelectedImage] = useState("");

    const [countdown, setCountdown] = useState({
        label: "",
        value: "",
        phase: "",
    });

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
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                        🟡 Upcoming
                    </span>
                );

            case "ACTIVE":
                return (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                        🟢 Active
                    </span>
                );

            case "ENDED":
                return (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
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
        return (
            <div className="flex justify-center items-center h-screen text-2xl font-semibold">
                Loading...
            </div>
        );
    }

    const isSeller =
        currentUser &&
        auction.seller &&
        currentUser.id === auction.seller._id;

    return (
       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

<div className="max-w-7xl mx-auto px-6 py-10">

    <div className="grid lg:grid-cols-2 gap-12">

        {/* LEFT COLUMN */}

        <div>

            {auction.images?.length > 0 ? (
                <>
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={selectedImage}
                            alt={auction.title}
                            className="w-full h-[500px] object-cover transition-transform
duration-500
hover:scale-105"
                        />
                    </div>

                    {auction.images.length > 1 && (
                        <div className="flex gap-3 mt-5 flex-wrap">
                            {auction.images.map((image) => (
                                <img
                                    key={image.public_id}
                                    src={image.url}
                                    alt="Auction"
                                    onClick={() =>
                                        setSelectedImage(image.url)
                                    }
                                    className={`w-20 h-20 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                                        selectedImage === image.url
                                            ? "border-blue-600"
                                            : "border-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="h-[500px] rounded-2xl bg-slate-100 flex items-center justify-center text-7xl">
                    📦
                </div>
            )}

        </div>

        {/* RIGHT COLUMN */}

        <div className="bg-white
rounded-3xl
shadow-2xl
border
border-slate-100
p-8
h-fit
sticky
top-24">

            <h1 className="text-4xl font-bold text-slate-900">
                {auction.title}
            </h1>

            <p className="mt-6 text-gray-700 leading-relaxed">
                {auction.description}
            </p>
            <div className="mt-6">

    {countdown.phase === "ACTIVE" && (
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
            🔥 Live Auction
        </span>
    )}

    {countdown.phase === "UPCOMING" && (
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
            ⏳ Starting Soon
        </span>
    )}

    {countdown.phase === "ENDED" && (
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold">
            🏁 Auction Ended
        </span>
    )}

</div>

           <div className="mt-8">

   <div className="mt-8">

    <p className="uppercase tracking-wider text-sm text-gray-1000">
        Current Price
    </p>

    

</div>

    <h3 className="text-5xl font-extrabold text-blue-600">
        💰 ₹ {auction.currentPrice}
    </h3>

</div>

           <div className="mt-8 space-y-4">

    <div className="flex justify-between">
        <span className="font-semibold">
            👤 Seller
        </span>

        <span>{auction.seller.name}</span>
    </div>

    <div className="flex justify-between">
        <span className="font-semibold">
            🏆 Highest Bidder
        </span>

        <span>
            {auction.highestBidder?.name || "No bids yet"}
        </span>
    </div>

    <div className="flex justify-between">
        <span className="font-semibold">
            Status
        </span>

        {getStatusBadge()}
    </div>

    <div className="flex justify-between">
        <span className="font-semibold">
            ⏳ {countdown.label}
        </span>

        <span>{countdown.value}</span>
    </div>

</div>

            {isSeller &&
                countdown.phase === "UPCOMING" && (
                    <button
                        onClick={handleDelete}
                        className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
                    >
                        Delete Auction
                    </button>
                )}

            {countdown.phase === "ENDED" && (
                <div className="mt-8 rounded-xl bg-green-50 border border-green-300 p-5">

                    <h3 className="text-xl font-bold text-green-700">
                        🏆 Auction Result
                    </h3>

                    <p className="mt-3">
                        Winner:{" "}
                        {auction.highestBidder?.name ||
                            "No Winner"}
                    </p>

                    <p className="mt-2">
                        Winning Bid: ₹{" "}
                        {auction.currentPrice}
                    </p>

                </div>
            )}

            <div className="mt-8">

                <input
                    type="number"
                    placeholder="Enter your bid"
                    value={bidAmount}
                    onChange={(e) =>
                        setBidAmount(e.target.value)
                    }
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleBid}
                    disabled={
                        loading ||
                        countdown.phase !== "ACTIVE"
                    }
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition"
                >
                    {loading
                        ? "Placing Bid..."
                        : countdown.phase ===
                          "UPCOMING"
                        ? "Auction Not Started"
                        : countdown.phase ===
                          "ENDED"
                        ? "Auction Ended"
                        : "Place Bid"}
                </button>

            </div>

        </div>

    </div>

    {/* BID HISTORY */}

    <div className="mt-16">

        <h2 className="text-3xl font-bold mb-8">
            📜 Bid History
        </h2>

        {bids.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6">
                No bids yet.
            </div>
        ) : (
            <div className="space-y-4">

                {bids.map((bid) => (

                    <div
                        key={bid._id}
                        className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
                    >

                        <div>

                            <h3 className="font-bold">
                                👤 {bid.bidder.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                                🕒 {new Date(
                                    bid.createdAt
                                ).toLocaleString()}
                            </p>

                        </div>

                        <div className="text-2xl font-bold text-blue-600">
                            ₹ {bid.amount}
                        </div>

                    </div>

                ))}

            </div>
        )}

    </div>

</div>
</div>

);
}

export default AuctionDetails;