const joi = require("joi");

const eventValidation = (req, res, next) => {
   if (req.body.date) {
    try {
      req.body.date = new Date(req.body.date);
    } catch (e) {
      return res.status(400).json({ message: "Invalid date format" });
    }
  }
  const schema = joi.object({
    title: joi.string().min(2).required(),
    about: joi.string().required(),
    description: joi.string().required(),
    date: joi.date().required(),
    location: joi.string().min(2).required(),
  }).unknown(true)
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad request joi", error });
  }
  next();
}

module.exports = { eventValidation };
