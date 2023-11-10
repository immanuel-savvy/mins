import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import {ActivityIndicator, ScrollView, StatusBar} from 'react-native';
import {App_data, Networks_data} from '../../Contexts';
import List_empty from '../components/listempty';
import {bps_to_mbps} from '../utils/functions';
import {net_type} from './Speed';

class Networks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  headers = new Array(
    'Operator',
    'Download (Mbps)',
    'Upload (Mbps)',
    'Latency (ms)',
  );

  componentDidMount = () => {
    this.load_networks();
  };

  render() {
    return (
      <Networks_data.Consumer>
        {({load_networks, networks, loaded_networks}) => {
          this.load_networks = load_networks;

          return (
            <App_data.Consumer>
              {({location}) => {
                return (
                  <Bg_view
                    flex
                    style={{
                      backgroundColor: '#006dbb',
                    }}>
                    <StatusBar
                      barStyle="light-content"
                      backgroundColor="#006dbb"
                    />
                    <Bg_view style={{alignItems: 'center'}} no_bg>
                      <Icon
                        icon={require('./../assets/icons/logo_mins.png')}
                        style={{height: wp(25), width: wp(25)}}
                      />
                    </Bg_view>

                    <Bg_view no_bg style={{padding: wp(4)}}>
                      <Fr_text bold style={{fontSize: wp(7.5)}} color="#fff">
                        Network Stats
                      </Fr_text>
                      <Fr_text color="#fff">
                        The average speeds users experienced in this area.
                      </Fr_text>
                    </Bg_view>
                    <ScrollView showVerticalScrollIndicator={false}>
                      <Bg_view
                        style={{
                          margin: wp(4),
                          paddingTop: wp(2.8),
                          borderRadius: wp(2.8),
                        }}>
                        <Bg_view
                          horizontal
                          no_bg
                          style={{
                            borderBottomWidth: 4,
                            borderBottomColor: '#006dbb',
                            paddingVertical: hp(1.4),
                            paddingHorizontal: wp(2.8),
                            minHeight: hp(10),
                          }}>
                          {this.headers.map((n, i) => {
                            return (
                              <Bg_view
                                no_bg
                                key={i}
                                flex
                                style={{alignItems: 'center'}}>
                                <Fr_text bold size={wp(4)}>
                                  {n}
                                </Fr_text>
                              </Bg_view>
                            );
                          })}
                        </Bg_view>
                        {!loaded_networks ? (
                          <Bg_view no_bg style={{padding: wp(4)}}>
                            <ActivityIndicator color="#006dbb" size="large" />
                          </Bg_view>
                        ) : networks.length ? (
                          networks.map((net, j) => {
                            return (
                              <Bg_view
                                horizontal
                                no_bg
                                key={j}
                                style={{
                                  borderBottomWidth: 4,
                                  borderBottomColor: '#006dbb',
                                  paddingVertical: hp(1.4),
                                  paddingHorizontal: wp(2.8),
                                  minHeight: hp(10),
                                }}>
                                <Bg_view
                                  no_bg
                                  flex
                                  style={{alignItems: 'center'}}>
                                  <Fr_text size={wp(4.5)}>
                                    {`${
                                      net.netinfo?.details?.carrier ||
                                      net.netinfo?.details?.ssid
                                    } (${net_type(net.netinfo, true, 'Mbps')})`}
                                  </Fr_text>
                                </Bg_view>
                                <Bg_view
                                  no_bg
                                  flex
                                  style={{alignItems: 'center'}}>
                                  <Fr_text size={wp(4.5)}>
                                    {net.download_speed}
                                  </Fr_text>
                                </Bg_view>
                                <Bg_view
                                  no_bg
                                  flex
                                  style={{alignItems: 'center'}}>
                                  <Fr_text size={wp(4.5)}>
                                    {net.upload_speed}
                                  </Fr_text>
                                </Bg_view>
                                <Bg_view
                                  no_bg
                                  flex
                                  style={{alignItems: 'center'}}>
                                  <Fr_text bold={!j} size={wp(j ? 4.5 : 4)}>
                                    {net.latency}
                                  </Fr_text>
                                </Bg_view>
                              </Bg_view>
                            );
                          })
                        ) : (
                          <List_empty
                            style={{borderRadius: wp(4)}}
                            text="No test networks yet."
                          />
                        )}
                      </Bg_view>
                    </ScrollView>

                    <Fr_text style={{margin: wp(4), color: '#fff'}}>
                      Location:{' '}
                      <Fr_text bold color="#fff">
                        {location
                          ? `${location.locality}, ${location.city}`
                          : '...'}
                      </Fr_text>
                    </Fr_text>
                  </Bg_view>
                );
              }}
            </App_data.Consumer>
          );
        }}
      </Networks_data.Consumer>
    );
  }
}

export default Networks;
