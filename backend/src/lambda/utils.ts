import { APIGatewayProxyEvent } from 'aws-lambda'
import { parseUserId } from '../auth/utils'

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function parseLimitParam(event): number {
  const limitStr = getQueryParameter(event, 'limit')
  let limit
  if (!limitStr) {
    limit = 20
  } else {
    limit = parseInt(limitStr, 10)
  }
  if (limit < 0) throw new Error('Limit should be positive')
  return limit
}

export function parseNextKeyParam(event): object {
  const nextKeyStr = getQueryParameter(event, 'nextKey')
  if (!nextKeyStr) return undefined
  const uriDecoded = decodeURIComponent(nextKeyStr)
  return JSON.parse(uriDecoded)
}

function getQueryParameter(event, name): string {
  const queryParams = event.queryStringParameters
  if (!queryParams) {
    return undefined
  }
  return queryParams[name]
}

export function encodeNextKey(lastEvaluatedKey: object): string {
  if (!lastEvaluatedKey) {
    return null
  }
  return encodeURIComponent(JSON.stringify(lastEvaluatedKey))
}
