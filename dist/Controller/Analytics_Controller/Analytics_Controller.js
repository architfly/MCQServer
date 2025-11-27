"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalTestAttempt = exports.TotalUserCount = void 0;
const User_1 = __importDefault(require("../../Modal/User"));
const Test_1 = __importDefault(require("../../Modal/Test"));
const RedisConnet_1 = __importDefault(require("../../Config/RedisConnet"));
const TotalUserCount = async (req, res) => {
    try {
        const redisKey = "analytics:total_user_count";
        const cachedTest = await RedisConnet_1.default.get(redisKey);
        if (cachedTest) {
            return res.status(200).json({
                success: false,
                message: "User count",
                counts: JSON.parse(cachedTest)
            });
        }
        // Group users by role
        const result = await User_1.default.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
        ]);
        // Convert aggregation result to key:value
        const counts = {};
        result.forEach((r) => {
            counts[r._id] = r.count;
        });
        await RedisConnet_1.default.set(redisKey, JSON.stringify(counts), { EX: 5000 });
        return res.status(200).json({
            success: true,
            message: "User counts fetched successfully",
            counts,
        });
    }
    catch (error) {
        console.error("Error in TotalUserCount:", error);
        return res.status(500).json({
            success: false,
            message: "There was a problem fetching user counts",
        });
    }
};
exports.TotalUserCount = TotalUserCount;
const TotalTestAttempt = async (req, res) => {
    try {
        const redisKey = "analytics:total_test_Attempt";
        const cachedData = await RedisConnet_1.default.get(redisKey);
        if (cachedData) {
            return res.status(200).json({
                success: false,
                message: "TotalTest attempts fetched from cache",
                ...JSON.parse(cachedData),
            });
        }
        const TotalTest = await Test_1.default.find({}, '_id testName users');
        let attemptesTest = 0;
        const result = TotalTest.map(test => {
            const testedCount = test.users?.length || 0;
            attemptesTest += testedCount;
            return {
                testId: test._id,
                testName: test.testName,
                attemptedTes: testedCount
            };
        });
        const responseData = {
            totalAttempts: attemptesTest,
            data: result
        };
        await RedisConnet_1.default.set(redisKey, JSON.stringify(responseData), { EX: 500 });
        return res.status(200).json({
            success: true,
            message: "Total test fetch successfully",
            ...responseData,
        });
    }
    catch (error) {
        console.log("this is the error ", error);
        return res.status(500).json({
            success: false,
            message: "error in the TotalTestAttempt"
        });
    }
};
exports.TotalTestAttempt = TotalTestAttempt;
//# sourceMappingURL=Analytics_Controller.js.map