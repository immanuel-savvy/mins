import React from 'react';
import {wp} from '../utils/dimensions';
import Bg_view from './bg_view';
import Fr_text from './fr_text';

const List_empty = ({text, style, data}) => (
  <Bg_view style={{...style}}>
    <Fr_text
      italic
      color="#fff"
      accent="#006dbb"
      centralise
      size={wp(5)}
      style={{margin: wp(7.5)}}>
      {text || 'Nothing'}
    </Fr_text>
    {data}
  </Bg_view>
);

export default List_empty;
