import express from 'express';
import cors from 'cors';
import ds_conn, {AREA_NETWORKS, TESTS} from './ds/conn';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));

app.get('/', (req, res) => res.send('<div><h1>Hi, its Mins.</h1></div>'));

const _3mb = '0'.repeat(1024 * 1024 * 3);

app.get('/download_speed', (req, res) => {
  res.header('Content-Type', 'text/plain').send(_3mb);
});

app.post('/upload_speed', (req, res) => {
  res.end();
});

app.post('/aggregate_network', (req, res) => {
  let {test} = req.body;

  let network = AREA_NETWORKS.readone({area: test.area, isp: test.isp});
  if (network) {
    if (network.test.download_speed < test.download_speed)
      network.test.download_speed = test.download_speed;
    if (network.test.upload_speed < test.upload_speed)
      network.test.upload_speed = test.upload_speed;
    if (network.test.latency > test.latency)
      network.test.latency = test.latency;

    TESTS.update(network.test._id, {
      download_speed: network.test.download_speed,
      upload_speed: network.test.upload_speed,
      latency: network.test.latency,
    });
    test = network.test;
  } else {
    let result = TESTS.write(test);
    test._id = result._id;
    test.created = result.created;
    AREA_NETWORKS.write({area: test.area, isp: test.isp, test: result._id});
  }

  res.json(test);
});

app.post('/networks', (req, res) => {
  let {area} = req.body;

  res.json(AREA_NETWORKS.read({area}).map(a => a.test));
});

app.listen(3700, () => {
  ds_conn();

  console.log('Mins Backend started on :3700');
});
