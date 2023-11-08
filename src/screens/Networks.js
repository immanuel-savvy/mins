import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import {ScrollView, StatusBar} from 'react-native';
import {App_data, Networks_data} from '../../Contexts';

class Networks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    this.load_networks();
  };

  render() {
    return (
      <Networks_data.Consumer>
        {({load_networks}) => {
          this.load_networks = load_networks;

          return (
            <App_data.Consumer>
              {({location}) => {
                return (
                  <Bg_view
                    flex
                    style={{
                      backgroundColor: '#006dbb',
                    }}>
                    <StatusBar
                      barStyle="light-content"
                      backgroundColor="#006dbb"
                    />
                    <ScrollView showVerticalScrollIndicator={false}>
                      <Bg_view style={{alignItems: 'center'}} no_bg>
                        <Icon
                          icon={require('./../assets/icons/logo_mins.png')}
                          style={{height: wp(25), width: wp(25)}}
                        />
                      </Bg_view>

                      <Bg_view no_bg style={{padding: wp(4)}}>
                        <Fr_text bold style={{fontSize: wp(7.5)}} color="#fff">
                          Network Stats
                        </Fr_text>
                        <Fr_text color="#fff">
                          The average speeds users experienced in this area.
                        </Fr_text>
                      </Bg_view>

                      <Bg_view
                        style={{
                          margin: wp(4),
                          paddingTop: wp(2.8),
                          borderRadius: wp(2.8),
                        }}>
                        {this.networks.map((net, j) => {
                          return (
                            <Bg_view
                              horizontal
                              no_bg
                              key={j}
                              style={{
                                borderBottomWidth: 4,
                                borderBottomColor: '#006dbb',
                                paddingVertical: hp(1.4),
                                paddingHorizontal: wp(2.8),
                                minHeight: hp(10),
                              }}>
                              {net.map((n, i) => (
                                <Bg_view
                                  no_bg
                                  key={i}
                                  flex
                                  style={{alignItems: 'center'}}>
                                  <Fr_text bold={!j} size={wp(j ? 4.5 : 4)}>
                                    {n}
                                  </Fr_text>
                                </Bg_view>
                              ))}
                            </Bg_view>
                          );
                        })}
                      </Bg_view>

                      <Fr_text style={{margin: wp(4), color: '#fff'}}>
                        Location:{' '}
                        <Fr_text bold color="#fff">
                          {location
                            ? `${location.locality}, ${location.city}`
                            : '...'}
                        </Fr_text>
                      </Fr_text>
                    </ScrollView>
                  </Bg_view>
                );
              }}
            </App_data.Consumer>
          );
        }}
      </Networks_data.Consumer>
    );
  }
}

export default Networks;
