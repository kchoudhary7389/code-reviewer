const aiService = require("../services/ai.services");

module.exports.getReview = async (req, res, next) => {
  const code = req.body.code;
  console.log(code);
  if (!code) {
    return res.status(404).send("code is required");
  }
  const response = await aiService(code);
  return res.status(200).json({ response });
};
