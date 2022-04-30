export default class SocketConnector {
  ip: string;
  port: string;

  constructor(ip: string, port: string) {
    this.ip = ip;
    this.port = port;
  }

  equals(connector: SocketConnector) {
    return this.ip === connector.ip && this.port === connector.port;
  }
}