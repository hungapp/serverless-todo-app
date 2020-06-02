import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken'
import * as jwksClient from 'jwks-rsa'

import { createLogger } from '../../utils/logger'

import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')
const jwksUrl = process.env.JSON_WEB_KEY_SET

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)

  try {
    const jwtToken: JwtPayload = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  const { kid } = jwt.header
  const signingKey = await getKey(jwksUrl, kid)

  return verify(token, signingKey, { algorithms: ['RS256'] }) as JwtPayload
}

export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

async function getKey(jwksUri, kid) {
  try {
    const key = (await getSigningKeyAsync(
      jwksUri,
      kid
    )) as jwksClient.SigningKey
    const signingKey = key.getPublicKey()
    return signingKey
  } catch (e) {
    throw new Error('Failed getting JWKS signing Key')
  }
}

function getSigningKeyAsync(jwksUri, kid) {
  const client = jwksClient({
    jwksUri
  })
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err !== null) reject(err)
      else resolve(key)
    })
  })
}
