import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';

class Speed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Bg_view flex style={{justifyContent: 'center', alignItems: 'center'}}>
        <Fr_text bold>Speed</Fr_text>
      </Bg_view>
    );
  }
}

export default Speed;
