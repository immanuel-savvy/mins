import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaView, PermissionsAndroid, NativeModules} from 'react-native';
import Emitter from 'semitter';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
//
import Splash from './src/screens/Splash';
import {hp, wp} from './src/utils/dimensions';
import Speed, {
  as_to_name,
  measureDownloadSpeed,
  net_type,
} from './src/screens/Speed';
import Networks from './src/screens/Networks';
import History from './src/screens/History';
import Settings from './src/screens/Settings';
import Icon from './src/components/icon';
import {App_data, Networks_data, Test_history} from './Contexts';
import toast from './src/utils/toast';
import {copy_object} from './src/utils/functions';
import {mock} from './nottess';
import BackgroundFetch from 'react-native-background-fetch';
import {_3mb} from './src/components/speed_stats';
import Data from './src/screens/Data';

const {RadioParameters} = NativeModules;

const Server = false
  ? 'http://192.168.43.11:3700'
  : 'http://mins.giitafrica.com';

const emitter = new Emitter();

const App_stack = createStackNavigator();

const Bottom_tab = createBottomTabNavigator();

class Index extends React.Component {
  constructor(props) {
    super(props);

    let {route} = this.props;

    this.state = {};
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  render = () => {
    return (
      <Bottom_tab.Navigator
        initialRouteName="speed"
        backBehavior="initialRoute"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#006dbb',
          tabBarInactiveTintColor: '#858597',
          tabBarInactiveBackgroundColor: '#fff',
          tabBarActiveBackgroundColor: '#eee',
          tabBarStyle: {
            height: hp(9),
            fontFamily: 'segoeuil',
            justifyContent: 'center',
            paddingBottom: hp(1),
          },
        }}>
        <Bottom_tab.Screen
          name="speed"
          component={Speed}
          options={{
            tabBarLabel: 'Speed',
            tabBarIcon: ({color}) => (
              <Icon
                color={color}
                icon={require('./src/assets/icons/icon_speed.png')}
                style={{height: wp(7), width: wp(7)}}
              />
            ),
          }}
        />
        <Bottom_tab.Screen
          name="networks"
          component={Networks}
          options={{
            tabBarLabel: 'Networks',
            tabBarIcon: () => (
              <Icon
                icon={require('./src/assets/icons/location.png')}
                style={{height: wp(7), width: wp(7)}}
              />
            ),
          }}
        />
        <Bottom_tab.Screen
          name="history"
          component={History}
          options={{
            tabBarLabel: 'History',
            tabBarIcon: () => (
              <Icon
                icon={require('./src/assets/icons/history.png')}
                style={{height: wp(7), width: wp(7)}}
              />
            ),
          }}
        />
        <Bottom_tab.Screen
          name="settings"
          component={Settings}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: () => (
              <Icon
                icon={require('./src/assets/icons/setting.png')}
                style={{height: wp(7), width: wp(7)}}
              />
            ),
          }}
        />
      </Bottom_tab.Navigator>
    );
  };
}

class App_stack_entry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render = () => {
    let {show} = this.props;

    return (
      <App_stack.Navigator
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          keyboardHandlingEnabled: true,
          gestureEnabled: true,
          animationEnabled: true,
        }}>
        <App_stack.Screen name="index" component={Index} />
        <App_stack.Screen name="data" component={Data} />
      </App_stack.Navigator>
    );
  };
}

function getNetworkTypeName(networkType) {
  const networkTypes = {
    1: 'GPRS',
    2: 'EDGE',
    3: 'UMTS',
    4: 'CDMA',
    5: 'EVDO_0',
    6: 'EVDO_A',
    7: '1xRTT',
    8: 'HSDPA',
    9: 'HSUPA',
    10: 'HSPA',
    11: 'iDen',
    12: 'EVDO_B',
    13: 'LTE',
    14: 'eHRPD',
    15: 'HSPA+',
    19: 'UMTS (TD-SCDMA)',
    20: 'LTE (TD-LTE)',
    28: 'LTE (TD-LTE)',
    30: 'WCDMA (NR)',
    41: 'LTE (NR)',
    // Add more network types as needed
  };

  return networkTypes[networkType] || 'LTE';
}

// Function to convert SIM state to text
function convertSimStateToText(simState) {
  switch (simState) {
    case 0:
      return 'UNKNOWN';
    case 1:
      return 'ABSENT';
    case 2:
      return 'PIN_REQUIRED';
    case 3:
      return 'PUK_REQUIRED';
    case 4:
      return 'NETWORK_LOCKED';
    case 5:
      return 'READY';
    default:
      return 'Unknown';
  }
}

// Function to convert phone type to text
function convertPhoneTypeToText(phoneType) {
  switch (phoneType) {
    case 0:
      return 'NONE';
    case 1:
      return 'GSM';
    case 2:
      return 'CDMA';
    case 3:
      return 'SIP';
    default:
      return 'Unknown';
  }
}

// Function to convert call state to text
function convertCallStateToText(callState) {
  switch (callState) {
    case 0:
      return 'IDLE';
    case 1:
      return 'RINGING';
    case 2:
      return 'OFFHOOK';
    default:
      return 'Unknown';
  }
}

function plmn_to_name(plmn) {
  switch (plmn) {
    case '62120':
      return 'Airtel';
    case '62130':
      return 'MTN';
    case '62150':
      return 'Glo';
    case '62160':
      return '9mobile';
  }
}

function filterArray(originalArray) {
  let new_arr = [];
  for (let o = 0; o < originalArray.length; o++) {
    let oa = originalArray[o];
    let pass;
    for (let n = 0; n < new_arr.length; n++) {
      let na = new_arr[n];
      if (na?.operator === oa?.operator || na.mnc === oa.mnc) {
        pass = true;
        break;
      }
    }
    if (!pass) new_arr.push(oa);
  }

  return new_arr;
}

class Mins extends React.Component {
  constructor(props) {
    super(props);

    this.state = {loading: true, networks: new Array(), loaded_networks: false};
  }

  radio_parameters = async () => {
    let netinfos = await RadioParameters.getNetworkInfos();
    let networktype = (await RadioParameters.getNetworkType()).map(n =>
      getNetworkTypeName(n),
    );
    let simstate = (await RadioParameters.getSimState()).map(n =>
      convertSimStateToText(n),
    );
    let callstates = (await RadioParameters.getCallStates()).map(n =>
      convertCallStateToText(n),
    );
    let phonetypes = (await RadioParameters.getPhoneTypes()).map(n =>
      convertPhoneTypeToText(n),
    );

    let val_arr = mock || [
      netinfos,
      callstates,
      phonetypes,
      simstate,
      networktype,
    ];

    val_arr[0] = filterArray(val_arr[0]);

    // console.log(val_arr, 'val array');

    let val_names = [
      'Net',
      'CallStates',
      'PhoneTypes',
      'SimState',
      'NetworkType',
    ];

    let sims = new Object();
    for (let i = 0; i < val_arr[0].length; i++) {
      let sim = `Sim ${i + 1}`;
      if (!sims[sim]) sims[sim] = new Object();

      if (val_arr[0][i] && !val_arr[0][i]?.plmn)
        val_arr[0][i].plmn = `${val_arr[0][i].mcc}${val_arr[0][i].mnc}`;

      if (val_arr[0][i]?.plmn)
        val_arr[0][i].operator = plmn_to_name(val_arr[0][i]?.plmn);

      val_arr.map((v, k) => {
        sims[sim][val_names[k]] = v[i];
      });
    }

    // console.log(JSON.stringify(sims, null, 2));

    return sims;
  };

  refresh_network = async () => {
    let {netinfo} = this.state;
    let _netinfo = {...netinfo};
    netinfo = await NetInfo.fetch();

    if (JSON.stringify(netinfo) !== JSON.stringify(_netinfo)) {
      fetch('http://ip-api.com/json/')
        .then(data => data.json())
        .then(res => {
          if (res?.as) res.as = res.as.split(' ')[0];
          this.setState({isp: res});
        })
        .catch(e => console.log(e, 'WHYY'));
    }

    let radio = await this.radio_parameters();

    this.setState({
      netinfo: {
        ...netinfo,
        radio,
        device: await RadioParameters.getDeviceInfo(),
      },
      offline: !netinfo.isConnected,
    });
  };

  network_process = async na => {
    !na && (await this.refresh_network());
    let {netinfo, isp, location_info} = this.state;

    let latency = Number(
      (
        (await RadioParameters.measureLatency('mins.giitafrica.com')) * 1000
      ).toFixed(2),
    );
    let download_speed = Number(
      (await measureDownloadSpeed(`${Server}/download_speed`)).toFixed(2),
    );
    let upload_speed = Number(
      (
        await RadioParameters.measureUploadSpeed(`${Server}/upload_speed`, _3mb)
      ).toFixed(2),
    );

    let test = {
      download_speed,
      upload_speed,
      latency,
      timestamp: Date.now(),
      netinfo: {...netinfo, ...isp},
      location: location_info,
    };

    try {
      await this.send_to_server(test);
    } catch (e) {}
  };

  background_process = () => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 60 * 4, // minimum interval in minutes
        stopOnTerminate: false, // continue running after the app is terminated
        startOnBoot: true, // start when the device boots up
      },
      async taskId => {
        await this.network_process();
        BackgroundFetch.finish(taskId); // signal task completion
      },
    );
    // Start the background task
    BackgroundFetch.start();
  };

  send_to_server = async test => {
    await this.aggregate_network(test, true);
  };

  componentDidMount = async () => {
    await this.requestPhoneStatePermission();

    await this.refresh_network();

    let superuser = await AsyncStorage.getItem('superuser');
    let show_data = await AsyncStorage.getItem('showdata');

    let get_one_time_location = () => {
      Geolocation.getCurrentPosition(
        position => {
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
          )
            .then(data => data.json())
            .then(res => {
              this.setState(
                {
                  location: res,
                  location_info: {
                    ...position.coords,
                    continent: res.continent,
                    countryCode: res.countryCode,
                    countryName: res.countryName,
                    city: res.city,
                    locality: res.locality,
                  },
                  loading: false,
                  superuser: !!superuser,
                  show_data: !!show_data,
                },
                async () => {
                  await AsyncStorage.setItem(
                    'location',
                    JSON.stringify(this.state.location_info),
                  );
                  await this.network_process(true);
                },
              );
            })
            .catch(async err => {
              toast("Couldn't get location details");
              console.log(err.message);
              let location = await this.fetch_local_tion();
              this.setState(
                {loading: false, location_info: location, location},
                get_one_time_location,
              );
            });
        },
        error => {
          console.log(error.message);
          this.fetch_local_tion()
            .then(location => {
              this.setState(
                {
                  loading: false,
                  location,
                  location_info: location,
                  superuser: !!superuser,
                  show_data: !!show_data,
                },
                get_one_time_location,
              );
            })
            .catch(e => console.log(e, 'here meee'));
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 1000,
        },
      );
    };

    setTimeout(() => {
      this.setState({loading: false, superuser: !!superuser});
    }, 2500);

    get_one_time_location();

    this.fetch_history = async () => {
      this.setState({history: await this.load_history()});
    };

    this.clear_history = async () => {
      this.setState({history: new Array()});
      await AsyncStorage.removeItem('history');
    };

    this.new_test = async test => {
      let {history, netinfo, location_info, isp} = this.state;
      if (!history) history = await this.load_history();

      test.timestamp = Date.now();
      test.netinfo = {...netinfo, ...isp};
      test.location = location_info;

      history.length >= this._history_length &&
        history.splice(-1 * (history.length - this._history_length));

      history.unshift(test);
      this.setState({history}, this.persist_history);
    };

    emitter.listen('fetch_history', this.fetch_history);
    emitter.listen('new_test', this.new_test);
    emitter.listen('clear_history', this.clear_history);
  };

  _history_length = 75;

  fetch_local_tion = async () => {
    let location = await AsyncStorage.getItem('location');
    location = location ? JSON.parse(location) : new Object();

    return location;
  };

  componentWillUnmount = () => {
    emitter.remove_listener('fetch_history', this.fetch_history);
    emitter.remove_listener('clear_history', this.clear_history);
    emitter.remove_listener('new_test', this.new_test);
  };

  persist_history = async test => {
    let {history, netinfo} = this.state;

    await AsyncStorage.setItem('history', JSON.stringify(history));

    if (!test)
      netinfo?.type !== 'wifi' &&
        this.aggregate_network(copy_object(history[0]));
  };

  get_isp = n => {
    return as_to_name(n.netinfo);
  };

  get_net = test => {
    let {networks} = this.state;

    return networks.find(
      n =>
        this.get_isp(n) === this.get_isp(test) &&
        this.get_area(n) === this.get_area(test),
    );
  };

  get_area = o => {
    return o?.location?.locality
      ? `${o?.location?.locality}-${o?.location?.city}-${o?.location?.countryName}`.toLowerCase()
      : null;
  };

  aggregate_network = async (test, bg) => {
    test.isp = this.get_isp(test);
    test.area = this.get_area(test);

    if (!test.isp || !test.area) return;
    if (
      !['airtel', 'mtn', '9mobile', 'glo'].includes(
        as_to_name(test)?.toLowerCase(),
      )
    )
      return;

    fetch(`${Server}/aggregate_network`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({test}),
    })
      .then(data => data.json())
      .then(res => {
        if (bg) return;
        let {networks} = this.state;

        networks = networks.map(n => {
          if (n.area === test.area && n.isp === test.isp) return res;
          return n;
        });
        !networks.length && networks.push(res);
        this.setState({networks});
      })
      .catch(e => console.log(e));
  };

  load_history = async () => {
    let history = await AsyncStorage.getItem('history');
    if (history) history = JSON.parse(history);
    else history = new Array();

    return history;
  };

  load_networks = async () => {
    let {location} = this.state;
    if (!location) return this.setState({networks: new Array()});

    fetch(`${Server}/networks`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        area: this.get_area({location}),
      }),
    })
      .then(data => data.json())
      .then(networks => {
        this.setState({networks, loaded_networks: true});
      })
      .catch(e => console.log(e));
  };

  requestPhoneStatePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: 'Phone State Permission',
          message:
            'This app needs access to your phone state to retrieve network information.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('READ_PHONE_STATE permission granted');
        // You can now proceed to use the permission
      } else {
        console.log('READ_PHONE_STATE permission denied');
        // Handle the case where the user denied the permission
      }
    } catch (err) {
      console.warn(err);
    }
    let superuser = await AsyncStorage.getItem('superuser');
    superuser && this.background_process();
    if (superuser) {
      // try {
      //   const granted = await PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE,
      //     {
      //       title: 'Background Process Permission',
      //       message:
      //         'This app needs permission to run background processes for optimal functionality.',
      //       buttonPositive: 'OK',
      //       buttonNegative: 'Cancel',
      //     },
      //   );
      //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //     const granted = await PermissionsAndroid.request(
      //       PermissionsAndroid.PERMISSIONS.RECEIVE_BOOT_COMPLETED,
      //       {
      //         title: 'Background Process Permission',
      //         message:
      //           'This app needs permission to run background processes for optimal functionality.',
      //         buttonPositive: 'OK',
      //         buttonNegative: 'Cancel',
      //       },
      //     );
      //     if (granted === PermissionsAndroid.RESULTS.GRANTED)
      //       this.background_process();
      //     else await AsyncStorage.removeItem('superuser');
      //   } else await AsyncStorage.removeItem('superuser');
      // } catch (err) {
      //   console.warn(err);
      // }
    }
  };

  toggle_super_user = async () => {
    let {superuser} = this.state;
    this.setState({superuser: !superuser});
    if (superuser) {
      await AsyncStorage.removeItem('superuser');
      BackgroundFetch.stop();
    } else await AsyncStorage.setItem('superuser', 'yes');
  };

  toggle_show_data = async () => {
    let {show_data} = this.state;

    this.setState({show_data: !show_data});

    if (show_data) await AsyncStorage.removeItem('showdata');
    else await AsyncStorage.setItem('showdata', 'true');
  };

  render = () => {
    let {
      loading,
      netinfo,
      offline,
      history,
      isp,
      location,
      loaded_networks,
      superuser,
      show_data,
      networks,
    } = this.state;

    return (
      <NavigationContainer>
        <SafeAreaView collapsable={false} style={{flex: 1}}>
          {loading ? (
            <Splash />
          ) : (
            <App_data.Provider
              value={{
                location,
                netinfo,
                superuser,
                toggle_show_data: this.toggle_show_data,
                show_data: show_data,
                refresh_network: this.refresh_network,
                isp,
                offline,
                toggle_super_user: this.toggle_super_user,
                refresh_network: this.refresh_network,
              }}>
              <Networks_data.Provider
                value={{
                  location,
                  load_networks: this.load_networks,
                  loaded_networks,
                  networks,
                }}>
                <Test_history.Provider value={{history}}>
                  <SafeAreaView style={{flex: 1}}>
                    <App_stack_entry />
                  </SafeAreaView>
                </Test_history.Provider>
              </Networks_data.Provider>
            </App_data.Provider>
          )}
        </SafeAreaView>
      </NavigationContainer>
    );
  };
}

export default Mins;
export {emitter, Server, plmn_to_name};
