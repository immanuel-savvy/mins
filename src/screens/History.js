import React from 'react';
import Bg_view from '../components/bg_view';
import {ScrollView, View} from 'react-native';
import Icon from '../components/icon';
import {wp} from '../utils/dimensions';
import Fr_text from '../components/fr_text';

class History extends React.Component {
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
        <ScrollView showVerticalScrollIndicator={false}>
          <Bg_view
            horizontal
            no_bg
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingHorizontal: wp(4),
            }}>
            <View style={{flex: 1}} />
            <View style={{flex: 1, alignItems: 'center'}}>
              <Icon
                icon={require('./../assets/icons/logo_mins.png')}
                style={{height: wp(25), width: wp(25)}}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                height: '50%',
              }}>
              <Fr_text color="#fff">Clear history</Fr_text>
            </View>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default History;
