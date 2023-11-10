import React from 'react';
import Bg_view from './bg_view';
import Fr_text from './fr_text';
import {hp, wp} from '../utils/dimensions';
import RNSpeedometer from 'react-native-speedometer';
import {CountUp} from 'use-count-up';
import {TouchableWithoutFeedback, View, NativeModules} from 'react-native';
import {Server, emitter} from '../../Mins';
import {App_data} from '../../Contexts';
import {labels} from '../utils/speedo_labels';
import toast from '../utils/toast';
import {measureDownloadSpeed} from '../screens/Speed';

const {RadioParameters} = NativeModules;

const _3mb = '0'.repeat(3 * 1024);

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
      {
        did_start: true,
        starting: true,
        download_speed: null,
        upload_speed: null,
        latency: null,
        current: null,
        traffic_stats: null,
      },
      async () => {
        await this.refresh_network();

        if (this.offline) {
          this.setState({starting: false});

          return toast('You are offline!');
        }

        let latency,
          download_speed,
          upload_speed,
          traffic_stats = new Object();

        try {
          latency =
            Number(
              (
                (await RadioParameters.measureLatency('mins.giitafrica.com')) *
                1000
              ).toFixed(2),
            ) || 0;

          traffic_stats.latency = latency;
          this.prev_latency = latency;
          this.setState({latency, current: latency});
        } catch (e) {
          latency = this.prev_latency || 0;
        }

        try {
          const url = 'http://mins.giitafrica.com/download_speed';
          download_speed = Number((await measureDownloadSpeed(url)).toFixed(2));

          traffic_stats.download_speed = download_speed || 0;
          this.setState({download_speed, current: download_speed});
        } catch (e) {
          console.log(e.message, 'Download test failed');
        }

        try {
          upload_speed = Number(
            (
              await RadioParameters.measureUploadSpeed(
                `${Server}/upload_speed`,
                _3mb,
              )
            ).toFixed(2),
          );
          traffic_stats.upload_speed = upload_speed || 0;
          this.setState({upload_speed, current: upload_speed});
        } catch (e) {
          console.log(e.message, 'Upload test failed');
        }

        // console.log(traffic_stats, 'YOOOO');
        if (!traffic_stats.upload_speed || !traffic_stats.download_speed) {
          return this.begin_measure();
        } else this.previous_stats = traffic_stats;

        this.setState(
          {
            starting: false,
            traffic_stats,
          },
          () => emitter.emit('new_test', traffic_stats),
        );
      },
    );
  };

  render() {
    let {start} = this.props;
    let {did_start, download_speed, upload_speed, latency, current, starting} =
      this.state;

    return (
      <App_data.Consumer>
        {({refresh_network, offline}) => {
          this.offline = offline;
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
                      {download_speed ? (
                        <CountUp
                          isCounting={!!download_speed}
                          end={download_speed || 0}
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
                      {upload_speed ? (
                        <CountUp
                          isCounting={!!upload_speed}
                          end={upload_speed || 0}
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
                      {latency ? (
                        <CountUp
                          isCounting={!!latency}
                          end={latency || 0}
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
                {starting ? (
                  <>
                    <Bg_view
                      style={{alignSelf: 'center', marginTop: hp(10)}}
                      no_bg>
                      <Bg_view no_bg>
                        <RNSpeedometer
                          labels={labels}
                          value={current || 0}
                          labelStyle={{color: '#f9f059'}}
                          defaultValue={0}
                          size={wp(75)}
                          maxValue={500}
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
            </Bg_view>
          );
        }}
      </App_data.Consumer>
    );
  }
}

export default Speed_stats;
