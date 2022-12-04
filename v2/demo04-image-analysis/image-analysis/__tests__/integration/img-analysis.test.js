const { describe, test, expect } = require("@jest/globals");
const requestMock = require("./../mocks/request.json");
const aws = require("aws-sdk");
aws.config.update({
  region: "us-east-1",
});
const { main } = require("../../src");
describe("Image analyser test suite", () => {
  test("it should analyser successfully the image returning the results", async () => {
    const finalText = [
      "100.00% de ser do tipo Cachorro",
      "100.00% de ser do tipo canino",
      "100.00% de ser do tipo cão",
      "100.00% de ser do tipo animal de estimação",
      "100.00% de ser do tipo animal",
      "100.00% de ser do tipo mamífero",
      "99.78% de ser do tipo Golden Retriever",
      "82.90% de ser do tipo grama",
      "82.90% de ser do tipo planta",
    ].join("\n");
    const expected = {
      statusCode: 200,
      body: `A imagem tem\n`.concat(finalText),
    };
    const result = await main(requestMock);
    // toStrictEqual =>  expera que seja igual, identico
    expect(result).toStrictEqual(expected);
  });
  test("given an empty queryString it should return status code 400", async () => {
    const expected = {
      statusCode: 400,
      body: "an IMG is required",
    };
    const result = await main({ queryStringParameters: {} });
    expect(result).toStrictEqual(expected);
  });
  test("given an invalid ImageUrl ir should return  status code 500", async () => {
    const expected = {
      statusCode: 500,
      body: "Internal server error",
    };
    const result = await main({
      queryStringParameters: {
        imageUrl: "test",
      },
    });
    expect(result).toStrictEqual(expected);
  });
});
