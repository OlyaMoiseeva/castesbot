export type Food = {
  text: string
  callback_data: string
  price: number
}

export const food: Record<number, Food> = {
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
