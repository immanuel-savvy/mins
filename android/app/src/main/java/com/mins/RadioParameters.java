package com.mins;
import android.telephony.TelephonyManager;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import java.util.Map;
import java.util.HashMap;
import android.content.Context;
import android.util.Log;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import android.Manifest;

public class RadioParameters extends ReactContextBaseJavaModule {
  private ReactApplicationContext reactContext;
  private TelephonyManager telephonyManager;

  public RadioParameters(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        telephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    }

  @ReactMethod
  public void getRadioParameters(String name, String location) {
    Log.d("RadioParamaters", "Create event called with name: " + name
   + " and location: " + location);
  }

  @ReactMethod
  public void getSignalStrength(Promise promise) {
      try {
          int signalStrength = telephonyManager.getSignalStrength().getLevel();
          promise.resolve(signalStrength);
      } catch (Exception e) {
          promise.reject("SIGNAL_STRENGTH_ERROR", e.getMessage());
      }
  }

  @ReactMethod
public void getNetworkType(Promise promise) {
    if (ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.READ_PHONE_STATE)
        != PackageManager.PERMISSION_GRANTED) {
        if (ActivityCompat.shouldShowRequestPermissionRationale(reactContext.getCurrentActivity(),
            Manifest.permission.READ_PHONE_STATE)) {
            // Request the permission here
            ActivityCompat.requestPermissions(reactContext.getCurrentActivity(), new String[]{Manifest.permission.READ_PHONE_STATE}, 123);

        } else {
            // Permission has not been granted, and user chose not to show rationale. Handle this case.
            promise.reject("PERMISSION_DENIED", "Permission denied by user.");
        }
    } else {
        // Permission is already granted, proceed to get the network type
        try {
            int networkType = telephonyManager.getDataNetworkType();
            promise.resolve(networkType);
        } catch (Exception e) {
            promise.reject("NETWORK_TYPE_ERROR", e.getMessage());
        }
    }
}

  @Override
  public String getName() {
    return "RadioParameters";
  }
}