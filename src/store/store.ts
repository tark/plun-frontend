import {User} from '../api/models/models';

export default class Store {

  user : User | undefined;

  constructor(user?: User) {
    this.user = user;
  }

  setUser = (user: User) => {
    console.log(`setUser - ${user}`)
    this.user = user;
  }

  getUser = () => {
    console.log(`getUser - ${this.user}`)
    return this.user;
  }

}
