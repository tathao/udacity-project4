import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { attachmentURL } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger("generateUploadUrl");
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    try {
        const user = getUserId(event);
        const url = await attachmentURL(todoId, user);
        logger.info("The URL has been generate: ", url);
        return {
            statusCode: 201,
            body: JSON.stringify({
                uploadUrl: url
            })
        }
    } catch (error) {
        logger.error('Generate URL failed', { error: error.message })
        return {
            statusCode: 500,
            body: JSON.stringify({
                "message": "Internal server error"
            })
        }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
