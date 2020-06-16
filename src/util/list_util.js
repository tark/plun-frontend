import {getRandomInt} from './math';

export const getRandomElement = (list) => {
  if (!list || list.length === 0) {
    return null
  }

  return list[getRandomInt(list.length)]

}
