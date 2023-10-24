import { addHours } from 'date-fns'
import TelegramBot, { Message } from 'node-telegram-bot-api'

import 'dotenv/config'

import { Actions } from './services/actions'
import { CharacterService } from './services/character'
import { ChatService } from './services/chat'
import { TelegramService } from './services/telegram'
import { UserService } from './services/user'

const telegramService = new TelegramService(process.env.TG_BOT_TOKEN, process.env.NODE_ENV)
const chatService = new ChatService(telegramService)
const userService = new UserService()
const characterService = new CharacterService(telegramService, userService)
const actions = new Actions(telegramService, userService)

telegramService.bot.on('polling_error', (error: Error) => console.log(error))

telegramService.bot.on('message', async (message: Message) => {
  const chatId = message.chat.id

  // @TODO не создавать чат если юзер не хочет играть
  const chat = await chatService.initChat(chatId)
  const user = await userService.initUser(chatId, message.from)

  // предлагаем выбрать касту
  if (!chat.casteCode) {
    chatService.forceSelectCaste(chatId)
    return
  }

  // создаем персонажа
  if (!user.character) {
    await characterService.createCharacter(user, chat)
    return
  }

  const command = message?.text?.toLocaleLowerCase()

  if (command === 'инфо') {
    return actions.getInfo(chatId, user)
  }

  if (command === 'меню') {
    return actions.getMenu(chatId)
  }

  if (command.includes('имя') && user.character.name === `Какой-то ${CharacterService.getCaption(chat.casteCode).nom}`) {
    const name = message.text.split('имя ')[1]

    if (name) {
      await actions.setName(chat, user, name)
    }

    return
  }

  if (command === 'на рынок') {
    return actions.getMarket(chatId)
  }

  if (command === 'карьера') {
    return actions.getCareer(chat, user)
  }


  if (message.reply_to_message && message.reply_to_message.from) {
    const userReplyTo = await userService.getUser(message.reply_to_message.from.id)

    if (!userReplyTo.character) {
      return telegramService.sendMessage(chatId, `У ${message.reply_to_message.from.first_name} еще нет зверюги`)
    }

    if (command === 'дыдыщ') {
      return actions.doDydysch(chat, user, userReplyTo)
    }
  }
})

telegramService.bot.on('callback_query', async (query: TelegramBot.CallbackQuery) => {
  const chatId = query?.message?.chat.id
  const userId = query?.from?.id

  const chat = await getChat(chatId)

  if (query.data) {
    const dataArr = query.data?.split('&')
    const type = dataArr[0]
    const data = dataArr[1]
    const user = await getUser(userId)
    console.log('type:', type, data)

    if (type === 'casteSelector' && chatId) {
      const button = keyboards.casteSelector.keyboard.find((element: { callback_data: any }[]) => element[0].callback_data === query.data)

      if (button && !chat?.casteCode) {

        await updateChat(chatId, {
          title: button[0].text,
          casteCode: data,
        })

        bot.sendMessage(
          chatId,
          `Ура, теперь тут живут ${button[0].text}!! Напиши что угодно и тебе прилетит ${getCaption(data).nom}`,
        )
      } else {
        bot.sendMessage(chatId, 'Каста уже выбрана(')
      }
    }

    if (!user?.character || !chat) {
      return
    }

    if (user?.character?.img) {
      if (type === 'info') {
        const { keyboard } = getKeyboard('info')

        bot.sendPhoto(
          chatId,
          user?.character?.img,
          {
            caption: getInfoText(user.character),
            reply_markup: {
              inline_keyboard: keyboard,
            }
          }
        )
      }
    }

    if (type === 'menu') {
      if (data === 'career') {
        let { keyboard } = getKeyboard('career')
        keyboard = keyboard.filter(element => user.character.profession.atWork ? element[0].callback_data !== 'career&goWork' : element[0].callback_data !== 'career&goHome')

        bot.sendPhoto(
          chatId,
          `./img/${chat.casteCode}/work.jpeg`,
          {
            caption: getCareerInfoText(user.character),
            reply_markup: {
              inline_keyboard: keyboard
            }
          }
        )

        return
      }

      // если нет data - то само menu (type = menu)
      const { keyboard, title } = getKeyboard(data || type)

      bot.sendMessage(chatId, title, {
        reply_markup: {
          inline_keyboard: keyboard,
        }
      })
    }

    if (type === 'goWork') { // ?
      await updateUser(userId, {
        'character.profession': {
          ...user.character.profession,
          atWork: true,
          untill: addHours(new Date(), 3)
        }
      })

      bot.sendMessage(chatId, 'вернуться можно через 3 часа!')
    }

    if (type === 'career') {
      if (data === 'goWork') {
        const { keyboard, title } = getKeyboard('goWork')

        bot.sendMessage(chatId, title, {
          reply_markup: {
            inline_keyboard: keyboard,
          }
        })
      }

      if (data === 'goHome') {
        await updateUser(userId, {
          'character.money': user.character.money += user.character.profession.salary,
          'character.profession': {
            ...user.character.profession,
            atWork: false,
          }
        })

        bot.sendMessage(chatId, `Вы заработали ${user.character.profession.salary} звериных баллов`)
      }
    }

    if (type === 'inventory') {
      bot.sendMessage(chatId, '🤡')
    }

    if (type === 'work') {
      // выбор работы
      if (chat?.casteCode) {
        let message
        if (user?.character?.profession?.name !== `Беззаботный ${getCaption(chat.casteCode).nom}`) {
          message = 'У тебя уже есть работа'
        } else {
          const name = keyboards[type].keyboard.find((el: any) => el[0].callback_data === query.data)[0].text
          await updateUser(userId, {
            'character.profession': {
              name,
              salary: getRandomInt(50, 100),
              level: 0,
            }
          })

          message = 'Хрюююююю! Поздравляю с новой профессией! Узнать как дела на работе теперь можно в меню по кнопке "Карьера"'
        }

        bot.sendMessage(chatId, message)
      }
    }

    if (type === 'products' && chatId) {
      const { price, text, callback_data } = Object.values(products).find(({ callback_data }) => callback_data === query.data)
      if (price > user.character.money) {
        bot.sendMessage(chatId, 'Недостаточно звериных балов(')
      } else {
        bot.sendMessage(chatId, `Вы приобрели ${text}!`)

        const inventory = user.character?.inventory || []

        inventory.push({
          code: callback_data,
          title: text,
          price,
          type: PropertyEnum.EAT
        })

        await updateUser(userId, {
          'character.inventory': inventory
        })
      }
    }
  }

})
