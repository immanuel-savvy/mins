import React from 'react';
import Bg_view from './bg_view';
import {hp, wp} from '../utils/dimensions';
import {
  ScrollView,
  TouchableNativeFeedback,
  ActivityIndicator,
  View,
} from 'react-native';
import Fr_text from './fr_text';
import List_empty from './listempty';
import Feather from 'react-native-vector-icons/Feather';
import {as_to_name, net_type} from '../screens/Speed';
import Cool_modal from './cool_modal';
import Net_details from './net_details';
import {date_string} from '../utils/functions';
import {Server} from '../../Mins';

class Historic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {
    let {location, history} = this.props;
    if (!history && location) {
      history = await fetch(`${Server}/location_history`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({location}),
      });
      history = await history.json();
      this.setState({history});
    }
  };

  net_details = net => {
    this.setState({net_in_focus: net}, this.toggle_details);
  };

  toggle_details = () => this.details?.toggle();

  render() {
    let {history} = this.props;
    let {net_in_focus, history: history_} = this.state;
    history = history || history_;

    return (
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
                          {`${as_to_name(net.netinfo)} (${
                            net.netinfo.type === 'wifi'
                              ? 'WIFI'
                              : net_type(net.netinfo, true)
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
                          {`${net.latency || '-'} ms`}
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
                          {net?.download_speed}
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
                          {net?.upload_speed}
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

        <Cool_modal no_swipe flex ref={details => (this.details = details)}>
          <Net_details net={net_in_focus} toggle={this.toggle_details} />
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Historic;
