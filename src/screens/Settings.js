import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  toggle_super_user = () => this.setState({s_user: !this.state.s_user});

  render() {
    let {s_user} = this.state;

    return (
      <Bg_view
        flex
        style={{
          backgroundColor: '#006dbb',
        }}>
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
                <Icon
                  icon={require('./../assets/icons/logo_mins.png')}
                  style={{height: wp(25), width: wp(25)}}
                />
              </View>
            </Bg_view>
          </Bg_view>

          <Bg_view style={{margin: wp(5.6)}} no_bg>
            <Bg_view horizontal no_bg>
              <Fr_text bold size={wp(5)} color="#fff">
                Super User Mode
              </Fr_text>

              <TouchableOpacity
                onPress={this.toggle_super_user}
                style={{paddingLeft: wp(4)}}>
                <Fontisto
                  name={s_user ? 'toggle-off' : 'toggle-on'}
                  color="#fff"
                  size={wp(10)}
                />
              </TouchableOpacity>
            </Bg_view>

            <Bg_view no_bg>
              <Fr_text
                size={wp(3.5)}
                style={{width: wp(75), marginTop: hp(1.4)}}
                color="#fff">
                Help us take many more readings monthly by becoming a super user{' '}
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
      </Bg_view>
    );
  }
}

export default Settings;
