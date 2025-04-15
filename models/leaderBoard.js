const mongoose = require("mongoose");
const { Schema } = mongoose;

const LeaderBoardSchema = new Schema({
    testName: {
        type: String,
        required: true,
    },
    users: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
    },
    score: {
        type: Number
    }
})

const LeaderBoard = mongoose.model("LeaderBoard", LeaderBoardSchema);

module.exports = LeaderBoard;