import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import Icon from '../components/icon';
import {wp} from '../utils/dimensions';
import {TouchableWithoutFeedback, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class Speed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Bg_view
        flex
        style={{
          backgroundColor: '#006dbb',
        }}>
        <Bg_view
          no_bg
          horizontal
          style={{
            justifyContent: 'space-between',
            padding: 20,
            borderBottomColor: '#fff',
            borderBottomWidth: 2,
          }}>
          <Bg_view no_bg horizontal>
            {/* <MaterialCommunityIcons name="antenna" color="#fff" size={wp(20)} /> */}
            <Icon
              icon={require('./../assets/icons/antenna.jpeg')}
              style={{height: wp(15), width: wp(15)}}
            />

            <Bg_view no_bg style={{marginLeft: 10}}>
              <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                4G
              </Fr_text>
              <Fr_text style={{color: '#fff', fontSize: 18}}>9 mobile</Fr_text>
            </Bg_view>
          </Bg_view>
          <Bg_view no_bg style={{marginRight: 40}}>
            <Fr_text style={{color: '#fff', fontSize: 18}} bold>
              2G
            </Fr_text>
            <Fr_text style={{color: '#fff', fontSize: 18}}>MTN</Fr_text>
          </Bg_view>
        </Bg_view>
        <Bg_view no_bg style={{paddingTop: 40, paddingHorizontal: 20}}>
          <Fr_text style={{fontSize: 32, color: '#fff'}}>
            Test your data{' '}
            <Fr_text style={{fontSize: 32, color: '#fc3'}}>Connection</Fr_text>
          </Fr_text>
        </Bg_view>

        <Bg_view
          flex
          no_bg
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableWithoutFeedback
            style={{height: wp(50), width: wp(50), borderRadius: wp(50)}}
            onPress={this.start}>
            <View>
              <Bg_view
                shadowed
                style={{
                  height: wp(45),
                  width: wp(45),
                  borderRadius: wp(45),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#efffdf',
                }}>
                <Fr_text style={{textTransform: 'uppercase', fontSize: 40}}>
                  start
                </Fr_text>
              </Bg_view>
            </View>
          </TouchableWithoutFeedback>
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Speed;
