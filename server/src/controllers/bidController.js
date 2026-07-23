const bidService = require("../services/bidService");

const placeBid = async (req, res) => {
    try {

        const { amount } = req.body;

        const bid = await bidService.placeBid(
            req.params.auctionId,
            req.user._id,
            amount
        );

        res.status(201).json({
            success: true,
            message: "Bid placed successfully.",
            bid,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

const getBidHistory = async (req, res) => {
    try {

        const bids = await bidService.getBidHistory(
            req.params.auctionId
        );

        res.status(200).json({
            success: true,
            bids,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

const getMyBids = async (req, res) => {
    try {

        const bids = await bidService.getMyBids(
            req.user._id
        );

        res.status(200).json({
            success: true,
            bids,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    placeBid,getBidHistory,getMyBids,
};