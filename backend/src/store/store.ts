export class Store {
  private waitingPlayers = [];
  static store: Store;
  private constructor() {}
  static getInstance() {
    if (!Store.store) {
      Store.store = new Store();
      return Store.store;
    }
    return Store.store;
  }
  addPlayer(name: string) {
    this.waitingPlayers.push({
      id: Math.random(),
      name,
    });
  }

  getWaitingList() {
    return this.waitingPlayers;
  }
}
