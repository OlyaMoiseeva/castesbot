import { TelegramService } from './telegram'
import { getKeyboard } from '../utils/keyboard'
import { FirebaseStorage } from '../utils/firebase'

export type Chat = {
  id: number
  casteCode?: string
  title?: string
}

export class ChatService {
  private readonly store: FirebaseStorage
  private readonly telegram: TelegramService

  constructor(telegramBot: TelegramService, collection: string = 'chats') {
    this.store = new FirebaseStorage(collection)
    this.telegram = telegramBot
  }

  async initChat(id: number): Promise<Chat> {
    const { store } = this

    const chat = await store.getDocument<Chat>(id)

    if (!chat) {
      return store.addDocument<Chat>(id, { id })
    }

    return chat
  }

  forceSelectCaste(chatId: number): void {
    const { keyboard, title } = getKeyboard('casteSelector')

    this.telegram.sendMessage(chatId, title, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    })
  }
}
