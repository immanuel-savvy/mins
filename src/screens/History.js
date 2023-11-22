import React from 'react';
import Bg_view from '../components/bg_view';
import {StatusBar, View} from 'react-native';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import {Test_history} from '../../Contexts';
import {emitter} from '../../Mins';
import Text_btn from '../components/text_btn';
import Cool_modal from '../components/cool_modal';
import Confirm_clear_history from '../components/confirm_clear_history';
import RadialGradient from 'react-native-radial-gradient';
import Historic from '../components/historic';

class History extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  clear = () => this.clear_modal?.toggle();

  componentDidMount = () => {
    emitter.emit('fetch_history');
  };

  render() {
    return (
      <Test_history.Consumer>
        {({history}) => {
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

                <Historic history={history} />

                <Cool_modal
                  ref={clear_modal => (this.clear_modal = clear_modal)}>
                  <Confirm_clear_history
                    toggle={this.clear}
                    proceed={() => emitter.emit('clear_history')}
                  />
                </Cool_modal>
              </Bg_view>
            </RadialGradient>
          );
        }}
      </Test_history.Consumer>
    );
  }
}

export default History;
