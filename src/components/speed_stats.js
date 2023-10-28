import React from 'react';
import Bg_view from './bg_view';
import Fr_text from './fr_text';
import Icon from './icon';
import {wp} from '../utils/dimensions';

class Speed_stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  begin_measure = () => {
    let {done} = this.props;
    this.setState({did_start: true}, () => {
      clearTimeout(this.measure_timer);

      this.measure_timer = setTimeout(() => {
        done && done();
      }, 3000);
    });
  };

  render() {
    let {started} = this.props;
    let {did_start} = this.state;

    if (!started && !did_start) return null;

    return (
      <Bg_view flex no_bg style={{paddingVertical: 40}}>
        <Bg_view horizontal no_bg style={{justifyContent: 'space-around'}}>
          <Bg_view no_bg>
            <Fr_text style={{color: '#fff', fontSize: 18}}>Download</Fr_text>
            <Fr_text style={{color: '#fc3', fontSize: 30}} bold>
              5.04
            </Fr_text>
            <Fr_text style={{color: '#fff', fontSize: 18}}>Mbps</Fr_text>
          </Bg_view>
          <Bg_view no_bg>
            <Fr_text style={{color: '#fff', fontSize: 18}}>Upload</Fr_text>
            <Fr_text style={{color: '#fc3', fontSize: 30}} bold>
              9.33
            </Fr_text>
            <Fr_text style={{color: '#fff', fontSize: 18}}>Mbps</Fr_text>
          </Bg_view>
          <Bg_view no_bg>
            <Fr_text style={{color: '#fff', fontSize: 18}}>Latency</Fr_text>
            <Fr_text style={{color: '#fc3', fontSize: 30}} bold>
              45
            </Fr_text>
            <Fr_text style={{color: '#fff', fontSize: 18}}>ms</Fr_text>
          </Bg_view>
        </Bg_view>

        {started ? (
          <Bg_view style={{alignSelf: 'center'}} no_bg>
            <Icon
              icon={require('./../assets/icons/meter.gif')}
              style={{height: wp(80), width: wp(80)}}
            />
          </Bg_view>
        ) : null}
      </Bg_view>
    );
  }
}

export default Speed_stats;
