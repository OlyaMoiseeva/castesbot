import 'dotenv/config'
import { ok } from 'assert'
import { addHours } from 'date-fns'

const TelegramBot = require('node-telegram-bot-api')

import type { Message } from 'node-telegram-bot-api'

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { serviceAccount } from './castesbot-c23cbfe35f53'
import { serviceAccountDev } from './castesbotdev-439e03917c43'

const isProduction = process.env.NODE_ENV === 'production'
let options: Record<string, any> = { polling: true }
let token: string | undefined = '5744809047:AAE6-yZ8vs-Nfep-bEYaGBMqoIGtPn0wum8'

let firebaseServiceAccount = serviceAccountDev

if (isProduction) {
  options = {
    webHook: {
      port: process.env.PORT
    }
  }
  token = process.env.TOKEN

  firebaseServiceAccount = serviceAccount
}

const bot = new TelegramBot(token, options)

initializeApp({
  credential: cert(firebaseServiceAccount as any)
})

const db = getFirestore()

if (isProduction) {
  const url = process.env.APP_URL || 'https://bbaj9l05mcpj3shu1nd4.containers.yandexcloud.net'
  bot.setWebHook(`${url}/bot${token}`)
}

import { Chat, User, Character, PropertyEnum } from "./types"

const products: Record<number, any> = {
  1: {
    text: 'Котлеты из мышей',
    callback_data: 'products&fromPi',
    price: 1,
  },
  2: {
    text: 'Котлеты из лягушек',
    callback_data: 'products&fromKva',
    price: 1,
  },
  3: {
    text: 'Котлеты из мяков',
    callback_data: 'products&fromMyak',
    price: 1,
  },
  4: {
    text: 'Котлеты из вуфелов',
    callback_data: 'products&fromWouf',
    price: 1,
  },
  5: {
    text: 'Какие-то таблетки',
    callback_data: 'products&unknownPills',
    price: 1,
  },
  6: {
    text: 'Какое-то зелье',
    callback_data: 'products&unknownDrink',
    price: 1,
  },
  7: {
    text: 'Кошачья мята',
    callback_data: 'products&catGrace',
    price: 1,
  },
  8: {
    text: 'Хорошие таблетки',
    callback_data: 'products&goodPills',
    price: 1,
  },
  9: {
    text: 'Зелье опыта',
    callback_data: 'products&experienceDrink',
    price: 1,
  },
  10: {
    text: 'Таинственная книга',
    callback_data: 'products&book',
    price: 1,
  },
}

const keyboards: Record<string, any> = {

  casteSelector: {
    keyboard: [
      [
        {
          text: 'Хрюки',
          callback_data: 'casteSelector&hryu',
        }
      ],
      [
        {
          text: 'Вуфчики',
          callback_data: 'casteSelector&wouf',
        }
      ],
      [
        {
          text: 'Мышачи',
          callback_data: 'casteSelector&pi',
        }
      ],
      [
        {
          text: 'Мяки',
          callback_data: 'casteSelector&myak',
        }
      ]
    ],
    title: 'Выбери звериную касту чата',
  },

  info: {
    keyboard: [
      [
        {
          text: 'Меню',
          callback_data: 'menu',
        }
      ],
      [
        {
          text: 'Инвентарь',
          callback_data: 'inventory',
        }
      ],
    ],
    title: 'Инфо',
  },

  menu: {
    keyboard: [
      [
        {
          text: 'На рынок',
          callback_data: 'menu&market',
        }
      ],
      [
        {
          text: 'Найти работу',
          callback_data: 'menu&work',
        }
      ],
      [
        {
          text: 'Карьера',
          callback_data: 'menu&career',
        }
      ]
    ],
    title: 'Меню'
  },

  career: {
    keyboard: [
      [
        {
          text: 'Пойти на работу',
          callback_data: 'career&goWork',
        }
      ],
      [
        {
          text: 'Вернуться с работы',
          callback_data: 'career&goHome',
        }
      ],
      // [
      //   {
      //     text: 'Карьера',
      //     callback_data: 'career&career',
      //   }
      // ]
    ],
  },

  market: {
    keyboard: [
      [ products[getRandomInt(1, 8)] ],
      [ products[getRandomInt(1, 8)] ],
      [ products[getRandomInt(1, 9)] ],
      [ products[getRandomInt(1, 11)] ],
    ],
    title: 'На рынке сегодня'
  },

  work: {
    keyboard: [
      [
        {
          text: 'Менять наполнитель в лотках',
          callback_data: 'work&cleaner',
        },
      ],
      [
        {
          text: 'Воровать еду со стола',
          callback_data: 'work&thief',
        },
      ],
      [
        {
          text: 'Выбивать долги из лягушек',
          callback_data: 'work&collector',
        },
      ]
    ],
    title: 'Вакансии на сегодня',
  },

  goWork: {
    keyboard: [
      [
        {
          text: 'Работать рутинно',
          callback_data: 'goWork&routine',
        },
      ],
      [
        {
          text: 'Рисковать',
          callback_data: 'goWork&risk',
        },
      ],
      [
        {
          text: 'Отлынивать от работы',
          callback_data: 'goWork&lazy',
        },
      ]
    ],
    title: 'Как ты планируешь сегодня поработать?',
  },
}

function getCaption(code: string): Record<string, any> {
  const captions: Record<string, any> = {
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

function getKeyboard(name: string) {
  console.log('getKeyboard', keyboards[name].keyboard, keyboards[name].title)
  return {
    keyboard: keyboards[name].keyboard,
    title: keyboards[name].title,
  }
}

async function getUser(userId: number | undefined): Promise<User | null> {
  ok(userId)

  const userRef = db.collection('users').doc(userId?.toString())
  const doc = await userRef.get()

  if (doc.exists) {
    return doc.data() as User
  }

  return null
}

async function getChat(chatId: number | undefined): Promise<Chat | null> {
  ok(chatId)

  const chatRef = db.collection('chats').doc(chatId?.toString())
  const doc = await chatRef.get()

  if (doc.exists) {
    return doc.data() as Chat
  }

  return null
}

async function addChat(chatId: number, data: Chat): Promise<void> {
  const chatsRef = db.collection('chats').doc(chatId?.toString())
  await chatsRef.set(data)
}

async function addUser(userId: number, data: User): Promise<void> {
  const chatsRef = db.collection('users').doc(userId?.toString())
  await chatsRef.set(data)
}

async function updateUser(userId: number, data: Record<string, any>): Promise<void> {
  const userRef = db.collection('users').doc(userId?.toString())
  await userRef.update(data)
}

async function updateChat(chatId: number, data: Partial<Chat>): Promise<void> {
  const chatRef = db.collection('chats').doc(chatId?.toString())
  await chatRef.update(data)
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min)) + min
}

function getInfoText(character: Character) {
  // ??????????????
  return `Имя: ${character.name}
📈 Уровень: ${character.level}
🗡 Опыт:${character.experience}/${character.level * 10}
❤️‍🔥 Здоровье: ${character.health}
👨‍💼 Профессия: ${character.profession.name}
💰 Звериные баллы: ${character.money}`
}

function getCareerInfoText(character: Character) {
  return `
👨‍💼 Профессия: ${character.profession.name}
📈 Уровень: ${character.profession.level}
💲 Зп: ${character.profession.salary} звериных баллов
💰 Звериные баллы: ${character.money}`
}

bot.on('message', async (msg: Message) => {
  // console.log(msg)
  const chatId = msg.chat.id
  const userId = msg?.from?.id
  let chat
  let user

  chat = await getChat(chatId)
  user = await getUser(userId)

  if (!chat) {
    chat = await addChat(chatId, {
      id: chatId,
    })
  }
  // console.log('chat', chat)

  if (!user && msg.from && userId) {
    const data = {
      id: msg.from.id,
      name: msg.from.first_name,
      surname: msg.from.last_name,
      userName: msg.from.username,
      isBot: msg.from.is_bot,
      languageCode: msg.from.language_code,
      chatId,
    }
    
    await addUser(userId, data)
    user = await getUser(userId)
  }

  if (!chat?.casteCode) {
    const { keyboard, title } = getKeyboard('casteSelector')

    bot.sendMessage(chatId, title, {
      reply_markup: {
        inline_keyboard: keyboard,
      }
    })

    return
  }

  // апдейтим основной инфой
  if (chat.casteCode && !user?.character && userId) {
    const img = `./img/${chat.casteCode}/${getRandomInt(1, 19)}.jpeg`
    const caption = getCaption(chat.casteCode).nom

    await updateUser(userId, {
      character: {
        health: 100,
        level: 0,
        img,
        money: 0,
        experience: 0,
        name: `Какой-то ${caption}`,
        profession: {
          name: `Беззаботный ${caption}`,
          level: 0,
          salary: getRandomInt(10, 100)
        }
      }
    })

    bot.sendPhoto(
      chatId,
      img,
      {
        caption : `Лови своего ${getCaption(chat.casteCode).acc} \nДай ему имя при помощи команды: \nимя <имя твоего ${getCaption(chat.casteCode).acc}>`,
        reply_markup: {
          inline_keyboard: [[{
            text: 'Инфо',
            callback_data: 'info',
          }]]
        }
      }
    )

    return
  }

  const command = msg?.text?.toLocaleLowerCase()
  console.log(command, user)

  if (user?.character?.img) {
    if (command === 'инфо') {
      const { keyboard } = getKeyboard('info')

      bot.sendPhoto(
        chatId,
        user?.character?.img ,
        {
          caption : getInfoText(user?.character),
          reply_markup: {
            inline_keyboard: keyboard
          }
        }
      )
    }

    if (command === 'меню') {
      const { keyboard, title } = getKeyboard('menu')

      bot.sendMessage(chatId, title, {
        reply_markup: {
          inline_keyboard: keyboard,
        }
      })
    }

    if (command?.includes('имя') &&  msg?.text && userId && user?.character?.name === `Какой-то ${getCaption(chat.casteCode).nom}`) {
      // const text = msg.text[0] + msg.text.substring(1)
      const name = msg?.text?.split('имя ')[1]

      if (name) {
        await updateUser(userId, {
          'character.name': name,
        })

        bot.sendMessage(
          chatId,
          `Супер, теперь твоего ${getCaption(chat.casteCode).acc} зовут ${name}`,
        )
      }
    }

    if (command === 'на рынок') {
      const { keyboard, title } = getKeyboard('market')

      bot.sendMessage(
        chatId,
        title,
        {
          reply_markup: {
            inline_keyboard: keyboard,
          }
        }
      )
    }

    if (command === 'карьера') {
      let { keyboard } = getKeyboard('career')
      // console.log(keyboard)

      keyboard = keyboard.filter(element => user.character.profession.atWork ? element[0].callback_data !== 'career&goWork' : element[0].callback_data !== 'career&goHome')

      bot.sendPhoto(
        chatId,
        `./img/${chat.casteCode}/work.jpeg`,
        {
          caption : getCareerInfoText(user.character),
          reply_markup: {
            inline_keyboard: keyboard
          }
        }
      )
    }
  }

  if (msg?.reply_to_message && userId) {
    const userReplyTo = await getUser(msg?.reply_to_message?.from?.id)

    if (command === 'дыдыщ' && user?.character) {
      if (userReplyTo?.character) {
        const health = userReplyTo.character.health - 10 > 0
          ? userReplyTo.character.health - 10
          : 0

        await updateUser(userReplyTo.id, {
          'character.health': health,
        })

        const experience = user.character.experience += 1 === user.character.level * 10
          ? 0
          : user.character.experience += 1
        
        const level = experience
          ? user.character.level
          : user.character.level += 1
        // console.log(level, userId)
        await updateUser(userId, {
          'character.experience': experience,
          'character.level': level,
        })

        bot.sendMessage(chatId, `Кажется ${userReplyTo.character.name} получил по заслугам`)
      } else {
        bot.sendMessage(chatId, `У ${msg?.reply_to_message?.from?.first_name} еще нет зверюги`)
      }
    }
  }
}),

bot.on('callback_query', async (query: Record<string, any>) => {
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
          user?.character?.img ,
          {
            caption : getInfoText(user.character),
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
            caption : getCareerInfoText(user.character),
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

}),

 bot.on('polling_error', (error: Record<string, any>) => console.log(error))