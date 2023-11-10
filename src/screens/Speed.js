import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import {hp, wp} from '../utils/dimensions';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import Speed_header from '../components/speed_header';
import Speed_stats from '../components/speed_stats';

const measureDownloadSpeed = async url => {
  try {
    const startTime = Date.now();
    let response = await fetch(url);
    let data = await response.text();

    const endTime = Date.now();

    if (data.length) {
      const fileSize = Number(data.length);
      let dur = endTime - startTime;
      if (!isNaN(fileSize) && dur > 0) {
        const downloadSpeedMbps = fileSize / 1024 ** 2 / (dur / 1000); // Convert to Mbps
        return downloadSpeedMbps;
      } else {
        throw new Error('Invalid file size or time measurement');
      }
    } else {
      throw new Error(`HTTP request failed with status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Download speed measurement failed: ${error.message}`);
  }
};

const net_type = (netinfo, linkspeed, suff = '') => {
  let nettype = '';
  if (netinfo) {
    if (netinfo.type === 'wifi')
      nettype = `${
        linkspeed
          ? `${netinfo.details.linkSpeed} ${suff}`.trim()
          : netinfo.details.ssid
      }`;
    else {
      if (netinfo?.radio) {
        let s1 = netinfo.radio['Sim 1'];
        nettype = s1.NetworkType;
      } else nettype = netinfo?.details?.cellularGeneration?.toUpperCase();
    }
  }

  return nettype;
};

class Speed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {};

  start = () => {
    this.setState({started: true, did_start: true});
  };

  done = () => {
    this.setState({started: false});
  };

  render() {
    let {did_start} = this.state;

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
                    marginBottom: hp(5),
                  }}>
                  Test your data{' '}
                  <Fr_text style={{fontSize: wp(9), color: '#fc3'}}>
                    Connection
                  </Fr_text>
                </Fr_text>
              )}
            </Bg_view>

            <Speed_stats done={this.done} start={this.start} />
          </ScrollView>
        </SafeAreaView>
      </Bg_view>
    );
  }
}

export default Speed;
export {measureDownloadSpeed, net_type};
