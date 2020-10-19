import {getRandomInt} from './math';

export const getRandomElement = <T>(list: Array<T>): T | null => {
  if (!list || list.length === 0) {
    return null
  }

  return list[getRandomInt(list.length)]

}

export const last = <T>(list: Array<T>): T | null => {
  if (!list || list.length === 0) {
    return null
  }

  return list[list.length - 1]

}
export const replaceWhere = <T>(
  list: Array<T>,
  condition: (o: T) => boolean,
  objectToAdd: T
): Array<T> => {
  const innerList = [...list].filter(o => !condition(o));
  innerList.push(objectToAdd)
  return innerList
}
