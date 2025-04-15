const express = require("express");
const LeaderBoardRouter = express.Router();
const {CreateLeaderBoard}=require("../controller/leaderBoardController")

LeaderBoardRouter.post("/create", CreateLeaderBoard);

module.exports = LeaderBoardRouter;
