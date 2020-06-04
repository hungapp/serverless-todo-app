import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businessLogic/todos'

const logger = createLogger('update todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Updating todo')
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    await updateTodo(todoId, updatedTodo)
    return {
      statusCode: 200,
      body: 'Todo updated'
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
