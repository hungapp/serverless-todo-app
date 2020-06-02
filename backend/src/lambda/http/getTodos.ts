import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { getAllTodos } from '../../businessLogic/todos'

const logger = createLogger('create-todo')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', event)
  const todos: TodoItem[] = await getAllTodos()
  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }
}
