import React from 'react';
import Bg_view from './bg_view';
import {wp} from '../utils/dimensions';
import Fr_text from './fr_text';
import Icon from './icon';

class Speed_header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Bg_view
        no_bg
        horizontal
        no_centralise
        style={{
          justifyContent: 'space-between',
          padding: 20,
          borderBottomColor: '#fff',
          borderBottomWidth: 2,
        }}>
        <Bg_view no_bg horizontal>
          <Icon
            icon={require('./../assets/icons/antenna.jpeg')}
            style={{height: wp(15), width: wp(15)}}
          />

          <Bg_view no_bg style={{marginLeft: 10}}>
            <Fr_text style={{color: '#fff', fontSize: 18}} bold>
              Data SIM
            </Fr_text>
            <Fr_text style={{color: '#fff', fontSize: 18}}>4G</Fr_text>
            <Fr_text style={{color: '#fff', fontSize: 18}}>9 mobile</Fr_text>
            <Fr_text style={{color: '#fff', fontSize: 18}}>
              Location: Surulere
            </Fr_text>
          </Bg_view>
        </Bg_view>
        <Bg_view no_bg style={{marginRight: 20}}>
          <Fr_text style={{color: '#fff', fontSize: 18}} bold>
            Connection
          </Fr_text>
          <Fr_text style={{color: '#fff', fontSize: 18}}>Mobile data</Fr_text>
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Speed_header;
