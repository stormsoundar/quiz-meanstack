const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let SubmittedTestSchema = new Schema({
  _id: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  answered: { type: Number, required: true },
  rightAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  choosedAnswers: { type: Array, required: true },
  testSubmitted: { type: Boolean, required: true }
});

module.exports = mongoose.model("quizzes", SubmittedTestSchema);
