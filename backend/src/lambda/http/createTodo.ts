import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger("createTodo");
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      // TODO: Implement creating a new TODO item
      try {
          if(newTodo.name == "" || newTodo.name == null){
              return {
                  statusCode: 400,
                  body: JSON.stringify({
                      "message": "The task could not empty"
                  })
              }
          }
          const user = getUserId(event);
          const todo = await createTodo(newTodo,user)
          return {
              statusCode: 201,
              body: JSON.stringify({
                  "item": todo
              })
          }
      } catch (error) {
          logger.error("Create todo failed", {error: error.message})
          return {
              statusCode: 500,
              body: JSON.stringify({
                  "message": "Internal server error"
              })
          }
      }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
