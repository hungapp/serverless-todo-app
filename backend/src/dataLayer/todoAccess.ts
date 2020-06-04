import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { GetTodosResponse } from '../responses/GetTodosResponse'

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

  async getTodos(
    userId: TodoItem['userId'],
    limit: number,
    nextKey: object
  ): Promise<GetTodosResponse> {
    const queryParams = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      Limit: limit,
      ExclusiveStartKey: nextKey
    }
    const result = await this.docClient.query(queryParams).promise()

    const response = {
      items: result.Items,
      lastEvaluatedKey: result.LastEvaluatedKey
    }
    return response
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise()
    return todo
  }

  async updateTodo(
    userId: string,
    todoId: TodoItem['todoId'],
    data: UpdateTodoRequest
  ): Promise<null> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'SET #n = :n, dueDate = :dd, done = :d ',
        ExpressionAttributeNames: {
          '#n': 'name'
        },
        ExpressionAttributeValues: {
          ':n': data.name,
          ':dd': data.dueDate,
          ':d': data.done
        }
      })
      .promise()
    return null
  }

  async deleteTodo(userId: string, todoId: TodoItem['todoId']): Promise<null> {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      })
      .promise()
    return null
  }

  async attachUrl(
    userId: string,
    todoId: string,
    attachmentUrl: string
  ): Promise<null> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'set attachmentUrl = :url',
        ExpressionAttributeValues: { ':url': attachmentUrl }
      })
      .promise()
    return null
  }
}
