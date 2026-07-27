const Auction = require("../models/Auction");
const mongoose = require("mongoose");
const { AUCTION_STATUS } = require("../constants/auctionConstants");
const fs = require("fs-extra");
const cloudinary = require("../config/cloudinary");
const Bid = require("../models/Bid");

const createAuction = async (auctionData, sellerId,files) => {
    

    const {
        title,
        description,
        category,
        startingPrice,
        startTime,
        endTime,
    } = auctionData;

    // Business Validation
    if (new Date(startTime) >= new Date(endTime)) {
        throw new Error("Start time must be before end time.");
    }

    const now = new Date();

    let status;

    if (now < new Date(startTime)) {

        status = AUCTION_STATUS.UPCOMING;

    } else if (now < new Date(endTime)) {

        status = AUCTION_STATUS.ACTIVE;

    } else {

        status = AUCTION_STATUS.ENDED;

    }
const uploadedImages = [];

if (files && files.length > 0) {

    for (const file of files) {

        const result = await cloudinary.uploader.upload(file.path, {
            folder: "BidSync/Auctions",
        });

        uploadedImages.push({
            public_id: result.public_id,
            url: result.secure_url,
        });

        await fs.remove(file.path);
    }
}

    const auction = await Auction.create({
        title,
        description,
        category,
        startingPrice,
        currentPrice: startingPrice,
        images: uploadedImages,
        seller: sellerId,
        startTime,
        endTime,
        status,
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

    const bidExists = await Bid.exists({ auction: auctionId });

    if (bidExists) {
        throw new Error(
            "Auction cannot be deleted because bids have already been placed."
        );
    }

  if (auction.images?.length) {
    for (const image of auction.images) {
        await cloudinary.uploader.destroy(image.public_id);
    }
}
    await auction.deleteOne();
};
module.exports = {createAuction,getAllAuctions,getAuctionById,updateAuction,deleteAuction,};