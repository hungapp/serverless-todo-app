import 'source-map-support/register'
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { getTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger('get-todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Getting todos')
    const userId = getUserId(event)
    const todos = await getTodos(userId)
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
