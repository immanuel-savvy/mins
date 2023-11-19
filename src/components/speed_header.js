import React from 'react';
import Bg_view from './bg_view';
import {hp, wp} from '../utils/dimensions';
import Fr_text from './fr_text';
import Icon from './icon';
import {App_data} from '../../Contexts';
import Feather from 'react-native-vector-icons/Feather';

class Speed_header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {};

  render() {
    return (
      <App_data.Consumer>
        {({netinfo, location, isp}) => {
          netinfo = netinfo ? {...netinfo, ...isp} : netinfo;

          return (
            <Bg_view
              no_bg
              style={{
                borderBottomColor: '#fff',
                borderBottomWidth: 2,
                padding: 20,
                paddingBottom: 5,
              }}>
              <Bg_view
                no_bg
                horizontal
                no_centralise
                style={{
                  justifyContent: 'space-between',
                }}>
                <Bg_view no_bg horizontal flex={6}>
                  <Icon
                    icon={require('./../assets/icons/antenna.jpeg')}
                    style={{height: wp(15), width: wp(15)}}
                  />

                  <Bg_view no_bg style={{marginLeft: 10}} flex>
                    <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                      {'Sim 1'}
                    </Fr_text>
                    <Fr_text
                      numberOfLines={1}
                      style={{
                        color: '#fff',
                        fontSize: 18,
                      }}>
                      {netinfo?.radio['Sim 1']?.Net.operator}
                    </Fr_text>
                    <Fr_text style={{color: '#fff', fontSize: 18}}>
                      {netinfo?.radio['Sim 1']?.NetworkType}
                    </Fr_text>
                  </Bg_view>
                </Bg_view>
                {netinfo?.radio['Sim 2']?.NetworkType ? (
                  <Bg_view no_bg style={{marginRight: 10}} flex={3}>
                    <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                      Sim 2
                    </Fr_text>
                    <Fr_text style={{color: '#fff', fontSize: 18}} capitalise>
                      {netinfo?.radio['Sim 2']?.Net.operator}
                    </Fr_text>
                    <Fr_text style={{color: '#fff', fontSize: 16}} capitalise>
                      {netinfo?.radio['Sim 2']?.NetworkType}
                    </Fr_text>
                  </Bg_view>
                ) : null}
              </Bg_view>

              <Bg_view
                style={{
                  height: hp(4),
                  justifyContent: 'space-between',
                  borderTopWidth: 0,
                  borderTopColor: '#ccc',
                  marginBottom: 5,
                }}
                horizontal
                no_bg>
                <Bg_view no_bg>
                  <Fr_text style={{color: '#fff', fontSize: 16}} capitalise>
                    ISP:{' '}
                    <Fr_text color="#fff" bold>
                      {netinfo?.isp?.split(' ')[0]}
                    </Fr_text>
                  </Fr_text>
                </Bg_view>

                <Bg_view no_bg>
                  <Fr_text style={{color: '#fff', fontSize: 16}} capitalise>
                    Connection Type:{' '}
                    <Fr_text color="#fff" bold>
                      {netinfo?.type === 'wifi' ? 'WIFI' : 'Mobile Data'}
                    </Fr_text>
                  </Fr_text>
                </Bg_view>
              </Bg_view>

              <Bg_view no_bg horizontal>
                <Feather name="map-pin" size={wp(5.6)} color="#fff" />
                <Fr_text
                  numberOfLines={1}
                  style={{color: '#fff', fontSize: 18}}>
                  {location?.locality
                    ? `  ${location.locality}, ${location.city}`
                    : '  ...'}
                </Fr_text>
              </Bg_view>
            </Bg_view>
          );
        }}
      </App_data.Consumer>
    );
  }
}

export default Speed_header;
