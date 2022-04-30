export default class Message {
  senderConnector: string;
  messageType: string;
  data: string;
  
  constructor(senderConnector: string, messageType: string, data: string) {
    this.senderConnector = senderConnector;
    this.messageType = messageType;
    this.data = data;
  }
}