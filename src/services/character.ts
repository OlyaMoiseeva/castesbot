import { Chat } from './chat'
import { TelegramService } from './telegram'
import { UserService, User } from './user'

import { getRandomInt } from '../utils/random'

export type Character = {
  name: string
  health: number
  level: number
  experience: number
  money: number
  img: string
  profession: {
    name: string
    level: number
    salary: number
    atWork: boolean
    until: Date
  }
  inventory: Property[]
}

export enum PropertyEnum {
  FOOD = 'FOOD'
}

export type Property = {
  code: string
  title: string
  type: PropertyEnum
  price: number
}

export type Caption = {
  nom: string
  acc: string
}

export type Captions = Record<string, Caption>

export class CharacterService {
  private readonly telegram: TelegramService
  private readonly user: UserService

  static getCaption = (code: string): Captions => {
    const captions = {
      hryu: {
        nom: 'хрюк',
        acc: 'хрюга',
      },
      pi: {
        nom: 'мышач',
        acc: 'мышача',
      },
      wouf: {
        nom: 'вуфчик',
        acc: 'вуфела',
      },
      myak: {
        nom: 'мяк',
        acc: 'мяка',
      }
    }

    return captions[code]
  }

  static getInfoText(character: Character): string {
    return `Имя: ${character.name}
📈 Уровень: ${character.level}
🗡 Опыт:${character.experience}/${character.level * 10}
❤️‍🔥 Здоровье: ${character.health}
👨‍💼 Профессия: ${character.profession.name}
💰 Звериные баллы: ${character.money}`
  }

  static getCareerInfoText(character: Character): string {
    return `
👨‍💼 Профессия: ${character.profession.name}
📈 Уровень: ${character.profession.level}
💲 Зп: ${character.profession.salary} звериных баллов
💰 Звериные баллы: ${character.money}`
  }

  constructor(telegramService: TelegramService, userService: UserService) {
    this.telegram = telegramService
    this.user = userService
  }

  async createCharacter(user: User, chat: Chat): Promise<Character> {
    const { telegram, user: userService } = this
    const img = `../../img/${chat.casteCode}/${getRandomInt(1, 19)}.jpeg`
    const caption = CharacterService.getCaption(chat.casteCode).nom
    const character: Character = {
      health: 100,
      level: 0,
      img,
      money: 0,
      experience: 0,
      name: `Какой-то ${caption}`,
      profession: {
        name: `Беззаботный ${caption}`,
        level: 0,
        salary: 0,
        atWork: false,
        until: null,
      },
      inventory: [],
    }

    await userService.updateUser(user.id, { character })

    telegram.sendPhoto(chat.id, img, {
      caption: `Лови своего ${CharacterService.getCaption(chat.casteCode).acc} \nДай ему имя при помощи команды: \nимя <имя твоего ${CharacterService.getCaption(chat.casteCode).acc}>`,
      reply_markup: {
        inline_keyboard: [[{
          text: 'Инфо',
          callback_data: 'info',
        }]]
      }
    })

    user.character = character

    return character
  }
}
