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
    let {did_start} = this.props;

    return (
      <App_data.Consumer>
        {({netinfo, location, isp}) => {
          netinfo = netinfo ? {...netinfo, ...isp} : netinfo;

          return (
            <Bg_view
              no_bg
              flex={4}
              style={{
                borderBottomColor: '#fff',
                borderBottomWidth: 2,
                padding: 20,
                paddingBottom: 25,
                marginBottom: 10,
              }}>
              <Bg_view
                no_bg
                horizontal
                no_centralise
                style={{
                  justifyContent: 'space-between',
                }}>
                <Bg_view no_bg horizontal flex>
                  <Icon
                    icon={require('./../assets/icons/antenna.jpeg')}
                    style={{height: wp(15), width: wp(15)}}
                  />

                  <Bg_view no_bg flex>
                    <Bg_view
                      no_bg
                      horizontal
                      style={{justifyContent: 'space-between'}}>
                      <Bg_view no_bg style={{marginLeft: 10}} flex>
                        <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                          {'Sim 1'}
                        </Fr_text>
                        <Fr_text
                          numberOfLines={1}
                          capitalise
                          style={{
                            color: '#fff',
                            fontSize: 18,
                            marginVertical: hp(0.4),
                          }}>
                          {netinfo?.radio['Sim 1']?.Net?.operator}
                        </Fr_text>
                        <Fr_text style={{color: '#fff', fontSize: 18}}>
                          {netinfo?.radio['Sim 1']?.NetworkType}
                        </Fr_text>
                      </Bg_view>

                      {netinfo?.radio['Sim 2']?.NetworkType ? (
                        <Bg_view
                          no_bg
                          style={{marginRight: 10, alignSelf: 'flex-end'}}
                          flex>
                          <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                            Sim 2
                          </Fr_text>
                          <Fr_text
                            style={{
                              color: '#fff',
                              fontSize: 18,
                              marginVertical: hp(0.4),
                            }}
                            capitalise>
                            {netinfo?.radio['Sim 2']?.Net?.operator}
                          </Fr_text>
                          <Fr_text style={{color: '#fff', fontSize: 16}}>
                            {netinfo?.radio['Sim 2']?.NetworkType}
                          </Fr_text>
                        </Bg_view>
                      ) : null}
                    </Bg_view>
                    {did_start ? (
                      <Bg_view
                        no_bg
                        style={{marginLeft: 10, marginVertical: 20}}
                        horizontal>
                        <Fr_text
                          color="#fff"
                          bold
                          size={wp(5.6)}
                          style={{
                            marginRight: 10,
                            borderRightColor: '#fff',
                            borderRightWidth: 1.2,
                            paddingRight: 10,
                          }}>
                          {netinfo?.type === 'wifi' ? 'WIFI' : 'Mobile Data'}
                        </Fr_text>

                        <Fr_text
                          color="#fff"
                          size={wp(5.6)}
                          bold
                          style={{marginLeft: 0}}>
                          {netinfo?.isp?.split(' ')[0]}
                        </Fr_text>
                      </Bg_view>
                    ) : null}
                    <Bg_view no_bg>
                      <Bg_view
                        no_bg
                        horizontal
                        style={{
                          marginLeft: 10,
                          marginBottom: hp(2),
                          marginTop: did_start ? null : hp(2),
                        }}>
                        <Feather name="map-pin" size={wp(5.6)} color="#fff" />
                        <Fr_text
                          numberOfLines={1}
                          style={{color: '#fff', fontSize: 18}}>
                          {location?.locality
                            ? ` ${location.locality}, ${location.city}`
                            : '  ...'}
                        </Fr_text>
                      </Bg_view>
                    </Bg_view>
                  </Bg_view>
                </Bg_view>
              </Bg_view>
            </Bg_view>
          );
        }}
      </App_data.Consumer>
    );
  }
}

export default Speed_header;
