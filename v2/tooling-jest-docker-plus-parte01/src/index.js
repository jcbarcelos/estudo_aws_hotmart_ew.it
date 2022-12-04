"use strict";

const { S3 } = require("./factory");


module.exports.hello = async (event) => {
  const allBuckets = await S3.listBuckets().promise()
  console.log('found ', allBuckets)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};
