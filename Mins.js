import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  View,
  PermissionsAndroid,
  NativeModules,
} from 'react-native';
import Emitter from 'semitter';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
//
import Splash from './src/screens/Splash';
import {hp, wp} from './src/utils/dimensions';
import Speed, {net_type} from './src/screens/Speed';
import Networks from './src/screens/Networks';
import History from './src/screens/History';
import Settings from './src/screens/Settings';
import Icon from './src/components/icon';
import {App_data, Networks_data, Test_history} from './Contexts';
import toast from './src/utils/toast';
import {copy_object} from './src/utils/functions';
import {mock} from './nottess';

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
    return (
      <App_stack.Navigator
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          keyboardHandlingEnabled: true,
          // gestureEnabled: true,
          animationEnabled: true,
        }}>
        <App_stack.Screen name="index" component={Index} />
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
    // Add more network types as needed
  };

  return networkTypes[networkType] || 'Unknown';
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

    let netinfos_ = new Array();
    // netinfos.map((n, ni) => {
    //   // console.log(JSON.stringify(n, null, 2));
    //   let nt = netinfos_.find(
    //     net => n.operator === net.operator && n.mnc === net.mnc,
    //     // n.mcc === net.mcc,
    //   );
    //   if (!nt) netinfos_.push(n);
    //   console.log(JSON.stringify(netinfos_, null, 2), 'LOLA IS GREY' + ni);
    // });

    let val_arr = mock || [
      netinfos_,
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

      val_arr.map((v, k) => {
        sims[sim][val_names[k]] = v[i];
      });
    }

    console.log(JSON.stringify(sims, null, 2));

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
          this.setState({isp: res});
        })
        .catch(e => console.log(e, 'WHYY'));
    }

    let radio = await this.radio_parameters();

    this.setState({
      netinfo: {...netinfo, radio},
      offline: !netinfo.isConnected,
    });
  };

  componentDidMount = async () => {
    await this.requestPhoneStatePermission();

    await this.refresh_network();

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
                },
                async () =>
                  await AsyncStorage.setItem(
                    'location',
                    JSON.stringify(this.state.location_info),
                  ),
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
                {loading: false, location, location_info: location},
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
      this.setState({loading: false});
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

  persist_history = async () => {
    let {history} = this.state;

    await AsyncStorage.setItem('history', JSON.stringify(history));

    this.aggregate_network(copy_object(history[0]));
  };

  get_isp = n => {
    return `${n.netinfo.isp} ${net_type(n.netinfo, true)}`;
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
    return `${o?.location?.locality}-${o?.location?.city}-${o?.location?.countryName}`.toLowerCase();
  };

  aggregate_network = async test => {
    let has_net;

    let my_net = this.get_net(test);
    has_net = !!my_net;

    if (has_net) {
      if (
        my_net.download_speed > test.download_speed &&
        my_net.upload_speed > test.upload_speed &&
        my_net.latency < test.latency
      )
        return;
    }

    test.isp = this.get_isp(test);
    test.area = this.get_area(test);
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
                isp,
                offline,
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
export {emitter, Server};
