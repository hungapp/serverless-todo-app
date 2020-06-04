import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Updating todo')
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    await updateTodo(userId, todoId, updatedTodo)
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
