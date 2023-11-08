package com.mins;
import android.telephony.TelephonyManager;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import android.os.Build;
import java.util.Map;
import java.util.List;
import java.util.HashMap;
import android.content.Context;
import android.util.Log;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import android.Manifest;
import android.telephony.CellInfo;
import android.telephony.CellInfoLte;
import android.telephony.CellIdentityLte;
import android.telephony.CellSignalStrengthLte;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

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

@ReactMethod
public void getTAC(Promise promise) {
    try {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR2) {
            List<CellInfo> cellInfoList = telephonyManager.getAllCellInfo();
            if (cellInfoList != null) {
                for (CellInfo cellInfo : cellInfoList) {
                    if (cellInfo instanceof CellInfoLte) {
                        CellSignalStrengthLte signalLte = ((CellInfoLte) cellInfo).getCellSignalStrength();
                        int tac = ((CellInfoLte) cellInfo).getCellIdentity().getTac();
                        promise.resolve(tac);
                        return;
                    }
                }
            }
        }
        promise.reject("TAC_ERROR", "TAC not available on this device or API level.");
    } catch (Exception e) {
        promise.reject("TAC_ERROR", e.getMessage());
    }
}

    @ReactMethod
public void getCellInfo(Promise promise) {
    try {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1) {
            List<CellInfo> cellInfoList = telephonyManager.getAllCellInfo();
            WritableArray cellInfoArray = Arguments.createArray();

            for (CellInfo cellInfo : cellInfoList) {
                if (cellInfo instanceof CellInfoLte) {
                    CellInfoLte cellInfoLte = (CellInfoLte) cellInfo;
                    CellIdentityLte cellIdentityLte = cellInfoLte.getCellIdentity();
                    CellSignalStrengthLte signalStrengthLte = cellInfoLte.getCellSignalStrength();

                    WritableMap cellInfoMap = Arguments.createMap();
                    cellInfoMap.putInt("mcc", cellIdentityLte.getMcc());
                    cellInfoMap.putInt("mnc", cellIdentityLte.getMnc());
                    cellInfoMap.putInt("ci", cellIdentityLte.getCi());
                    cellInfoMap.putInt("pci", cellIdentityLte.getPci());
                    cellInfoMap.putInt("rsrp", signalStrengthLte.getRsrp());

                    cellInfoArray.pushMap(cellInfoMap);
                }
            }

            promise.resolve(cellInfoArray);
        } else {
            promise.reject("CELL_INFO_ERROR", "Cell information not available on this device or API level.");
        }
    } catch (Exception e) {
        promise.reject("CELL_INFO_ERROR", e.getMessage());
    }
}

@ReactMethod
public void getNetworkInfo(Promise promise) {
    try {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1) {
            // Check for necessary permissions
            if (reactContext.checkSelfPermission(Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED) {
                WritableMap networkInfo = Arguments.createMap();

                // Retrieve PLMN (Network Operator Name)
                networkInfo.putString("plmn", telephonyManager.getNetworkOperatorName());

                // Retrieve Operator Name (Network Operator)
                networkInfo.putString("operator", telephonyManager.getNetworkOperator());

                // Retrieve Cell Connection Status
                networkInfo.putBoolean("connected", telephonyManager.getCallState() == TelephonyManager.CALL_STATE_IDLE);

                // Retrieve Roaming status
                networkInfo.putBoolean("roaming", telephonyManager.isNetworkRoaming());

                // Retrieve ASU (Arbitrary Strength Unit) level
                int asuLevel = -1;
                List<CellInfo> cellInfoList = telephonyManager.getAllCellInfo();

                if (cellInfoList != null && !cellInfoList.isEmpty()) {
                    CellInfo primaryCellInfo = cellInfoList.get(0); // Assuming primary cell
                    if (primaryCellInfo instanceof CellInfoLte) {
                        asuLevel = ((CellInfoLte) primaryCellInfo).getCellSignalStrength().getAsuLevel();
                    }
                }

                networkInfo.putInt("asu", asuLevel);

                // Retrieve Cell Identity (CID)
                int cellIdentity = -1;
                int band = -1;
                int dbm = -1;

                if (telephonyManager.getDataNetworkType() == TelephonyManager.NETWORK_TYPE_LTE) {
                    CellInfo cellInfo = telephonyManager.getAllCellInfo().get(0);
                    if (cellInfo instanceof CellInfoLte) {
                        CellIdentityLte cellIdentityLte = ((CellInfoLte) cellInfo).getCellIdentity();
                        CellSignalStrengthLte signalStrengthLte = ((CellInfoLte) cellInfo).getCellSignalStrength();

                        cellIdentity = cellIdentityLte.getCi();
                        band = cellIdentityLte.getEarfcn();
                        dbm = signalStrengthLte.getDbm();
                    }
                }

                networkInfo.putInt("cellIdentity", cellIdentity);
                networkInfo.putInt("band", band);
                networkInfo.putInt("dbm", dbm);

                promise.resolve(networkInfo);
            } else {
                promise.reject("PERMISSION_DENIED", "READ_PHONE_STATE permission is required.");
            }
        } else {
            promise.reject("API_LEVEL_NOT_SUPPORTED", "API level not supported.");
        }
    } catch (Exception e) {
        promise.reject("NETWORK_INFO_ERROR", e.getMessage());
    }
}


    @ReactMethod
    public void getLAC(Promise promise) {
        try {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1) {
                // Check for necessary permissions
                if (reactContext.checkSelfPermission(Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED) {
                    int lac = -1; // Default value if not available

                    // Retrieve LAC (Location Area Code) for LTE
                    if (telephonyManager.getDataNetworkType() == TelephonyManager.NETWORK_TYPE_LTE) {
                        CellInfo cellInfo = telephonyManager.getAllCellInfo().get(0);
                        if (cellInfo instanceof CellInfoLte) {
                            CellIdentityLte cellIdentityLte = ((CellInfoLte) cellInfo).getCellIdentity();
                            lac = cellIdentityLte.getTac();
                        }
                    }

                    promise.resolve(lac);
                } else {
                    promise.reject("PERMISSION_DENIED", "READ_PHONE_STATE permission is required.");
                }
            } else {
                promise.reject("API_LEVEL_NOT_SUPPORTED", "API level not supported.");
            }
        } catch (Exception e) {
            promise.reject("LAC_ERROR", e.getMessage());
        }
    }

@ReactMethod
    public void getSimState(Promise promise) {
        try {
            int simState = telephonyManager.getSimState();
            promise.resolve(simState);
        } catch (Exception e) {
            promise.reject("SIM_STATE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getCallState(Promise promise) {
        try {
            int callState = telephonyManager.getCallState();
            promise.resolve(callState);
        } catch (Exception e) {
            promise.reject("CALL_STATE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getPhoneType(Promise promise) {
        try {
            int phoneType = telephonyManager.getPhoneType();
            promise.resolve(phoneType);
        } catch (Exception e) {
            promise.reject("PHONE_TYPE_ERROR", e.getMessage());
        }
    }

  @Override
  public String getName() {
    return "RadioParameters";
  }
}