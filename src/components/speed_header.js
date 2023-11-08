import React from 'react';
import Bg_view from './bg_view';
import {wp} from '../utils/dimensions';
import Fr_text from './fr_text';
import Icon from './icon';
import {App_data} from '../../Contexts';

class Speed_header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = async () => {};

  render() {
    return (
      <App_data.Consumer>
        {({netinfo, location, isp}) => {
          netinfo = netinfo ? {...netinfo, ...isp} : netinfo;
          return (
            <Bg_view
              no_bg
              horizontal
              no_centralise
              style={{
                justifyContent: 'space-between',
                padding: 20,
                borderBottomColor: '#fff',
                borderBottomWidth: 2,
              }}>
              <Bg_view no_bg horizontal flex={6}>
                <Icon
                  icon={require('./../assets/icons/antenna.jpeg')}
                  style={{height: wp(15), width: wp(15)}}
                />

                <Bg_view no_bg style={{marginLeft: 10}} flex>
                  <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                    {!netinfo
                      ? '-'
                      : netinfo?.type === 'wifi'
                      ? 'Wifi'
                      : 'Data SIM'}
                  </Fr_text>
                  <Fr_text
                    numberOfLines={1}
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      textTransform: 'uppercase',
                    }}>
                    {!netinfo
                      ? ''
                      : netinfo.isp ||
                        netinfo?.details?.cellularGeneration ||
                        ``}
                  </Fr_text>
                  <Fr_text style={{color: '#fff', fontSize: 18}}>
                    {netinfo?.details?.carrier || netinfo?.details?.ssid}
                  </Fr_text>
                  <Fr_text
                    numberOfLines={1}
                    style={{color: '#fff', fontSize: 18}}>
                    {location
                      ? `${location.locality}, ${location.city}`
                      : '...'}
                  </Fr_text>
                </Bg_view>
              </Bg_view>
              <Bg_view no_bg style={{marginRight: 10}} flex={3}>
                <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                  Connection
                </Fr_text>
                <Fr_text style={{color: '#fff', fontSize: 18}} capitalise>
                  {netinfo?.type}
                </Fr_text>
                {netinfo?.type === 'wifi' ? (
                  <>
                    <Fr_text style={{color: '#fff', fontSize: 18}} bold>
                      Frequency
                    </Fr_text>
                    <Fr_text style={{color: '#fff', fontSize: 18}} capitalise>
                      {netinfo?.details.frequency}
                    </Fr_text>
                  </>
                ) : null}
              </Bg_view>
            </Bg_view>
          );
        }}
      </App_data.Consumer>
    );
  }
}

export default Speed_header;
