import Socket from './socket';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default class PeerDiscovery {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  async start() {
    this.status();
    this.discovery();
  }

  async discovery() {
    while(true) {
      console.log('discovery...')
      await sleep(10000);
    }
  }

  async status() {
    while(true) {
      console.log('status: ...');
      await sleep(10000);
    }
  }

}