import 'source-map-support/register'

import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { getTodos } from '../../businessLogic/todos'
import { getToken } from '../auth/auth0Authorizer'
import { parseUserId } from '../../auth/utils'

const logger = createLogger('get-todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Getting todos for', event)

    const authHeader = event.headers.Authorization
    const jwtToken = getToken(authHeader)
    const userId = parseUserId(jwtToken)

    const todos: TodoItem[] = await getTodos(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
