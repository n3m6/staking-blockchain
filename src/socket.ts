import PeerDiscovery from './peer-discovery';
import { createConnection, createServer, Server, Socket as NetSocket } from 'net';

export interface Message {
  type: 'DISCOVERY' | 'ANNOUNCE';
  peers?: string;
  host?: string;
  port?: number;
}

export interface Peers {
  host: string;
  port: number;
}

export default class Socket {
  peers: Peers[];
  peerDiscovery: PeerDiscovery;
  server: Server;
  host: string;
  port: number;

  constructor(host: string, port: string) {
    this.host = host;
    this.port = Number(port);
    this.peers = [];
    this.peerDiscovery = new PeerDiscovery(this);

    this.server = createServer((socket: NetSocket) => this.attachSocketHandlers(socket));
  }

  attachSocketHandlers(socket: NetSocket) {

    socket.on('connection', (socket) => {
      console.log('client connection established');

    });

    socket.on('error', (error) => {
      console.log(`Error: ${error.message}`);
    });

    socket.on('data', (data: Buffer | string) => {

      const message: Message = JSON.parse(data.toString());
      console.log(message);
      if (message.type === 'DISCOVERY') {
        socket.write(JSON.stringify({
          type: 'DISCOVERY',
          peers: JSON.stringify(this.peers),
        }));
      }

      if (message.type === 'ANNOUNCE') {
        this.peers.push({
          host: message.host,
          port: message.port,
        });
      }
    });

    socket.on('close', () => {
      console.log('client connection closed');
    });

    socket.on('end', () => {
      console.log('client connection ended');
    });

  }

  async start() {
    this.server.listen({
      host: this.host,
      port: this.port,
      exclusive: true,
    }, () => {
      console.log(`Server listening on ${JSON.stringify(this.server.address())}`);
    });

    this.peerDiscovery.start();

    this.connectWithParent();
  }

  connectWithParent() {
    if (this.port !== 10001) {
      const socket: NetSocket = createConnection({
        host: '127.0.0.1',
        port: 10001,
      });

      socket.on('connect', () => {
        console.log('client connected with parent');
        const message1: Message = {
          type: 'ANNOUNCE',
          host: this.host,
          port: this.port,
        };

        const message2: Message = {
          type: 'DISCOVERY',
        };

        socket.write(JSON.stringify(message1));
        socket.write(JSON.stringify(message2));
      });

      socket.on('data', (data) => {
        const message = JSON.parse(data.toString());
        console.log(message);
      });

      socket.on('close', () => {
        console.log('client connection with parent closed');
      });

      socket.on('end', () => {
        console.log('client connection with parent ended');
      });
    }
  }

  stop() {
    this.server.close();
  }
}