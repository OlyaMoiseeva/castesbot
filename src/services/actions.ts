import TelegramBot from 'node-telegram-bot-api'

import { CharacterService } from './character'
import { TelegramService } from './telegram'
import { User, UserService } from './user'
import { getKeyboard } from '../utils/keyboard'
import { Chat } from './chat'

export class Actions {
  private readonly telegram: TelegramService
  private readonly user: UserService

  constructor(telegramService: TelegramService, user: UserService) {
    this.telegram = telegramService
    this.user = user
  }

  async getInfo(chatId: number, user: User): Promise<void> {
    const { keyboard } = getKeyboard('info')

    await this.telegram.sendPhoto(
      chatId,
      user?.character?.img,
      {
        caption: CharacterService.getInfoText(user?.character),
        reply_markup: {
          inline_keyboard: keyboard
        }
      }
    )
  }

  async getMenu(chatId: number): Promise<void> {
    const { keyboard, title } = getKeyboard('menu')

    await this.telegram.sendMessage(chatId, title, {
      reply_markup: {
        inline_keyboard: keyboard,
      }
    })
  }

  async setName(chat: Chat, user: User, name: string): Promise<void> {
    const { telegram, user: userService } = this

    await userService.updateUser(user.id, {
      'character.name': name,
    })

    await telegram.sendMessage(
      chat.id,
      `Супер, теперь твоего ${CharacterService.getCaption(chat.casteCode).acc} зовут ${name}`,
    )
  }

  async getMarket(chatId: number): Promise<void> {
    const { keyboard, title } = getKeyboard('market')

    await this.telegram.sendMessage(
      chatId,
      title,
      {
        reply_markup: {
          inline_keyboard: keyboard,
        }
      }
    )
  }

  async getCareer(chat: Chat, user: User): Promise<void> {
    const { keyboard } = getKeyboard('career')

    await this.telegram.sendPhoto(
      chat.id,
      `./img/${chat.casteCode}/work.jpeg`,
      {
        caption: CharacterService.getCareerInfoText(user.character),
        reply_markup: {
          inline_keyboard: keyboard.filter(
            (element: TelegramBot.InlineKeyboardButton) => user.character.profession.atWork
              ? element[0].callback_data !== 'career&goWork'
              : element[0].callback_data !== 'career&goHome'
          )
        }
      }
    )
  }

  async doDydysch(chat: Chat, user: User, target: User): Promise<void> {
    const { telegram, user: userService } = this
    const health = target.character.health - 10 > 0
      ? target.character.health - 10
      : 0

    await userService.updateUser(target.id, {
      'character.health': health,
    })

    const experience = user.character.experience += 1 === user.character.level * 10
      ? 0
      : user.character.experience += 1

    const level = experience
      ? user.character.level
      : user.character.level += 1

    await userService.updateUser(user.id, {
      'character.experience': experience,
      'character.level': level,
    })

    await telegram.sendMessage(chat.id, `Кажется ${target.character.name} получил по заслугам`)
  }
}
