import TelegramBot, {
  Message,
  SendMessageOptions,
  SendPhotoOptions
} from 'node-telegram-bot-api'

export class TelegramService {
  public readonly bot: TelegramBot

  constructor(botToken: string, mode: string) {
    const isProduction = mode === 'production'

    const bot = new TelegramBot(
      botToken,
      isProduction ? {
        webHook: {
          port: Number(process.env.PORT)
        }
      } : { polling: true }
    )

    if (isProduction) {
      bot.setWebHook(
        `${process.env.APP_URL || 'https://bbaj9l05mcpj3shu1nd4.containers.yandexcloud.net'}/bot${botToken}`
      )
    }

    this.bot = bot
  }

  sendMessage(chatId: number, text: string, options: SendMessageOptions = {}): Promise<Message> {
    return this.bot.sendMessage(chatId, text, options)
  }

  sendPhoto(chatId: number, img: string, options: SendPhotoOptions = {}): Promise<Message> {
    return this.bot.sendPhoto(chatId, img, options)
  }
}
