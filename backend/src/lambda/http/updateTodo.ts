import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger("updateTodo")
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      try {
          const user = getUserId(event);
          await updateTodo(updatedTodo,todoId,user);
          logger.info("Update todo success");
          return {
              statusCode: 201,
              body: JSON.stringify({
                  "item": "Todo updated!"
              })
          }
      } catch (error) {
          logger.error("Cannot update todo: ", { error: error.message })
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
