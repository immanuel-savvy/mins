import express from 'express';
import cors from 'cors';
import ds_conn, {AREA_NETWORKS, TESTS} from './ds/conn';
import router from './routes';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));

router(app);

app.get('/', (req, res) => res.send('<div><h1>Hi, its Mins.</h1></div>'));

app.post('aggregate_network', (req, res) => {
  let {test} = req.body;

  let network = AREA_NETWORKS.readone({area: test.area, isp: test.isp});
  if (network) {
    if (network.test.receivedNetworkSpeed < test.receivedNetworkSpeed)
      network.test.receivedNetworkSpeed;
    if (network.test.receivedNetworkTotal < test.receivedNetworkTotal)
      network.test.receivedNetworkTotal;
    if (network.test.sendNetworkSpeed < test.sendNetworkSpeed)
      network.test.sendNetworkSpeed;
    if (network.test.sendNetworkTotal < test.sendNetworkTotal)
      network.test.sendNetworkTotal;
    if (network.test.latency < test.latency) network.test.latency;

    TESTS.update(network.test._id, {
      receivedNetworkSpeed: network.test.receivedNetworkSpeed,
      receivedNetworkTotal: network.test.receivedNetworkTotal,
      sendNetworkSpeed: network.test.sendNetworkSpeed,
      sendNetworkTotal: network.test.sendNetworkTotal,
      latency: network.test.latency,
    });
    test = network.test;
  } else {
    let result = TESTS.write(test);
    test._id = result._id;
    test.created = result.created;
    AREA_NETWORKS.write({area: test.area, isp: test.isp, test: result._id});
  }

  res.json({test});
});

app.post('networks', (req, res) => {
  let {area} = req.body;

  res.json(AREA_NETWORKS.read({area}).map(a => a.test));
});

app.listen(3700, () => {
  ds_conn();

  console.log('Mins Backend started on :3700');
});
