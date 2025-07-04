const eventModel = require("../Models/eventModel");
const decodeJwt = require("../Utility/jwtVerify");


exports.addEvent = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(409).json({ status: false, message: "Please send token" });
    }

    const user = await decodeJwt(token);
    if (!user) {
      return res.status(400).json({ status: false, error: "Unauthorised token" });
    }

    const { title, about, description, date, location, attendees } = req.body;

    const image = req.file
      ? {
          mimeType: req.file.mimetype,
          imageURL: req.file.path,
          originalName: req.file.originalname,
          size: req.file.size,
        }
      : null;

    const newEvent = new eventModel({
      title,
      about,
      description,
      date,
      location,
      createdBy: user._id,
      attendees,
      image, 
    });

    await newEvent.save();

    res.status(201).json({
      status: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error adding event:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error",
    });
  }
};

// exports.allEvents = async (req, res) => {
//   try {
//     const token = req?.headers?.authorization?.split(" ")[1];
//     if (!token) return res.status(409).json({ status: false, message: "Please send token" });
//     const user = await decodeJwt(token);
//     if (!user) return res.status(400).json({ status: false, error: "Unauthorised token" });
//     const events = await eventModel.find();
//     if (events?.length === 0) return res.status(404).json({ status: false, error: "data not found" });
//     return res.status(200).json({ status: true, events });
//   } catch (error) {
//     console.error("error", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// GET /event
exports.allEvents = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ status: false, message: "Please send token" });

    const user = await decodeJwt(token);
    if (!user) return res.status(401).json({ status: false, message: "Invalid token" });

    const { search = "", date = "", page = 1, limit = 5 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (date) {
      const selectedDate = new Date(date);
      const start = new Date(selectedDate.setHours(0, 0, 0, 0));
      const end = new Date(selectedDate.setHours(23, 59, 59, 999));
      query.date = { $gte: start, $lte: end };
    }

    const skip = (page - 1) * limit;
    const totalEvents = await eventModel.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / limit);

    const events = await eventModel
      .find(query)
      .populate("createdBy", "name email")
      .populate("attendees", "name email")
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      status: true,
      events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages,
        totalEvents,
      },
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




exports.eventById = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ status: false, message: "Please send token" });

    const user = await decodeJwt(token);
    if (!user) return res.status(400).json({ status: false, error: "Unauthorised token" });
    const eventId = req.params.id;
    // const event = await eventModel.findById({ _id: eventId });

    const event = await eventModel
      .findById(eventId)
      .populate("createdBy", "name email") // populate only selected fields from user
      .populate("attendees", "name email");

    if (event?.length === 0) return res.status(404).json({ status: false, error: "data not found" });
    return res.status(200).json({ status: true, event });
  } catch (error) {
    console.error("error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.registerForEvent = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) return res.status(409).json({ status: false, message: "Please send token" });

    const user = await decodeJwt(token);
    if (!user) return res.status(400).json({ status: false, error: "Unauthorised token" });
    console.log({ user });

    const eventId = req.params.id;
    const event = await eventModel.findById({ _id: eventId });
    if (event?.length === 0) return res.status(404).json({ status: false, error: "data not found" });
    if (event?.attendees?.includes(user?._id)) return res.status(200).json({ status: true, message: "Already registered for this event" });
    event?.attendees?.push(user?._id);
    await event.save();
    return res.status(201).json({ status: true, message: "Registration successfull" });
  } catch (error) {
    console.error("error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// exports.registerForEvent = async (req, res) => {
//   try {
//     const token = req?.headers?.authorization?.split(" ")[1];
//     if (!token) return res.status(409).json({ status: false, message: "Please send token" });

//     const user = decodeJwt(token);
//     if (!user) return res.status(400).json({ status: false, error: "Unauthorised token" });

//     const eventId = req.params.id;

//     const updatedEvent = await eventModel.findByIdAndUpdate(
//       eventId,
//       { $addToSet: { attendees: user._id } }, // ensures no duplicates
//       { new: true }
//     );

//     if (!updatedEvent)
//       return res.status(404).json({ status: false, error: "Event not found" });

//     const isAlreadyRegistered = updatedEvent.attendees.includes(user._id);

//     return res.status(200).json({
//       status: true,
//       message: isAlreadyRegistered
//         ? "Already registered for this event"
//         : "Registration successful",
//     });

//   } catch (error) {
//     console.error("Register Error:", error);
//     return res.status(500).json({ status: false, error: "Internal server error" });
//   }
// };
