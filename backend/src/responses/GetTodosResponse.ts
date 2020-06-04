import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

export interface GetTodosResponse {
  items: AWS.DynamoDB.DocumentClient.ItemList
  lastEvaluatedKey: DocumentClient.QueryInput['ExclusiveStartKey']
}
