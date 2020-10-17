export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max))
}

export const getRandomIntInRange = (min: number, max: number) => {
  const minInternal = Math.min(min, max)
  const diff = Math.abs(max - min)
  return minInternal + Math.floor(Math.random() * Math.floor(diff))
}
