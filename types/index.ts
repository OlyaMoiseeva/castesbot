export type Chat = {
  id: number
  casteCode?: string
  title?: string
}

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
  }
}