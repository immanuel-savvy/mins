import React from 'react';
import Bg_view from './bg_view';
import {hp, wp} from '../utils/dimensions';
import Fr_text from './fr_text';
import Icon from './icon';
import {App_data} from '../../Contexts';
import {data_sim, net_type} from '../screens/Speed';

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

          let sim2 = data_sim(netinfo, true);

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
              <Bg_view no_bg horizontal flex={6}>
                <Icon
                  icon={require('./../assets/icons/antenna.jpeg')}
                  style={{height: wp(15), width: wp(15)}}
                />

                <Bg_view no_bg style={{marginLeft: 10}} flex>
                  <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                    {!netinfo
                      ? '-'
                      : netinfo?.type === 'wifi'
                      ? 'Wifi'
                      : 'Data SIM'}
                  </Fr_text>
                  <Fr_text
                    numberOfLines={1}
                    style={{
                      color: '#fff',
                      fontSize: 18,
                    }}>
                    {!netinfo
                      ? ''
                      : netinfo.isp?.split(' ')[0] ||
                        netinfo?.details?.carrier ||
                        ``}
                  </Fr_text>
                  <Fr_text style={{color: '#fff', fontSize: 18}}>
                    {net_type(netinfo)}
                  </Fr_text>
                  <Fr_text
                    numberOfLines={1}
                    style={{color: '#fff', fontSize: 18}}>
                    {location?.locality
                      ? `${location.locality}, ${location.city}`
                      : '...'}
                  </Fr_text>
                </Bg_view>
              </Bg_view>
              <Bg_view no_bg style={{marginRight: 10}} flex={3}>
                <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                  Connection
                </Fr_text>
                <Fr_text style={{color: '#fff', fontSize: 18}} capitalise>
                  {netinfo?.type}
                </Fr_text>
                {netinfo?.type === 'wifi' ? (
                  <>
                    <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                      Frequency
                    </Fr_text>
                    <Fr_text style={{color: '#fff', fontSize: 16}} capitalise>
                      {netinfo?.details.frequency}
                    </Fr_text>
                  </>
                ) : netinfo.radio['Sim 2']?.Net?.cellIdentity ? (
                  <>
                    <Fr_text
                      style={{color: '#fff', fontSize: 16, marginTop: hp(0.7)}}
                      bold>
                      Dual Sim
                    </Fr_text>
                    <Fr_text style={{color: '#fff', fontSize: 16}} capitalise>
                      {sim2.Net.operator} ({sim2.NetworkType})
                    </Fr_text>
                  </>
                ) : null}
              </Bg_view>
            </Bg_view>
          );
        }}
      </App_data.Consumer>
    );
  }
}

export default Speed_header;
