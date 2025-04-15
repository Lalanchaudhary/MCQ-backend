const LeaderBoard=require("../models/leaderBoard");

const CreateLeaderBoard= async (req, res) => {
    try {
        const { testName, users, score } = req.body;

        // Simple validation
        if (!testName) {
            return res.status(400).json({ error: "Test name is required" });
        }

        const newEntry = new LeaderBoard({
            testName,
            users,
            score,
        });

        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        console.error("Error creating leaderboard entry:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports ={CreateLeaderBoard}