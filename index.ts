import { ok } from 'assert'

const functions = require('firebase-functions')

// import TelegramBot from 'node-telegram-bot-api'
const TelegramBot = require('node-telegram-bot-api');

import type { Message } from 'node-telegram-bot-api'

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const token = '5780792588:AAFEoBVcHFueb6M2AAfCXIB59nfSy2yrVko'
const bot = new TelegramBot(token, { polling: true })

const serviceAccount = require('./castesbot-firebase-adminsdk-hnt76-b2852e49a7');

initializeApp({
  credential: cert(serviceAccount)
});

import { Chat, User, Character } from "./types"

const db = getFirestore()

const casteSelector = [
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
]

const products: any = {
  1: {
    text: 'Котлеты из мышей',
    callback_data: 'products&fromPi',
  },
  2: {
    text: 'Котлеты из лягушек',
    callback_data: 'products&fromKva',
  },
  3: {
    text: 'Котлеты из мяков',
    callback_data: 'products&fromMyak',
  },
  4: {
    text: 'Котлеты из вуфелов',
    callback_data: 'products&fromWouf',
  },
  5: {
    text: 'Какие-то таблетки',
    callback_data: 'products&unknownPills',
  },
  6: {
    text: 'Какое-то зелье',
    callback_data: 'products&unknownDrink',
  },
  7: {
    text: 'Кошачья мята',
    callback_data: 'products&catGrace',
  },
  8: {
    text: 'Хорошие таблетки',
    callback_data: 'products&goodPills',
  },
  9: {
    text: 'Зелье опыта',
    callback_data: 'products&experienceDrink',
  },
  10: {
    text: 'Таинственная книга',
    callback_data: 'products&book',
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
  return `Имя: ${character.name} \nУровень: ${character.level} \nОпыт:${character.experience}/${character.level * 10} \nЗдоровье: ${character.health} \nЗвериные баллы: ${character.money}`
}

async function onMessage(msg: Message) {
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
  console.log('chat', chat)

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
    bot.sendMessage(chatId, 'Выбери звериную касту чата', {
      reply_markup: {
        inline_keyboard: casteSelector,
      }
    })

    return
  }

  if (chat.casteCode && !user?.character && userId) {
    const img = `./img/${chat.casteCode}/${getRandomInt(1, 19)}.jpeg`

    await updateUser(userId, {
      character: {
        health: 100,
        level: 0,
        img,
        money: 0,
        experience: 0,
        name: `Какой-то ${getCaption(chat.casteCode).nom}`
      }
    })

    bot.sendPhoto(chatId, img ,{ caption : `Лови своего ${getCaption(chat.casteCode).acc} \nДай ему имя при помощи команды: \nимя <имя твоего ${getCaption(chat.casteCode).acc}>`} )

    return
  }

  const command = msg?.text?.toLocaleLowerCase()

  if (user?.character?.img) {
    if (command === 'инфо') {
      bot.sendPhoto(chatId, user?.character?.img , { caption : getInfoText(user?.character)} )
    }

    if (command === 'меню') {
      const menu = [
        [{
          text: 'На рынок',
          callback_data: 'на рынок',
        }],
        [{
          text: 'Найти работу',
          callback_data: 'найти работу',
        }]
      ]
      bot.sendMessage(chatId, 'че', {
        reply_markup: {
          inline_keyboard: menu,
        }
      })
    }

    if (command?.includes('имя') &&  msg?.text && userId && user?.character?.name === `Какой-то ${getCaption(chat.casteCode).nom}`) {
      const text = msg.text[0] + msg.text.substring(1)
      const name = msg?.text?.split('имя ')[1]

      if (name) {
        await updateUser(userId, {
          'character.name': name,
        })

        bot.sendMessage(chatId, `Супер, теперь твоего ${getCaption(chat.casteCode).acc} зовут ${name}`)
      }
    }

    if (command === 'на рынок') {
      const market = [
        [ products[getRandomInt(1, 8)] ],
        [ products[getRandomInt(1, 8)] ],
        [ products[getRandomInt(1, 9)] ],
        [ products[getRandomInt(1, 11)] ],
      ]

      bot.sendMessage(chatId, 'На рынке сегодня', {
        reply_markup: {
          inline_keyboard: market,
        }
      })
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
        console.log(level, userId)
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
}

bot.on('message', onMessage)

exports.bot = functions.https.onRequest((req: any, res: any) => {
  bot.handleUpdate(req.body, res);
})

exports.echoBot = functions.https.onRequest(async (request: any, response: any) => {
	functions.logger.log('Incoming message', request.body)

  // @TODO security check

  const result = await onMessage(request.body as Message)

  functions.logger.log('Result', result)

  return response.sendStatus(200)
})

bot.on('callback_query', async (query: Record<string, any>) => {
  const chatId = query?.message?.chat.id
  console.log(query, query?.message?.reply_markup)

  const chat = await getChat(chatId)

  if (query.data) {
    const dataArr = query.data?.split('&')
    const type = dataArr[0]
    const data = dataArr[1]

    if (type === 'casteSelector' && chatId) {
      const button = casteSelector.find(element => element[0].callback_data === query.data)

      if (button && !chat?.casteCode) {
        
        await updateChat(chatId, {
          title: button[0].text,
          casteCode: data,
        })

        bot.sendMessage(chatId, `Ура, теперь тут живут ${button[0].text}!!`)
      } else {
        bot.sendMessage(chatId, 'Каста уже выбрана(')
      }
    }

    if (type === 'products' && chatId) {
      bot.sendMessage(chatId, 'Нет звериных балов(')
    }
  }

})

 bot.on('polling_error', (error: Record<string, any>) => console.log(error))