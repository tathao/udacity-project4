import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

// TODO: Implement businessLogic
export const getTodosForUser = async (userId: String): Promise<TodoItem[]> => {
    return todosAccess.getTodosForUser(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {

    const todoId = uuid.v4()

    return await todosAccess.createTodosForUser({
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: ""
    })
}

export async function deleteTodo(todoId: string, userId: string) {
    // TODO: Implement validate todoItem exist in DB
    return await todosAccess.deleteTodosForUser(todoId, userId)
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string) {
    return await todosAccess.updateTodosForUser(updateTodoRequest, userId, todoId)
}

export async function attachmentURL(todoId: string, userId: string) {
    return await attachmentUtils.attachmentURL(todoId, userId)
}
