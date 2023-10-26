import React from 'react';
import {StatusBar} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Fr_text from '../components/fr_text';
import Bg_view from '../components/bg_view';
import Icon from '../components/icon';

class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Bg_view
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <StatusBar hidden />
        {/* <Icon
          icon={require('../assets/Icons/udara_logo.png')}
          style={{height: hp(10), width: wp(50)}}
        /> */}

        <Fr_text>MINS</Fr_text>
      </Bg_view>
    );
  };
}

export default Splash;
