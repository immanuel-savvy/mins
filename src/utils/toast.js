import {ToastAndroid, Platform, Alert} from 'react-native';

const toast = msg => {
  Platform.OS === 'ios'
    ? Alert(String(msg))
    : ToastAndroid.showWithGravity(
        String(msg),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
};

export default toast;
