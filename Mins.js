import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaView, View} from 'react-native';
import Emitter from 'semitter';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
//
import Splash from './src/screens/Splash';
import {hp, wp} from './src/utils/dimensions';
import Speed from './src/screens/Speed';
import Networks from './src/screens/Networks';
import History from './src/screens/History';
import Settings from './src/screens/Settings';
import Icon from './src/components/icon';
import {App_data, Test_history} from './Contexts';
import toast from './src/utils/toast';

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

class Mins extends React.Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
  }

  refresh_network = async () => {
    let netinfo = await NetInfo.fetch();
    this.setState({netinfo});
  };

  componentDidMount = async () => {
    await this.refresh_network();

    let get_one_time_location = () => {
      Geolocation.getCurrentPosition(
        position => {
          console.log(JSON.stringify(position, null, 2));

          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
          )
            .then(data => data.json())
            .then(res => {
              console.log(res);
              this.setState({
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
              });
            })
            .catch(err => {
              toast("Couldn't get location details");
              console.log(err.message);
              this.setState({loading: false}, get_one_time_location);
            });
        },
        error => {
          console.log(error.message);
          this.setState({loading: false}, get_one_time_location);
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
      let {history, netinfo, location_info} = this.state;
      if (!history) history = await this.load_history();

      test.timestamp = Date.now();
      test.netinfo = netinfo;
      test.location = location_info;

      history.unshift(test);
      this.setState({history}, this.persist_history);
    };

    emitter.listen('fetch_history', this.fetch_history);
    emitter.listen('new_test', this.new_test);
    emitter.listen('clear_history', this.clear_history);
  };

  componentWillUnmount = () => {
    emitter.remove_listener('fetch_history', this.fetch_history);
    emitter.remove_listener('clear_history', this.clear_history);
    emitter.remove_listener('new_test', this.new_test);
  };

  persist_history = async () => {
    let {history} = this.state;
    await AsyncStorage.setItem('history', JSON.stringify(history));
  };

  load_history = async () => {
    let history = await AsyncStorage.getItem('history');
    if (history) history = JSON.parse(history);
    else history = new Array();

    return history;
  };

  render = () => {
    let {loading, netinfo, history, location} = this.state;

    return (
      <NavigationContainer>
        <SafeAreaView collapsable={false} style={{flex: 1}}>
          {loading ? (
            <Splash />
          ) : (
            <App_data.Provider
              value={{
                netinfo,
                refresh_network: this.refresh_network,
                location,
              }}>
              <Test_history.Provider value={{history}}>
                <SafeAreaView style={{flex: 1}}>
                  <App_stack_entry />
                </SafeAreaView>
              </Test_history.Provider>
            </App_data.Provider>
          )}
        </SafeAreaView>
      </NavigationContainer>
    );
  };
}

export default Mins;
export {emitter};
