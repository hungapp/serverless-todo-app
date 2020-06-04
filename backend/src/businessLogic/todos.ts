import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export async function getTodos(
  userId: TodoItem['userId']
): Promise<TodoItem[]> {
  return todoAccess.getTodos(userId)
}

export async function createTodo(
  userId: TodoItem['userId'],
  createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
  const todoId = uuid.v4()
  const { name, dueDate, attachmentUrl } = createTodoRequest
  return await todoAccess.createTodo({
    todoId,
    userId,
    createdAt: new Date().toISOString(),
    name,
    dueDate,
    done: false,
    attachmentUrl
  })
}

export async function updateTodo(
  userId: string,
  todoId: TodoItem['todoId'],
  updateTodoRequest: UpdateTodoRequest
): Promise<null> {
  return await todoAccess.updateTodo(userId, todoId, updateTodoRequest)
}

export async function deleteTodo(
  userId: string,
  todoId: TodoItem['todoId']
): Promise<null> {
  return await todoAccess.deleteTodo(userId, todoId)
}

export async function attachUrl(
  userId: string,
  todoId: string,
  url: string
): Promise<null> {
  return await todoAccess.attachUrl(userId, todoId, url)
}
