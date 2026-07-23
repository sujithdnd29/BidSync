const Auction = require("../models/Auction");
const mongoose = require("mongoose");
const { AUCTION_STATUS } = require("../constants/auctionConstants");

const createAuction = async (auctionData, sellerId) => {
    const {
        title, description,category,startingPrice,
        images,startTime,endTime,
    } = auctionData;

    // Business Validation
    if (new Date(startTime) >= new Date(endTime)) {
        throw new Error("Start time must be before end time.");
    }

    const auction = await Auction.create({
        title,description,category,startingPrice,
        currentPrice: startingPrice,
        images,seller: sellerId,
        startTime,endTime, status: AUCTION_STATUS.UPCOMING,
    });

    return auction;
};

const getAllAuctions = async () => {
    const auctions = await Auction.find()
        .populate("seller", "name")
        .sort({ createdAt: -1 });

    return auctions;
};

const getAuctionById = async (auctionId) => {

     if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        throw new Error("Invalid auction ID.");
    }
    const auction = await Auction.findById(auctionId)
        .populate("seller", "name avatar")
        .populate("highestBidder", "name");

    if (!auction) {
        throw new Error("Auction not found.");
    }

    return auction;
};

const updateAuction = async (auctionId, sellerId, updateData) => {

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        throw new Error("Invalid auction ID.");
    }

    const auction = await Auction.findById(auctionId);

    if (!auction) {
        throw new Error("Auction not found.");
    }

    // Authorization
    if (auction.seller.toString() !== sellerId.toString()) {
        throw new Error("You are not authorized to update this auction.");
    }

    // Business Rule
    if (auction.status !== AUCTION_STATUS.UPCOMING) {
        throw new Error("Only upcoming auctions can be updated.");
    }

    const {
        title,
        description,
        category,
        images,
        startTime,
        endTime,
    } = updateData;

    // Validate dates
    const newStartTime = startTime || auction.startTime;
    const newEndTime = endTime || auction.endTime;

    if (new Date(newStartTime) >= new Date(newEndTime)) {
        throw new Error("Start time must be before end time.");
    }

    // Update only allowed fields
    if (title !== undefined) auction.title = title;
    if (description !== undefined) auction.description = description;
    if (category !== undefined) auction.category = category;
    if (images !== undefined) auction.images = images;
    if (startTime !== undefined) auction.startTime = startTime;
    if (endTime !== undefined) auction.endTime = endTime;

    await auction.save();

    return auction;
};

const deleteAuction = async (auctionId, sellerId) => {

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        throw new Error("Invalid auction ID.");
    }

    const auction = await Auction.findById(auctionId);

    if (!auction) {
        throw new Error("Auction not found.");
    }

    if (auction.seller.toString() !== sellerId.toString()) {
        throw new Error("You are not authorized to delete this auction.");
    }

    if (auction.status !== AUCTION_STATUS.UPCOMING) {
        throw new Error("Only upcoming auctions can be deleted.");
    }

    await auction.deleteOne();

    return;
};

module.exports = {createAuction,getAllAuctions,getAuctionById,updateAuction,deleteAuction,};