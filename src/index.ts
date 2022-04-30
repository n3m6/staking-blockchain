import Node from './node';
import { argv } from 'process';

async function main() {
  const host = argv[2];
  const port = argv[3];
  const httpPort = argv[4];

  if (!host || !port) {
    console.log('Provide a host and port.');
    process.exit(1);
  }

  const node = new Node(host, port, httpPort);

  await node.startP2P();
}

main().then(() => {
});
