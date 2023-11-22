import GDS from 'generalised-datastore';

let gds;
let TESTS, AREA_NETWORKS, LOCATION_TESTS, GLOBALS;

const ds_conn = () => {
  gds = new GDS('mins').sync();

  TESTS = gds.folder('tests');
  LOCATION_TESTS = gds.folder('location_tests', 'area', 'test');
  AREA_NETWORKS = gds.folder('area_networks', 'area', 'test');
  GLOBALS = gds.folder('globals', 'global');
};

export default ds_conn;
export {TESTS, AREA_NETWORKS, LOCATION_TESTS, GLOBALS};
