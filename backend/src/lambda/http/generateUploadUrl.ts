import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { attachUrl } from '../../businessLogic/todos'

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10)

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})
const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Generating upload url')
    const todoId = event.pathParameters.todoId
    try {
      const uploadUrl = getUploadUrl(todoId)
      const userId = getUserId(event)
      const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
      await attachUrl(userId, todoId, imageUrl)
      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}
