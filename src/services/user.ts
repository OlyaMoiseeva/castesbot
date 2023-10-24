import { Message } from 'node-telegram-bot-api'

import { Character } from './character'
import { FirebaseStorage } from '../utils/firebase'

export type User = {
  id: number
  name: string
  surname?: string
  isBot: boolean
  userName?: string
  languageCode?: string
  chatId: number
  character?: Character
}

export class UserService {
  private readonly store: FirebaseStorage

  constructor(collection: string = 'users') {
    this.store = new FirebaseStorage(collection)
  }

  async initUser(chatId: number, messageFrom: Message['from']): Promise<User> {
    const { store } = this
    const userId = messageFrom.id
    const user = await store.getDocument<User>(userId)

    if (!user) {
      const data = {
        chatId,
        id: userId,
        name: messageFrom.first_name,
        surname: messageFrom.last_name,
        userName: messageFrom.username,
        isBot: messageFrom.is_bot,
        languageCode: messageFrom.language_code,
      }

      return store.addDocument<User>(userId, data)
    }

    return user
  }

  async updateUser(id: number, data: Partial<User> | Record<string, string | number>): Promise<void> {
    const { store } = this

    await store.updateDocument<User>(id, data)
  }

  async getUser(id: number): Promise<User | null> {
    return this.store.getDocument<User>(id)
  }
}
