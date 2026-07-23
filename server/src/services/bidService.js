const mongoose = require("mongoose");

const Auction = require("../models/Auction");
const Bid = require("../models/Bid");

const { AUCTION_STATUS } = require("../constants/auctionConstants");

const placeBid = async (auctionId, bidderId, amount) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(auctionId)) {
            throw new Error("Invalid auction ID.");
        }

        // Find Auction
        const auction = await Auction.findById(auctionId).session(session);

        if (!auction) {
            throw new Error("Auction not found.");
        }

        // Auction must be ACTIVE
        if (auction.status !== AUCTION_STATUS.ACTIVE) {
            throw new Error("Only active auctions accept bids.");
        }

        // Seller cannot bid
        if (auction.seller.toString() === bidderId.toString()) {
            throw new Error("You cannot bid on your own auction.");
        }

        // Bid amount validation
        if (typeof amount !== "number" || amount <= 0) {
            throw new Error("Please provide a valid bid amount.");
        }

        if (amount <= auction.currentPrice) {
            throw new Error(
                "Bid amount must be greater than current price."
            );
        }


        // Atomic auction update (Optimistic Concurrency Control)
        const updatedAuction = await Auction.findOneAndUpdate(
            {
                _id: auctionId,
                currentPrice: auction.currentPrice,
            },
            {
                $set: {
                    currentPrice: amount,
                    highestBidder: bidderId,
                },
                $inc: {
                    totalBids: 1,
                },
            },
            {
                new: true,
                session,
            }
        );

        if (!updatedAuction) {
            throw new Error(
                "Auction price changed. Please refresh and bid again."
            );
        }

        // Create Bid
        const bids = await Bid.create(
            [
                {
                    auction: auctionId,
                    bidder: bidderId,
                    amount,
                },
            ],
            { session }
        );

        await session.commitTransaction();

        return bids[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

const getBidHistory = async (auctionId) => {

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        throw new Error("Invalid auction ID.");
    }

    // Check if auction exists
    const auction = await Auction.findById(auctionId);

    if (!auction) {
        throw new Error("Auction not found.");
    }

    // Fetch bid history
    const bids = await Bid.find({
        auction: auctionId,
    })
        .populate({ path: "bidder",select: "name",})
        .sort({ createdAt: -1 });

    return bids;
};

const getMyBids = async (userId) => {

    const bids = await Bid.find({
        bidder: userId,
    })
        .populate({
            path: "auction",
            select: "title currentPrice status endTime images",
        })
        .sort({ createdAt: -1 });

    return bids;
};

module.exports = {
    placeBid,getBidHistory,getMyBids,
};