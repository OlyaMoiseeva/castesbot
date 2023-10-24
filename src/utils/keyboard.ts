import { getRandomInt } from './random'
import { food } from './market'

export const casteSelector = {
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
}

export const info = {
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
}

export const menu = {
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
}

export const career = {
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
}

export const market = {
  keyboard: [
    [food[getRandomInt(1, 8)]],
    [food[getRandomInt(1, 8)]],
    [food[getRandomInt(1, 9)]],
    [food[getRandomInt(1, 11)]],
  ],
  title: 'На рынке сегодня'
}

export const work = {
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
}

export const goWork = {
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
}

export const keyboards = {
  casteSelector,
  info,
  menu,
  career,
  market,
  work,
  goWork,
}

export const getKeyboard = (name: string) => ({
  keyboard: keyboards[name].keyboard,
  title: keyboards[name].title,
})
