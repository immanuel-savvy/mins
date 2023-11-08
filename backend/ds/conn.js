import GDS from 'generalised-datastore';

let gds;
let TESTS, AREA_NETWORKS;

const ds_conn = () => {
  gds = new GDS('mins').sync();

  TESTS = gds.folder('tests');
  AREA_NETWORKS = gds.folder('area_networks', 'area', 'test');
};

export default ds_conn;
export {TESTS, AREA_NETWORKS};
