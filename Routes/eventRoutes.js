const express = require("express");
const { eventValidation } = require("../Middleware/eventValidation");
const { addEvent, allEvents, eventById, registerForEvent } = require("../Controller/eventController");
const { cloudinaryUploader } = require("../Middleware/cloudinaryUploader");
const router = express.Router();

router.post("/",cloudinaryUploader.single("image"), eventValidation, addEvent);
router.get("/", allEvents);
router.get("/:id", eventById);
router.post("/register/:id", registerForEvent);

module.exports = router;
