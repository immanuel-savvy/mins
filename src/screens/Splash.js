import React from 'react';
import {StatusBar} from 'react-native';
import Bg_view from '../components/bg_view';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';

class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Bg_view
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#006dbb',
        }}>
        <StatusBar hidden />
        <Icon
          icon={require('../assets/icons/logo_mins.png')}
          style={{height: hp(25), width: wp(50)}}
        />
      </Bg_view>
    );
  };
}

export default Splash;
