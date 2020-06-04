import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    await deleteTodo(todoId)
    return {
      statusCode: 200,
      body: 'Todo deleted'
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
