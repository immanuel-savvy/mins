import GDS from 'generalised-datastore';

let gds;
let TESTS;

const ds_conn = () => {
  gds = new GDS('mins').sync();

  TESTS = gds.folder('tests');
};

export default ds_conn;
export {TESTS};
