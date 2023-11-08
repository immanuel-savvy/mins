import React from 'react';
import Bg_view from '../components/bg_view';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import Fr_text from '../components/fr_text';
import Feather from 'react-native-vector-icons/Feather';
import {Test_history} from '../../Contexts';
import {emitter} from '../../Mins';
import Text_btn from '../components/text_btn';
import Cool_modal from '../components/cool_modal';
import Confirm_clear_history from '../components/confirm_clear_history';
import List_empty from '../components/listempty';
import {date_string} from '../utils/functions';
import Net_details from '../components/net_details';

class History extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  bpsToMbps(bps) {
    if (!bps) return;

    let mbps = bps / 100;
    return mbps;
  }

  clear = () => this.clear_modal?.toggle();

  componentDidMount = () => {
    emitter.emit('fetch_history');
  };

  toggle_details = () => this.details?.toggle();

  net_details = net => {
    console.log(net);
    this.setState({net_in_focus: net}, this.toggle_details);
  };

  render() {
    let {net_in_focus} = this.state;

    return (
      <Test_history.Consumer>
        {({history}) => {
          return (
            <Bg_view
              flex
              style={{
                backgroundColor: '#006dbb',
              }}>
              <StatusBar barStyle="light-content" backgroundColor="#006dbb" />
              <Bg_view no_bg>
                <Bg_view
                  horizontal
                  no_bg
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingHorizontal: wp(4),
                  }}>
                  <View style={{flex: 1}} />
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <Icon
                      icon={require('./../assets/icons/logo_mins.png')}
                      style={{height: wp(25), width: wp(25)}}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                    }}>
                    <Text_btn
                      text="Clear history"
                      color="#eee"
                      action={this.clear}
                      bold
                    />
                  </View>
                </Bg_view>
              </Bg_view>

              <Bg_view
                flex
                no_bg
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
                    paddingHorizontal: wp(2.8),
                    minHeight: hp(5),
                  }}>
                  <Bg_view no_bg flex={1} style={{alignItems: 'center'}}>
                    <Fr_text bold color="#fff" size={wp(4)}>
                      Type
                    </Fr_text>
                  </Bg_view>
                  <Bg_view no_bg flex={1} style={{alignItems: 'center'}}>
                    <Fr_text bold color="#fff" size={wp(4)}>
                      Date
                    </Fr_text>
                  </Bg_view>
                  <Bg_view no_bg flex={1} style={{alignItems: 'center'}}>
                    <Fr_text bold color="#fff" size={wp(4)}>
                      Latency
                    </Fr_text>
                  </Bg_view>
                  <Bg_view no_bg flex={1} style={{alignItems: 'center'}}>
                    <Feather name="download" color="#fff" size={wp(5)} />
                  </Bg_view>
                  <Bg_view no_bg flex={1} style={{alignItems: 'center'}}>
                    <Feather name="upload" color="#fff" size={wp(5)} />
                  </Bg_view>
                </Bg_view>
                <ScrollView showVerticalScrollIndicator={false}>
                  {!history ? (
                    <Bg_view style={{borderRadius: wp(2.8), padding: wp(4)}}>
                      <ActivityIndicator color="#006dbb" size="large" />
                    </Bg_view>
                  ) : history.length ? (
                    history.map((net, j) => {
                      return (
                        <TouchableNativeFeedback
                          key={j}
                          onPress={() => this.net_details(net)}>
                          <View>
                            <Bg_view
                              horizontal
                              style={{
                                borderBottomWidth: 4,
                                borderBottomColor: '#006dbb',
                                paddingVertical: hp(1.4),
                                paddingHorizontal: wp(2.8),
                                minHeight: hp(7.5),
                                borderRadius: wp(2.8),
                              }}>
                              <Bg_view
                                no_bg
                                flex
                                style={{
                                  justifyContent: 'center',
                                  paddingLeft: wp(1.4),
                                }}>
                                <Fr_text size={wp(4)}>
                                  {`${
                                    net.netinfo?.details?.carrier ||
                                    net.netinfo?.details?.ipAddress
                                  } (${
                                    net.netinfo?.details?.cellularGeneration?.toUpperCase() ||
                                    `${
                                      net.netinfo?.details?.linkSpeed || '-'
                                    } Mbps`
                                  })`}
                                </Fr_text>
                              </Bg_view>

                              <Bg_view
                                no_bg
                                flex
                                style={{
                                  justifyContent: 'center',
                                  paddingLeft: wp(1.4),
                                }}>
                                <Fr_text size={wp(3)} bold centralise>
                                  {date_string(net.timestamp)}
                                </Fr_text>
                              </Bg_view>

                              <Bg_view
                                no_bg
                                flex
                                style={{
                                  justifyContent: 'center',
                                  paddingLeft: wp(1.4),
                                }}>
                                <Fr_text size={wp(4)} centralise>
                                  {`${parseInt(
                                    net.receivedNetworkTotal /
                                      this.bpsToMbps(net.receivedNetworkSpeed),
                                  )} ms`}
                                </Fr_text>
                              </Bg_view>

                              <Bg_view
                                no_bg
                                flex
                                style={{
                                  justifyContent: 'center',
                                  paddingLeft: wp(1.4),
                                }}>
                                <Fr_text size={wp(4)} centralise>
                                  {this.bpsToMbps(net?.receivedNetworkSpeed)}
                                </Fr_text>
                              </Bg_view>

                              <Bg_view
                                no_bg
                                flex
                                style={{
                                  justifyContent: 'center',
                                  paddingLeft: wp(1.4),
                                }}>
                                <Fr_text size={wp(4)} centralise>
                                  {this.bpsToMbps(net?.sendNetworkSpeed)}
                                </Fr_text>
                              </Bg_view>
                            </Bg_view>
                          </View>
                        </TouchableNativeFeedback>
                      );
                    })
                  ) : (
                    <List_empty
                      style={{borderRadius: wp(4)}}
                      text="No test history yet."
                    />
                  )}
                </ScrollView>
              </Bg_view>

              <Cool_modal ref={clear_modal => (this.clear_modal = clear_modal)}>
                <Confirm_clear_history
                  toggle={this.clear}
                  proceed={() => emitter.emit('clear_history')}
                />
              </Cool_modal>

              <Cool_modal
                no_swipe
                flex
                ref={details => (this.details = details)}>
                <Net_details net={net_in_focus} toggle={this.toggle_details} />
              </Cool_modal>
            </Bg_view>
          );
        }}
      </Test_history.Consumer>
    );
  }
}

export default History;
