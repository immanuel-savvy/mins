import React from 'react';
import Bg_view from './bg_view';
import {ScrollView, TouchableNativeFeedback, View} from 'react-native';
import {Table, Row, Rows, TableWrapper} from 'react-native-table-component';
import {hp, wp} from '../utils/dimensions';
import {
  bps_to_mbps,
  camel_case_to_human_case,
  date_string,
  flatten_object,
  time_string,
} from '../utils/functions';
import Fr_text from './fr_text';
import Feather from 'react-native-vector-icons/Feather';

class Net_details extends React.Component {
  constructor(props) {
    super(props);

    let {net} = this.props;
    let net_array = flatten_object(net);
    net_array = net_array.map(n => {
      if (typeof n[1] == 'boolean') n[1] = String(n[1]);
      if (n[0] == 'timestamp')
        n[1] = `${date_string(n[1])}, ${time_string(n[1], true)}`;
      else if (['upload_speed', 'download_speed'].includes(n[0]))
        n[1] = `${n[1]} Mbps`;
      else if (n[0] == 'latency') n[1] = `${n[1]} ms`;

      n[0] = camel_case_to_human_case(n[0]);

      n[0] = n[0].replace(/\./g, ' > ');
      n[0] = n[0].replace(/\_/g, ' ');

      return n;
    });

    this.state = {
      net_array,
    };
  }

  render() {
    let {toggle} = this.props;
    let {net_array} = this.state;

    return (
      <Bg_view accent flex>
        <Bg_view horizontal style={{justifyContent: 'space-between'}}>
          <Fr_text bold size={wp(4.5)} style={{margin: wp(2.8)}}>
            Network Details
          </Fr_text>
          <TouchableNativeFeedback onPress={toggle}>
            <View style={{padding: wp(2.8)}}>
              <Feather name="chevron-down" color="#006dbb" size={wp(7.5)} />
            </View>
          </TouchableNativeFeedback>
        </Bg_view>

        <Bg_view no_bg flex style={{padding: wp(4), paddingBottom: 0}}>
          <Table
            borderStyle={{
              borderWidth: 2,
              borderColor: '#ddd',
            }}>
            <Row
              style={{height: hp(7.5)}}
              textStyle={{
                fontWeight: '900',
                color: '#fff',
                textAlign: 'center',
              }}
              data={['Property', 'Value']}
            />
          </Table>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Table
              borderStyle={{
                borderWidth: 2,
                borderColor: '#ddd',
              }}>
              <TableWrapper>
                <Rows
                  style={{height: hp(7.5)}}
                  textStyle={{
                    fontSize: wp(4),
                    color: '#fff',
                    textAlign: 'center',
                    textTransform: 'capitalize',
                  }}
                  data={net_array}
                />
              </TableWrapper>
            </Table>
            <View style={{height: hp(10)}} />
          </ScrollView>
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Net_details;
