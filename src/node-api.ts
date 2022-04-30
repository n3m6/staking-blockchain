import { fastify, FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import pino from 'pino';
import Node from './node';

export default class NodeApi {
  server: FastifyInstance;
  port: number;
  node: Node;

  constructor(port: string, node: Node) {
    this.server = fastify({
      logger: pino({ level: 'info' }),
    });
    this.port = Number(port);
    this.node = node;
  }

  async start() {
    try {
      this.server.register(this.routes.bind(this));
      await this.server.listen(this.port);
      console.log('REST API started...');
    } catch (err) {
      this.server.log.error(err);
    }
  }

  async infoRoute(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    return reply.send('This is the communication interface to a nodes blockchain');
  }

  async blockchainRoute(request: FastifyRequest<any>, reply: FastifyReply<any>) {
    return reply.send(this.node.blockchain.toString());
  }

  async transactionPoolRoute(req: FastifyRequest<any>, reply: FastifyReply<any>) {
    return reply.send(this.node.pool.toString());
  }

  async transactionRoute(req: FastifyRequest<any>, reply: FastifyReply<any>) {
    const values = req.body;
    if (!!values.transaction) {
      this.node.handleTransaction(values.transaction);
      return reply.send(201);
    }

    return reply.send(400);
  }

  async routes(server: FastifyInstance, options: FastifyPluginOptions) {
    server.get('/info', {}, this.infoRoute.bind(this));
    server.get('/blockchain', {}, this.blockchainRoute.bind(this));
    server.get('/transactionpool', {}, this.transactionPoolRoute.bind(this));
    server.post('/transaction', {}, this.transactionRoute.bind(this));
  }
}