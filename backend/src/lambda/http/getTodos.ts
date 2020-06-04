import 'source-map-support/register'
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { getTodos } from '../../businessLogic/todos'
import {
  getUserId,
  parseLimitParam,
  parseNextKeyParam,
  encodeNextKey
} from '../utils'

const logger = createLogger('get-todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Getting todos')
    const userId = getUserId(event)

    const limit = parseLimitParam(event)
    const nextKey = parseNextKeyParam(event)
    const data = await getTodos(userId, limit, nextKey)
    const { items, lastEvaluatedKey } = data

    return {
      statusCode: 200,
      body: JSON.stringify({
        items,
        nextKey: encodeNextKey(lastEvaluatedKey)
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
