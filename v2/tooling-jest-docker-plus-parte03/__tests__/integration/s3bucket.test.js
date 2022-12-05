const {
  describe,
  test,
  it,
  expect,
  beforeAll,
  afterAll,
} = require("@jest/globals");
const { main } = require("../../src");
const { S3 } = require("../../src/factory");

describe("Testing AWS Servicess offline with LocalStack", () => {
  const bucketConfig = {
    Bucket: "test",
  };

  beforeAll(async () => {
    S3.createBucket(bucketConfig).promise();
  });

  afterAll(async () => {
    S3.deleteBucket(bucketConfig).promise();
  });

  it("it should return an array with a S3 Bucket", async () => {
    const expected = bucketConfig.Bucket;
    const response = await main();
    const { allBuckets: {Buckets} } = JSON.parse(response.body);
    const {Name} = Buckets.find(({Name}) => Name === expected)
    expect(Name).toStrictEqual(expected);
    expect(response.statusCode).toStrictEqual(200)

  });
});
