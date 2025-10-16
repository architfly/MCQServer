 
import { RequestHandler } from "express";
import User from "../../Modal/User";
import Test from "../../Modal/Test";
import Course from "../../Modal/Course";
import redisClient from "../../Config/RedisConnet";


export const TotalUserCount: RequestHandler = async (req, res) => {
  try {

    const redisKey="analytics:total_user_count";

    const cachedTest= await redisClient.get(redisKey)
    if(cachedTest){
      return res.status(200).json({
        success:false,
        message:"User count",
        counts:JSON.parse(cachedTest)
      })
    }

    // Group users by role
    const result = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
  

    // Convert aggregation result to key:value
    const counts: Record<string, number> = {};
    result.forEach((r) => {
      counts[r._id] = r.count;
    });

    await redisClient.set(redisKey,JSON.stringify(counts),{EX:5000})

    return res.status(200).json({
      success: true,
      message: "User counts fetched successfully",
      counts,
    });
  } catch (error) {
    console.error("Error in TotalUserCount:", error);
    return res.status(500).json({
      success: false,
      message: "There was a problem fetching user counts",
    });
  }
};



export const TotalTestAttempt: RequestHandler = async (req, res) => {
  try {

    const redisKey="analytics:total_test_Attempt";

    const cachedData=await redisClient.get(redisKey);
    if(cachedData){
      return res.status(200).json({
        success:false,
        message:"TotalTest attempts fetched from cache",
        ...JSON.parse(cachedData),
      })
    }

    const TotalTest = await Test.find({}, '_id testName users');

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

    const responseData={
      totalAttempts:attemptesTest,
      data:result
    }

    await redisClient.set(redisKey,JSON.stringify(responseData),{EX:500})

    return res.status(200).json({
      success: true,
      message: "Total test fetch successfully",
        ...responseData,
    });

  } catch (error) {
    console.log("this is the error ", error);
    return res.status(500).json({
      success: false,
      message: "error in the TotalTestAttempt"
    });
  }
};