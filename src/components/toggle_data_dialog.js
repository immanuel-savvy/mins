import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './bg_view';
import Fr_text from './fr_text';
import {TouchableNativeFeedback, View} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Small_btn from './small_button';

class Data_dialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let {toggle, proceed} = this.props;

    return (
      <Bg_view no_bg>
        <Bg_view
          style={{
            elevation: 5,
            shadowColor: '#000',
            padding: wp(4),
            borderRadius: wp(2.8),
            marginBottom: hp(1.4),
            marginHorizontal: wp(2.8),
          }}>
          <Bg_view horizontal style={{justifyContent: 'space-between'}}>
            <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
              Data View
            </Fr_text>
            <TouchableNativeFeedback onPress={toggle}>
              <View style={{padding: wp(2.8)}}>
                <EvilIcons name="close" color="#006dbb" size={wp(7.5)} />
              </View>
            </TouchableNativeFeedback>
          </Bg_view>

          <Fr_text style={{marginTop: hp(4), marginBottom: hp(2.8)}} centralise>
            See all test data by Locations
          </Fr_text>

          <Bg_view horizontal style={{justifyContent: 'center'}}>
            <Small_btn
              title="Proceed"
              action={() => {
                proceed(), toggle();
              }}
            />
            <Small_btn title="Close" inverted action={toggle} />
          </Bg_view>
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Data_dialog;
