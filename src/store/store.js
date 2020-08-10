export default class Store {

  constructor() {
    this.user = null;
  }

  setUser = (user) => {
    console.log(`setUser - ${user}`)
    this.user = user;
  }

  getUser = () => {
    console.log(`getUser - ${this.user}`)
    return this.user;
  }

}
