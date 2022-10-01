import * as AWSXRay from 'aws-xray-sdk'
import * as AWS from 'aws-sdk'
import {DocumentClient} from "aws-sdk/clients/dynamodb";
const XAWS = AWSXRay.captureAWS(AWS)

export class DbClient{

    constructor(private readonly docClient: DocumentClient = DbClient.createDynamoDBClient(),
                private readonly toDoTable = process.env.TODOS_TABLE) {
    }

    static createDynamoDBClient() {
        if (process.env.IS_OFFLINE) {
            console.log('Creating a local DynamoDB instance')
            return new XAWS.DynamoDB.DocumentClient({
                region: 'localhost',
                endpoint: 'http://localhost:8000'
            })
        }

        return new XAWS.DynamoDB.DocumentClient()
    }

    async updateTodosImage(imageUrl: String, userId: String, todoIds: String) {
        const params = {
            TableName: this.toDoTable,
            Key: {
                userId: userId,
                todoId: todoIds
            },
            UpdateExpression: 'set attachmentUrl = :r',
            ExpressionAttributeValues: {
                ':r': imageUrl,
            }
        }
        return await this.docClient.update(params).promise();
    }
}

