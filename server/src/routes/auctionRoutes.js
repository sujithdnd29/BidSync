const express = require("express");
const router = express.Router();

const auctionController = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, auctionController.createAuction);
router.get("/", auctionController.getAllAuctions);
router.get("/:id", auctionController.getAuctionById);
router.put("/:id", authMiddleware, auctionController.updateAuction);
router.delete("/:id", authMiddleware, auctionController.deleteAuction);

module.exports = router;