const ActivityLog = require("../models/ActivityLogModel");

// CREATE LOG
const createLog = async (req, res) => {
    const log = await ActivityLog.create(req.body);
    res.json(log);
};

// GET LOGS
const getLogs = async (req, res) => {
    const logs = await ActivityLog.find().sort({ createdAt: -1 });
    res.json(logs);
};

module.exports = {
    createLog,
    getLogs
};