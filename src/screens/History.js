import React from 'react';
import Bg_view from '../components/bg_view';
import {
  ScrollView,
  StatusBar,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import Fr_text from '../components/fr_text';
import Feather from 'react-native-vector-icons/Feather';

class History extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  history = [
    ['9mobile (4G)', new Date().toDateString(), '54', '12.32', '3.95'],
    ['MTN (3G)', new Date().toDateString(), '55', '6.99', '2.46'],
    ['MTN (4G)', new Date().toDateString(), '65', '7.35', '3.65'],
    ['MTN (4G)', new Date().toDateString(), '45', '7.97', '4.41'],
  ];

  render() {
    return (
      <Bg_view
        flex
        style={{
          backgroundColor: '#006dbb',
        }}>
        <StatusBar barStyle="light-content" backgroundColor="#006dbb" />
        <ScrollView
          contentContainerStyle={{flex: 1}}
          showVerticalScrollIndicator={false}>
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
                <Fr_text color="#fff">Clear history</Fr_text>
              </View>
            </Bg_view>
          </Bg_view>

          <Bg_view
            flex
            no_bg
            style={{margin: wp(4), paddingTop: wp(2.8), borderRadius: wp(2.8)}}>
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
            {this.history.map((net, j) => {
              return (
                <TouchableNativeFeedback key={j}>
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
                    {net.map((n, i) => (
                      <Bg_view
                        no_bg
                        key={i}
                        flex
                        style={{
                          justifyContent: 'center',
                          paddingLeft: wp(1.4),
                        }}>
                        <Fr_text
                          size={wp(i === 1 ? 3 : 4)}
                          bold={i > 1}
                          centralise={i}>
                          {n}
                        </Fr_text>
                      </Bg_view>
                    ))}
                  </Bg_view>
                </TouchableNativeFeedback>
              );
            })}
            {/* </Bg_view> */}
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default History;
