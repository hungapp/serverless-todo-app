import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { createTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const logger = createLogger('create-todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Creating a todo')
    const userId = getUserId(event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const item = await createTodo(userId, newTodo)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
