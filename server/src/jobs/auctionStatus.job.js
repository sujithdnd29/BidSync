const cron = require("node-cron");
const Auction = require("../models/Auction");
const { AUCTION_STATUS } = require("../constants/auctionConstants");
const startAuctionStatusJob = () => {

    cron.schedule("* * * * *", async () => {

        const now = new Date();

        // UPCOMING -> ACTIVE
        await Auction.updateMany(
            {
                status: AUCTION_STATUS.UPCOMING,
                startTime: { $lte: now },
                endTime: { $gt: now },
            },
            {
                $set: {
                    status: AUCTION_STATUS.ACTIVE,
                },
            }
        );

        // ACTIVE -> ENDED
        await Auction.updateMany(
            {
                status: AUCTION_STATUS.ACTIVE,
                endTime: { $lte: now },
            },
            {
                $set: {
                    status: AUCTION_STATUS.ENDED,
                },
            }
        );

        console.log("Auction status updated");

    });

};

module.exports = startAuctionStatusJob;