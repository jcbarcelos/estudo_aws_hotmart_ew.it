"use strict";
const { get } = require("axios");
module.exports = class Handler {
  constructor({ rekoSvc, translatorSvc }) {
    (this.translatorSvc = translatorSvc), (this.rekoSvc = rekoSvc);
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "base64");
    return buffer;
  }

  async dectctImageLabels(buffer) {
    const result = await this.rekoSvc
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    const workingItems = await result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    );

    const namesImg = workingItems.map(({ Name }) => Name).join(" and ");
    return { namesImg, workingItems };
  }

  async translatorText(text) {
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "pt",
      Text: text,
    };
    const { TranslatedText } = await this.translatorSvc
      .translateText(params)
      .promise();
    return TranslatedText.split(" e ");
  }

  async formatTextResults(texts, workingItems) {
    const finalText = [];
    for (const indexText in texts) {
      const nameInPortuguese = texts[indexText];
      const confidence = workingItems[indexText].Confidence;
      finalText.push(
        `${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`
      );
    }
    return finalText.join("\n");
  }
  async main(event) {
    try {
      const { imageUrl } = event.queryStringParameters;
      if (!imageUrl) {
        return {
          statusCode: 400,
          body: "an IMG is required",
        };
      }

      const buffer = await this.getImageBuffer(imageUrl);
      const { namesImg, workingItems } = await this.dectctImageLabels(buffer);
      const texts = await this.translatorText(namesImg);
      const finalText = await this.formatTextResults(texts, workingItems);
      return {
        statusCode: 200,
        body: `A imagem tem\n`.concat(finalText),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Internal server error",
      };
    }
  }
};
