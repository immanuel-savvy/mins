import React from 'react';
import Bg_view from './bg_view';
import Fr_text from './fr_text';
import Ping from 'react-native-ping';
import {hp, wp} from '../utils/dimensions';
import RNSpeedometer from 'react-native-speedometer';
import {CountUp} from 'use-count-up';
import Text_btn from './text_btn';
import {TouchableWithoutFeedback, View} from 'react-native';
import {emitter} from '../../Mins';
import {App_data} from '../../Contexts';
import {labels} from '../utils/speedo_labels';
import {bps_to_mbps} from '../utils/functions';

class Speed_stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 25,
    };
  }

  componentDidMount = () => {};

  begin_measure = () => {
    this.previous_stats = this.state.traffic_stats
      ? {...this.state.traffic_stats}
      : null;
    this.setState(
      {did_start: true, starting: true, traffic_stats: null},
      async () => {
        this.refresh_network();
        let latency;

        try {
          const ms = await Ping.start('8.8.8.8', {timeout: 1000});
          console.log(ms);
          latency = ms / 2;
          this.prev_latency = latency;
        } catch (error) {
          console.log('special code', error.code, error.message);
          latency = this.prev_latency;
        }

        const value = await Ping.getTrafficStats('8.8.8.8');

        console.log(value);
        let {
          receivedNetworkSpeed,
          sendNetworkSpeed,
          receivedNetworkTotal,
          sendNetworkTotal,
        } = value;

        let traffic_stats = {
          receivedNetworkSpeed: parseInt(receivedNetworkSpeed, 10),
          sendNetworkSpeed: parseInt(sendNetworkSpeed, 10),
          receivedNetworkTotal: parseInt(receivedNetworkTotal, 10),
          sendNetworkTotal: parseInt(sendNetworkTotal, 10),
        };

        if (
          !traffic_stats.receivedNetworkSpeed ||
          !traffic_stats.sendNetworkSpeed ||
          !traffic_stats.receivedNetworkTotal ||
          !traffic_stats.sendNetworkTotal
        ) {
          return this.begin_measure();
        } else this.previous_stats = traffic_stats;

        traffic_stats.latency = Number(
          (
            latency ||
            (traffic_stats.receivedNetworkTotal * 1024 * 1024) /
              traffic_stats.receivedNetworkSpeed /
              1000
          ).toFixed(2),
        );

        console.log(traffic_stats);
        this.setState(
          {
            traffic_stats,
            starting: false,
          },
          () => emitter.emit('new_test', traffic_stats),
        );
      },
    );
  };

  render() {
    let {start} = this.props;
    let {did_start, traffic_stats, starting} = this.state;

    return (
      <App_data.Consumer>
        {({refresh_network}) => {
          this.refresh_network = refresh_network;

          return (
            <Bg_view flex no_bg style={{paddingVertical: 40}}>
              {!did_start ? null : (
                <Bg_view
                  horizontal
                  no_bg
                  style={{justifyContent: 'space-around'}}>
                  <Bg_view no_bg>
                    <Fr_text style={{color: '#fff', fontSize: 18}}>
                      Download
                    </Fr_text>

                    <Fr_text style={{fontSize: 30}} bold accent>
                      {traffic_stats ? (
                        <CountUp
                          isCounting={!!traffic_stats}
                          end={
                            bps_to_mbps(traffic_stats?.receivedNetworkSpeed) ||
                            0
                          }
                          duration={3.2}
                        />
                      ) : (
                        '0.00'
                      )}
                    </Fr_text>
                    <Fr_text style={{color: '#fff', fontSize: 18}}>
                      Mbps
                    </Fr_text>
                  </Bg_view>
                  <Bg_view no_bg>
                    <Fr_text style={{color: '#fff', fontSize: 18}}>
                      Upload
                    </Fr_text>
                    <Fr_text style={{fontSize: 30}} bold accent>
                      {traffic_stats ? (
                        <CountUp
                          isCounting={!!traffic_stats}
                          end={
                            bps_to_mbps(traffic_stats?.sendNetworkSpeed) || 0
                          }
                          duration={3.2}
                        />
                      ) : (
                        '0.00'
                      )}
                    </Fr_text>
                    <Fr_text style={{color: '#fff', fontSize: 18}}>
                      Mbps
                    </Fr_text>
                  </Bg_view>
                  <Bg_view no_bg>
                    <Fr_text style={{color: '#fff', fontSize: 18}}>
                      Latency
                    </Fr_text>
                    <Fr_text style={{fontSize: 30}} bold accent>
                      {traffic_stats ? (
                        <CountUp
                          isCounting={!!traffic_stats}
                          end={traffic_stats?.latency || 0}
                          duration={3.2}
                        />
                      ) : (
                        '0.00'
                      )}
                    </Fr_text>
                    <Fr_text style={{color: '#fff', fontSize: 18}}>ms</Fr_text>
                  </Bg_view>
                </Bg_view>
              )}

              <Bg_view style={{minHeight: hp(did_start ? 40 : 15)}} no_bg>
                {traffic_stats ? (
                  <>
                    <Bg_view
                      style={{alignSelf: 'center', marginTop: hp(10)}}
                      no_bg>
                      <Bg_view no_bg>
                        <RNSpeedometer
                          labels={labels}
                          value={
                            (bps_to_mbps(traffic_stats.receivedNetworkSpeed) +
                              bps_to_mbps(traffic_stats.sendNetworkSpeed)) /
                            2
                          }
                          labelStyle={{color: '#f9f059'}}
                          defaultValue={0}
                          size={wp(75)}
                          maxValue={75}
                          allowedDecimals={2}
                        />
                      </Bg_view>
                    </Bg_view>
                  </>
                ) : (
                  <Bg_view
                    flex
                    no_bg
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableWithoutFeedback
                      style={{
                        height: wp(50),
                        width: wp(50),
                        borderRadius: wp(50),
                      }}
                      onPress={() => {
                        start();
                        this.begin_measure();
                      }}>
                      <View>
                        <Bg_view
                          shadowed
                          style={{
                            height: wp(45),
                            width: wp(45),
                            borderRadius: wp(45),
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 10,
                            shadowColor: '#000',
                            backgroundColor: '#efffdf',
                          }}>
                          <Fr_text
                            style={{
                              textTransform: 'uppercase',
                              fontSize: wp(starting ? 5 : 7.5),
                            }}>
                            {starting ? 'Starting...' : 'start'}
                          </Fr_text>
                        </Bg_view>
                      </View>
                    </TouchableWithoutFeedback>
                  </Bg_view>
                )}
              </Bg_view>
              {did_start && traffic_stats ? (
                <Bg_view style={{alignItems: 'center', marginTop: hp(2)}} no_bg>
                  <Text_btn
                    text="Run again!"
                    accent
                    bold
                    action={this.begin_measure}
                    centralise
                  />
                </Bg_view>
              ) : null}
            </Bg_view>
          );
        }}
      </App_data.Consumer>
    );
  }
}

export default Speed_stats;
