let mock = [
  [
    {
      Dbm: -93,
      asu: 47,
      cellIdentity: 3587606,
      cellNetworkType: 13,
      connected: true,
      cqi: 10,
      earfcn: 3500,
      mcc: 621,
      mnc: 20,
      operator: 'MTN-Stay Safe',
      pci: 100,
      plmn: '62130',
      roaming: false,
      rsrp: -93,
      rsrq: -12,
      rssnr: 12,
      signalStrengthLevel: 3,
      tac: 2035,
      timingAdvance: 4,
    },
    {
      Dbm: -73,
      asu: 20,
      cellIdentity: 190182593,
      cellNetworkType: 3,
      connected: true,
      lac: 10981,
      mcc: 621,
      mnc: 30,
      operator: 'MTN-Stay Safe',
      plmn: '62130',
      psc: 345,
      roaming: false,
      signalStrengthLevel: 4,
    },
    {
      Dbm: -93,
      asu: 47,
      cellIdentity: 3587606,
      cellNetworkType: 13,
      connected: true,
      cqi: 10,
      earfcn: 3500,
      mcc: 621,
      mnc: 20,
      operator: 'Airtel',
      pci: 100,
      plmn: '62120',
      roaming: false,
      rsrp: -93,
      rsrq: -12,
      rssnr: 12,
      signalStrengthLevel: 3,
      tac: 2035,
      timingAdvance: 4,
    },
    {
      Dbm: -73,
      asu: 20,
      cellIdentity: 190182593,
      cellNetworkType: 3,
      connected: true,
      lac: 10981,
      mcc: 621,
      mnc: 30,
      operator: 'Airtel',
      plmn: '62120',
      psc: 345,
      roaming: false,
      signalStrengthLevel: 4,
    },
  ],
  ['IDLE', 'IDLE'],
  ['GSM', 'GSM'],
  ['READY', 'READY'],
  ['HSUPA', 'LTE'],
];

function filterArray(originalArray) {
  let new_arr = [];
  for (let o = 0; o < originalArray.length; o++) {
    let oa = originalArray[o];
    let pass;
    for (let n = 0; n < new_arr.length; n++) {
      let na = new_arr[n];
      if (na.operator === oa.operator || na.mnc === oa.mnc) {
        pass = true;
        break;
      }
    }
    if (!pass) new_arr.push(oa);
  }

  return new_arr;
}

// Example usage:
// const originalArray = [
//   {operator: 'Airtel', mnc: 20 /* other properties */},
//   {operator: 'Airtel', mnc: 30 /* other properties */},
//   {operator: 'MTN-Stay Safe', mnc: 20 /* other properties */},
//   {operator: 'MTN-Stay Safe', mnc: 30 /* other properties */},
// ];

// const filteredArray = filterArray(originalArray);

// console.log(filteredArray);

export {mock};
