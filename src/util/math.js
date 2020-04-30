export const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

export const getRandomIntInRange = (min, max) => {
  const minInternal = Math.min(min, max)
  const diff = Math.abs(max - min)
  return minInternal + Math.floor(Math.random() * Math.floor(diff))
}
