import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

  async getTodos(userId: TodoItem['userId']): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
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
    todoId: TodoItem['todoId'],
    data: UpdateTodoRequest
  ): Promise<null> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId
        },
        UpdateExpression: 'set $n = :n, dueDate = :dd, done = :d ',
        ExpressionAttributeNames: {
          $n: 'name'
        },
        ExpressionAttributeValues: {
          $n: data.name,
          ':dd': data.dueDate,
          ':d': data.done
        }
      })
      .promise()
    return null
  }

  async deleteTodo(todoId: TodoItem['todoId']): Promise<null> {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId
        }
      })
      .promise()
    return null
  }
}
