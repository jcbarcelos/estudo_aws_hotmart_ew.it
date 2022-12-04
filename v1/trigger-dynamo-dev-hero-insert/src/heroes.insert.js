"use strict";
const { v4: uuidv4 } = require('uuid');
class Handler {
  constructor({ dynamoDbSvc }) {
    this.dynamoDbSvc = dynamoDbSvc
    this.dynamodbTable = process.env.DYNAMODB_TABLE
  }
  async insertItem(params) {
    return this.dynamoDbSvc.put(params).promise()
  }
  prepareData(data) {
    const params = {
      TableName: this.dynamodbTable,
      Item: {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      }
    }
    return params
  }
  handleSuccess(data) {
    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    }
    return response
  }
  handleError({statusCode, error}) {
    const response = {
      statusCode: statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(error)
    }
    return response
  }
  async main(event) {
    try {
      const data = JSON.parse(event.body)
      const dbParams = this.prepareData(data)
      await this.insertItem(dbParams)

      return this.handleSuccess(dbParams.Item)
    } catch (error) {
      console.log('Deu ruim**', error)
      return this.handleError({ statusCode: 500, error })
    }
  }
}

//factory

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const handler = new Handler({
  dynamoDbSvc: dynamoDB
})
module.exports = handler.main.bind(handler)