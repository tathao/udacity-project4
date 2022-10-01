import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger("deleteTodo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      logger.info("## DELETE TODO ##");
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    try {
        const user = getUserId(event);
        await deleteTodo(todoId,user);

        return {
            statusCode: 201,
            body: JSON.stringify({
                "message": "Todo had been deleted!"
            })
        }
    }catch (error) {
        logger.error('Cannot delete todo ', { error: error.message });
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
