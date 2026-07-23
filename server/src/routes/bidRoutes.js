const express = require("express");
const router = express.Router();

const bidController = require("../controllers/bidController");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/my-bids",authMiddleware,bidController.getMyBids);

router.get("/:auctionId",bidController.getBidHistory);

router.post("/:auctionId",authMiddleware,bidController.placeBid);

module.exports = router;