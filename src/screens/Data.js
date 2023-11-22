import React from 'react';
import Bg_view from '../components/bg_view';
import {hp, wp} from '../utils/dimensions';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  View,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';
import RadialGradient from 'react-native-radial-gradient';
import Icon from '../components/icon';
import {Server} from '../../Mins';
import List_empty from '../components/listempty';
import Fr_text from '../components/fr_text';
import Cool_modal from '../components/cool_modal';
import Historic from '../components/historic';
import Feather from 'react-native-vector-icons/Feather';

class Data extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let locations = await fetch(`${Server}/locations`);
    locations = await locations.json();

    this.setState({locations});
  };

  location_tests = location => {
    this.setState({location_in_focus: location}, this.toggle_history);
  };

  toggle_history = () => this.history?.toggle();

  render() {
    let {navigation} = this.props;
    let {locations, location_in_focus} = this.state;

    return (
      <RadialGradient
        style={{flex: 1}}
        colors={['#019cff', '#006dbb']}
        stops={[0.1, 1]}
        center={[wp(50), hp(50)]}
        radius={wp(75)}>
        <Bg_view
          flex
          no_bg
          style={{
            backgroundColor: '#006dbb',
          }}>
          <StatusBar barStyle="light-content" backgroundColor="#006dbb" />
          <Bg_view no_bg>
            <Bg_view
              horizontal
              no_bg
              style={{
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingHorizontal: wp(4),
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                <TouchableNativeFeedback onPress={navigation.goBack}>
                  <View style={{padding: wp(2.8)}}>
                    <Feather name="chevron-left" color="#fff" size={wp(7.5)} />
                  </View>
                </TouchableNativeFeedback>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity>
                  <Icon
                    icon={require('./../assets/icons/logo_mins.png')}
                    style={{height: wp(25), width: wp(25)}}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}} />
            </Bg_view>
          </Bg_view>

          <Bg_view
            flex
            no_bg
            style={{
              margin: wp(4),
              paddingTop: wp(2.8),
              borderRadius: wp(2.8),
            }}>
            <ScrollView showVerticalScrollIndicator={false}>
              {!locations ? (
                <Bg_view style={{borderRadius: wp(2.8), padding: wp(4)}}>
                  <ActivityIndicator color="#006dbb" size="large" />
                </Bg_view>
              ) : locations.length ? (
                locations.map((location, l) => {
                  return (
                    <TouchableNativeFeedback
                      key={l}
                      onPress={() => this.location_tests(location)}>
                      <View>
                        <Bg_view
                          horizontal
                          style={{
                            borderBottomWidth: 4,
                            borderBottomColor: '#006dbb',
                            paddingVertical: hp(1.4),
                            paddingHorizontal: wp(2.8),
                            minHeight: hp(7.5),
                            borderRadius: wp(2.8),
                          }}>
                          <Bg_view
                            no_bg
                            flex
                            style={{
                              justifyContent: 'center',
                              paddingLeft: wp(1.4),
                            }}>
                            <Fr_text capitalise bold centralise size={wp(4)}>
                              {location.replace(/\-/g, ' ')}
                            </Fr_text>
                          </Bg_view>
                        </Bg_view>
                      </View>
                    </TouchableNativeFeedback>
                  );
                })
              ) : (
                <List_empty
                  style={{borderRadius: wp(4)}}
                  text="No test history yet."
                />
              )}
            </ScrollView>
          </Bg_view>
        </Bg_view>

        <Cool_modal flex no_swipe ref={history => (this.history = history)}>
          <Bg_view flex accent>
            <Bg_view horizontal style={{justifyContent: 'space-between'}}>
              <Fr_text capitalise bold size={wp(4.5)} style={{margin: wp(2.8)}}>
                {location_in_focus?.replace(/\-/g, ' ')}
              </Fr_text>
              <TouchableNativeFeedback onPress={this.toggle_history}>
                <View style={{padding: wp(2.8)}}>
                  <Feather name="chevron-down" color="#006dbb" size={wp(7.5)} />
                </View>
              </TouchableNativeFeedback>
            </Bg_view>

            <Historic
              location={location_in_focus}
              toggle={this.toggle_history}
            />
          </Bg_view>
        </Cool_modal>
      </RadialGradient>
    );
  }
}

export default Data;
