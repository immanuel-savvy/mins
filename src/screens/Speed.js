import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import {hp, wp} from '../utils/dimensions';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import Speed_header from '../components/speed_header';
import Speed_stats from '../components/speed_stats';
import RadialGradient from 'react-native-radial-gradient';

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

const as_to_name = netinfo => {
  switch (netinfo?.as?.slice(2)) {
    case '36873':
      return 'Airtel';
    case '29465':
      return 'MTN';
    case '36873':
      return 'Glo';
    case '328309':
      return 'Glo';
    case '37076':
      return '9mobile';
    default:
      return netinfo?.isp?.split(' ')[0];
  }
};

const data_sim = (netinfo, not = false) => {
  if (!netinfo?.radio) return {};

  if (netinfo.isp) {
    let i = as_to_name(netinfo);

    for (let s in netinfo.radio) {
      let sim = netinfo.radio[s];

      if (sim?.Net?.operator?.toLowerCase().includes(i?.toLowerCase())) {
        if (!not) return sim;
      } else if (not) return sim;
    }
  }
  return {};
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
        let s1 = data_sim(netinfo);
        nettype = s1.NetworkType;
      } else {
        console.log(netinfo.details);
        nettype = netinfo?.details?.cellularGeneration?.toUpperCase();
      }
    }
  }

  return nettype;
};

class Speed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  start = () => {
    this.setState({started: true, did_start: true});
  };

  done = () => {
    this.setState({started: false});
  };
  g;

  render() {
    let {did_start} = this.state;

    return (
      <RadialGradient
        style={{flex: 1}}
        colors={['#019cff', '#006dbb']}
        stops={[0.1, 1]}
        center={[wp(50), hp(50)]}
        radius={wp(75)}>
        <Bg_view
          flex
          no_bg
          style={
            {
              // backgroundColor: ,
            }
          }>
          <StatusBar barStyle="light-content" backgroundColor="#006dbb" />
          <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Bg_view no_bg>
                <Speed_header did_start={did_start} />
                <Bg_view no_bg flex={6}>
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
                </Bg_view>
              </Bg_view>
            </ScrollView>
          </SafeAreaView>
        </Bg_view>
      </RadialGradient>
    );
  }
}

export default Speed;
export {measureDownloadSpeed, net_type, as_to_name, data_sim};
