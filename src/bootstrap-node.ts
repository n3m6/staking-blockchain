const DHT = require('@hyperswarm/dht');

const node = DHT.bootstrapper(49736)

node.ready().then(function () {
  console.log('Bootstrapper running on port ' + node.address().port)
})
