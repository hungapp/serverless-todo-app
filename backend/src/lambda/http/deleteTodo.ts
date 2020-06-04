import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Deleting todo')
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    await deleteTodo(userId, todoId)
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
