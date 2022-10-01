import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

import * as uuid from 'uuid'
import { DbClient } from "../utils/dbClient";
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const expire = process.env.SIGNED_URL_EXPIRATION
const dbClient = new DbClient()
export class AttachmentUtils {

    async attachmentURL(todoId: string, userId: string) {
        const imageId = uuid.v4();
        const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`;
        await dbClient.updateTodosImage(imageUrl, userId, todoId)
        return  this.uploadURL(imageId)
    }

    private uploadURL(imageId: any) {
        return s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: imageId,
            Expires: Number(expire)
        })
    }


}

