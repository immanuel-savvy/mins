import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Speed_header from '../components/speed_header';
import Speed_stats from '../components/speed_stats';

class Speed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  start = () => {
    this.setState({started: true, did_start: true}, this.stats.begin_measure);
  };

  done = () => {
    this.setState({started: false});
  };

  render() {
    let {started, did_start} = this.state;

    return (
      <Bg_view
        flex
        style={{
          backgroundColor: '#006dbb',
        }}>
        <StatusBar barStyle="light-content" backgroundColor="#006dbb" />
        <SafeAreaView>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Speed_header />
            <Bg_view
              no_bg
              style={{paddingTop: wp(6.7), paddingHorizontal: wp(5.6)}}>
              {did_start ? null : (
                <Fr_text
                  style={{
                    fontSize: wp(9),
                    color: '#fff',
                    marginBottom: hp(15),
                  }}>
                  Test your data{' '}
                  <Fr_text style={{fontSize: wp(9), color: '#fc3'}}>
                    Connection
                  </Fr_text>
                </Fr_text>
              )}
            </Bg_view>

            <Speed_stats
              ref={stats => (this.stats = stats)}
              done={this.done}
              started={started}
            />
            {started ? null : (
              <Bg_view
                flex
                no_bg
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableWithoutFeedback
                  style={{height: wp(50), width: wp(50), borderRadius: wp(50)}}
                  onPress={this.start}>
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
          </ScrollView>
        </SafeAreaView>
      </Bg_view>
    );
  }
}

export default Speed;
