import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import {ScrollView, StatusBar, TouchableOpacity, View} from 'react-native';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {App_data} from '../../Contexts';
import Cool_modal from '../components/cool_modal';
import Confirm_superuser from '../components/confirm_superuser';
import RadialGradient from 'react-native-radial-gradient';
import Data_dialog from '../components/toggle_data_dialog';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  close = () => this.close_modal?.toggle();

  toggle_data = () => this.data_modal?.toggle();

  render() {
    let {navigation} = this.props;

    return (
      <App_data.Consumer>
        {({superuser, toggle_super_user}) => {
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
                <ScrollView
                  contentContainerStyle={{flex: 1}}
                  showVerticalScrollIndicator={false}>
                  <Bg_view no_bg>
                    <Bg_view
                      horizontal
                      no_bg
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: wp(4),
                      }}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <TouchableOpacity onLongPress={this.toggle_data}>
                          <Icon
                            icon={require('./../assets/icons/logo_mins.png')}
                            style={{height: wp(25), width: wp(25)}}
                          />
                        </TouchableOpacity>
                      </View>
                    </Bg_view>
                  </Bg_view>

                  <Bg_view style={{margin: wp(5.6)}} no_bg>
                    <Bg_view horizontal no_bg>
                      <Fr_text bold size={wp(5)} color="#fff">
                        Super User Mode
                      </Fr_text>

                      <TouchableOpacity
                        onPress={superuser ? toggle_super_user : this.close}
                        style={{paddingLeft: wp(4)}}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Fontisto
                            name={superuser ? 'toggle-off' : 'toggle-on'}
                            color="#fff"
                            size={wp(10)}
                          />
                          <Fr_text style={{color: '#fff', marginLeft: 10}} bold>
                            {superuser ? 'ON' : 'OFF'}
                          </Fr_text>
                        </View>
                      </TouchableOpacity>
                    </Bg_view>

                    <Bg_view no_bg>
                      <Fr_text
                        size={wp(3.5)}
                        style={{width: wp(75), marginTop: hp(1.4)}}
                        color="#fff">
                        Help us take many more readings monthly by becoming a
                        super user{' '}
                      </Fr_text>
                      <TouchableOpacity>
                        <Fr_text
                          style={{
                            fontSize: wp(3.5),
                            color: '#fff',
                            textDecorationLine: 'underline',
                          }}>
                          Learn More
                        </Fr_text>
                      </TouchableOpacity>
                    </Bg_view>
                    <Bg_view style={{marginVertical: hp(4)}} no_bg horizontal>
                      <Fr_text bold size={wp(5)} color="#fff">
                        Rate
                      </Fr_text>
                      <AntDesign
                        style={{marginLeft: wp(2.8)}}
                        name="like1"
                        color="#fff"
                        size={wp(5)}
                      />
                    </Bg_view>
                  </Bg_view>
                </ScrollView>

                <Cool_modal
                  ref={close_modal => (this.close_modal = close_modal)}>
                  <Confirm_superuser
                    toggle={this.close}
                    proceed={toggle_super_user}
                  />
                </Cool_modal>

                <Cool_modal ref={data_modal => (this.data_modal = data_modal)}>
                  <Data_dialog
                    toggle={this.toggle_data}
                    proceed={() => {
                      // toggle_show_data()
                      navigation.navigate('data');
                    }}
                  />
                </Cool_modal>
              </Bg_view>
            </RadialGradient>
          );
        }}
      </App_data.Consumer>
    );
  }
}

export default Settings;
