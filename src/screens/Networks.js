import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import Icon from '../components/icon';
import {wp} from '../utils/dimensions';

class Networks extends React.Component {
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
        <Bg_view flex no_bg style={{paddingVertical: 40}}>
          <Bg_view horizontal no_bg style={{justifyContent: 'space-around'}}>
            <Bg_view no_bg>
              <Fr_text style={{color: '#fff', fontSize: 18}}>Download</Fr_text>
              <Fr_text style={{color: '#fc3', fontSize: 30}} bold>
                5.04
              </Fr_text>
              <Fr_text style={{color: '#fff', fontSize: 18}}>Mbps</Fr_text>
            </Bg_view>
            <Bg_view no_bg>
              <Fr_text style={{color: '#fff', fontSize: 18}}>Upload</Fr_text>
              <Fr_text style={{color: '#fc3', fontSize: 30}} bold>
                9.33
              </Fr_text>
              <Fr_text style={{color: '#fff', fontSize: 18}}>Mbps</Fr_text>
            </Bg_view>
            <Bg_view no_bg>
              <Fr_text style={{color: '#fff', fontSize: 18}}>Latency</Fr_text>
              <Fr_text style={{color: '#fc3', fontSize: 30}} bold>
                45
              </Fr_text>
              <Fr_text style={{color: '#fff', fontSize: 18}}>ms</Fr_text>
            </Bg_view>
          </Bg_view>

          <Bg_view style={{alignSelf: 'center'}} no_bg>
            <Icon
              icon={require('./../assets/icons/meter.gif')}
              style={{height: wp(80), width: wp(80)}}
            />
          </Bg_view>
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Networks;
