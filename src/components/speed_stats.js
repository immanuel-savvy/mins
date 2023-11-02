import React from 'react';
import Bg_view from './bg_view';
import Fr_text from './fr_text';
import Ping from 'react-native-ping';
import {hp, wp} from '../utils/dimensions';
import RNSpeedometer from 'react-native-speedometer';
import {CountUp} from 'use-count-up';
import Text_btn from './text_btn';
import {TouchableNativeFeedback, View} from 'react-native';

class Speed_stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 25,
    };
  }

  begin_measure = () => {
    let {done} = this.props;
    this.setState({did_start: true, traffic_stats: null}, async () => {
      const {
        receivedNetworkSpeed,
        sendNetworkSpeed,
        receivedNetworkTotal,
        sendNetworkTotal,
      } = await Ping.getTrafficStats();

      this.setState({
        traffic_stats: {
          receivedNetworkSpeed: Number(receivedNetworkSpeed.slice(0, -3)),
          sendNetworkSpeed: Number(sendNetworkSpeed.slice(0, -3)),
          receivedNetworkTotal: Number(receivedNetworkTotal.slice(0, -2)),
          sendNetworkTotal: Number(sendNetworkTotal.slice(0, -2)),
        },
      });

      console.log(
        receivedNetworkSpeed,
        sendNetworkSpeed,
        receivedNetworkTotal,
        sendNetworkTotal,
      );
    });
  };

  bpsToMbps(bps) {
    if (!bps) return;
    // 1 Mbps is equal to 1,000,000 bits per second
    let mbps = bps / 10;
    return mbps;
  }

  componentDidMount = async () => {};

  render() {
    let {started, start} = this.props;
    let {did_start, value, traffic_stats} = this.state;

    return (
      <Bg_view flex no_bg style={{paddingVertical: 40}}>
        <Bg_view horizontal no_bg style={{justifyContent: 'space-around'}}>
          <Bg_view no_bg>
            <Fr_text style={{color: '#fff', fontSize: 18}}>Download</Fr_text>

            <Fr_text style={{color: '#fc3', fontSize: 30}} bold>
              <CountUp
                isCounting={!!traffic_stats}
                end={this.bpsToMbps(traffic_stats?.receivedNetworkSpeed) || 0}
                duration={3.2}
              />
            </Fr_text>
            <Fr_text style={{color: '#fff', fontSize: 18}}>Mbps</Fr_text>
          </Bg_view>
          <Bg_view no_bg>
            <Fr_text style={{color: '#fff', fontSize: 18}}>Upload</Fr_text>
            <Fr_text style={{color: '#fc3', fontSize: 30}} bold>
              <CountUp
                isCounting={!!traffic_stats}
                end={this.bpsToMbps(traffic_stats?.sendNetworkSpeed) || 0}
                duration={3.2}
              />
            </Fr_text>
            <Fr_text style={{color: '#fff', fontSize: 18}}>Mbps</Fr_text>
          </Bg_view>
          <Bg_view no_bg>
            <Fr_text style={{color: '#fff', fontSize: 18}}>Latency</Fr_text>
            <Fr_text style={{color: '#fc3', fontSize: 30}} bold>
              <CountUp
                isCounting={!!traffic_stats}
                end={
                  traffic_stats
                    ? parseInt(
                        traffic_stats.receivedNetworkTotal /
                          this.bpsToMbps(traffic_stats.receivedNetworkSpeed),
                      )
                    : 0
                }
                duration={3.2}
              />
            </Fr_text>
            <Fr_text style={{color: '#fff', fontSize: 18}}>ms</Fr_text>
          </Bg_view>
        </Bg_view>

        {traffic_stats ? (
          <Bg_view style={{alignSelf: 'center', marginTop: hp(10)}} no_bg>
            <RNSpeedometer
              value={
                (this.bpsToMbps(traffic_stats.receivedNetworkSpeed) +
                  this.bpsToMbps(traffic_stats.sendNetworkSpeed)) /
                2
              }
              defaultValue={0}
              size={wp(75)}
              allowedDecimals={2}
            />

            <Text_btn text="Try again!" action={this.begin_measure} />
          </Bg_view>
        ) : (
          <Bg_view
            flex
            no_bg
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableWithoutFeedback
              style={{height: wp(50), width: wp(50), borderRadius: wp(50)}}
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
                    style={{textTransform: 'uppercase', fontSize: wp(9)}}>
                    start
                  </Fr_text>
                </Bg_view>
              </View>
            </TouchableWithoutFeedback>
          </Bg_view>
        )}
      </Bg_view>
    );
  }
}

export default Speed_stats;
