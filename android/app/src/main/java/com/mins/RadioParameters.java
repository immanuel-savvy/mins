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
import android.telephony.CellSignalStrength;
import android.telephony.CellSignalStrengthWcdma;
import android.telephony.CellSignalStrengthGsm;
import android.telephony.CellInfoCdma;
import android.telephony.CellInfoWcdma;
import android.telephony.CellInfoGsm;
import android.telephony.CellIdentityCdma;
import android.telephony.CellIdentityWcdma;
import android.telephony.CellIdentityGsm;
import android.telephony.CellSignalStrengthCdma;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.io.IOException;

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
        int simCount = telephonyManager.getPhoneCount();
        WritableArray signalStrengths = Arguments.createArray();

        for (int subscriptionId = 0; subscriptionId < simCount; subscriptionId++) {
            try {
                TelephonyManager telephonyManagerForSlot = telephonyManager.createForSubscriptionId(subscriptionId);
                int signalStrength = telephonyManagerForSlot.getSignalStrength().getLevel();
                signalStrengths.pushInt(signalStrength);
            } catch (Exception e) {
                signalStrengths.pushNull();
            }
        }

        promise.resolve(signalStrengths);
    } catch (Exception e) {
        promise.reject("SIGNAL_STRENGTH_ERROR", e.getMessage());
    }
}


@ReactMethod
    public void getNetworkType(Promise promise) {
        try {
            int simCount = telephonyManager.getPhoneCount();
            WritableArray result = Arguments.createArray();

            for (int subscriptionId = 0; subscriptionId < simCount; subscriptionId++) {
                try {
                    int networkType = telephonyManager.createForSubscriptionId(subscriptionId).getDataNetworkType();
                    result.pushInt(networkType);
                } catch (Exception e) {
                    result.pushNull(); // Null value for SIM slots without information
                }
            }

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("NETWORK_TYPE_ERROR", e.getMessage());
        }
    }


@ReactMethod
    public void getTAC(Promise promise) {
        try {
            int simCount = telephonyManager.getPhoneCount();
            WritableArray result = Arguments.createArray();

            for (int subscriptionId = 0; subscriptionId < simCount; subscriptionId++) {
                try {
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR2) {
                        List<CellInfo> cellInfoList = telephonyManager.createForSubscriptionId(subscriptionId).getAllCellInfo();
                        if (cellInfoList != null) {
                            for (CellInfo cellInfo : cellInfoList) {
                                if (cellInfo instanceof CellInfoLte) {
                                    CellSignalStrengthLte signalLte = ((CellInfoLte) cellInfo).getCellSignalStrength();
                                    int tac = ((CellInfoLte) cellInfo).getCellIdentity().getTac();
                                    result.pushInt(tac);
                                    break; // Return the first valid TAC
                                }
                            }
                        }
                    } else {
                        result.pushNull();
                    }
                } catch (Exception e) {
                    result.pushNull();
                }
            }

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("TAC_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getLac(Promise promise) {
        try {
            int simCount = telephonyManager.getPhoneCount();
            WritableArray result = Arguments.createArray();
    
            for (int subscriptionId = 0; subscriptionId < simCount; subscriptionId++) {
                try {
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1) {
                        // Check for necessary permissions
                        if (reactContext.checkSelfPermission(Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED) {
                            // Retrieve LAC (Location Area Code) for LTE
                            if (telephonyManager.createForSubscriptionId(subscriptionId).getDataNetworkType() == TelephonyManager.NETWORK_TYPE_LTE) {
                                List<CellInfo> cellInfoList = telephonyManager.createForSubscriptionId(subscriptionId).getAllCellInfo();
                                if (cellInfoList != null && !cellInfoList.isEmpty()) {
                                    CellInfo cellInfo = cellInfoList.get(0);
                                    if (cellInfo instanceof CellInfoLte) {
                                        CellIdentityLte cellIdentityLte = ((CellInfoLte) cellInfo).getCellIdentity();
                                        int lac = cellIdentityLte.getTac();
                                        result.pushInt(lac);
                                    } else {
                                        result.pushInt(-1); // Default value if not LTE
                                    }
                                } else {
                                    result.pushInt(-1); // Default value if no cell info
                                }
                            } else {
                                result.pushInt(-1); // Default value if not LTE
                            }
                        } else {
                            promise.reject("PERMISSION_DENIED", "READ_PHONE_STATE permission is required.");
                            return;
                        }
                    } else {
                        promise.reject("API_LEVEL_NOT_SUPPORTED", "API level not supported.");
                        return;
                    }
                } catch (Exception e) {
                    promise.reject("LAC_ERROR", e.getMessage());
                    return;
                }
            }
    
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("LAC_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void getCellInfos(Promise promise) {
        try {
            int simCount = telephonyManager.getPhoneCount();
            WritableArray cellInfosArray = Arguments.createArray();
    
            for (int subscriptionId = 0; subscriptionId < simCount; subscriptionId++) {
                try {
                    TelephonyManager telephonyManagerForSlot = telephonyManager.createForSubscriptionId(subscriptionId);
    
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1) {
                        List<CellInfo> cellInfoList = telephonyManagerForSlot.getAllCellInfo();
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
    
                        cellInfosArray.pushArray(cellInfoArray);
                    } else {
                        cellInfosArray.pushNull();
                    }
                } catch (Exception e) {
                    cellInfosArray.pushNull();
                }
            }
    
            promise.resolve(cellInfosArray);
        } catch (Exception e) {
            promise.reject("CELL_INFO_ERROR", e.getMessage());
        }
    }


    @ReactMethod
    public void getNetworkInfos(Promise promise) {
        try {
            int simCount = telephonyManager.getPhoneCount();
            WritableArray networkInfos = Arguments.createArray();
    
            for (int subscriptionId = 0; subscriptionId < simCount; subscriptionId++) {
                try {
                    TelephonyManager telephonyManagerForSlot = telephonyManager.createForSubscriptionId(subscriptionId);
    
                    WritableMap networkInfo = Arguments.createMap();


                    // Retrieve Cell Identity (CID), Band, and dBm
                    int cellIdentity = -1;
                    int band = -1;
                    int dbm = -1;
    
                    CellInfo cellInfo = getCellInfoForNetworkType(telephonyManagerForSlot);
                    if (cellInfo != null) {
                        networkInfo = getCellInfoMap((CellInfo) cellInfo);
                        // if (cellInfo instanceof CellInfoLte) {
                        //     CellIdentityLte cellIdentityLte = ((CellInfoLte) cellInfo).getCellIdentity();
                        //     CellSignalStrengthLte signalStrengthLte = ((CellInfoLte) cellInfo).getCellSignalStrength();
    
                        //     cellIdentity = cellIdentityLte.getCi();
                        //     band = cellIdentityLte.getEarfcn();
                        //     dbm = signalStrengthLte.getDbm();
                        // } else if (cellInfo instanceof CellInfoGsm) {
                        //     networkInfo = getGsmCellInfoMap((CellInfoGsm) cellInfo);
                        // } else if (cellInfo instanceof CellInfoWcdma) {
                        //     networkInfo = getWcdmaCellInfoMap((CellInfoWcdma) cellInfo);
                        // }
                        // Add conditions for other network types if needed
                    }
    
    
                    // Retrieve PLMN (Network Operator)
                    networkInfo.putString("plmn", telephonyManagerForSlot.getNetworkOperator());
    
                    // Retrieve Operator Name (Network Operator)
                    networkInfo.putString("operator", telephonyManagerForSlot.getNetworkOperatorName());
    
                    // Retrieve Cell Connection Status
                    networkInfo.putBoolean("connected", telephonyManagerForSlot.getCallState() == TelephonyManager.CALL_STATE_IDLE);
    
                    // Retrieve Roaming status
                    networkInfo.putBoolean("roaming", telephonyManagerForSlot.isNetworkRoaming());
    
                    // Retrieve ASU (Arbitrary Strength Unit) level
                    int asuLevel = -1;
                    List<CellInfo> cellInfoList = telephonyManagerForSlot.getAllCellInfo();
    
                    if (cellInfoList != null && !cellInfoList.isEmpty()) {
                        CellInfo primaryCellInfo = cellInfoList.get(0); // Assuming primary cell
    
                        asuLevel = getAsuLevel(primaryCellInfo);
                        // Common information for all network types
                    }
                    networkInfo.putInt("asu", asuLevel);
    
                    networkInfos.pushMap(networkInfo);
                } catch (Exception e) {
                    e.printStackTrace(); // Log the exception
                    networkInfos.pushNull();
                }
            }
    
            promise.resolve(networkInfos);
        } catch (Exception e) {
            promise.reject("NETWORK_INFO_ERROR", e.getMessage());
        }
    }
    

// Helper method to get WritableMap for GSM CellInfo
private WritableMap getGsmCellInfoMap(CellInfoGsm cellInfoGsm) {
    WritableMap cellInfoMap = Arguments.createMap();
    CellIdentityGsm cellIdentityGsm = cellInfoGsm.getCellIdentity();
    CellSignalStrengthGsm signalStrengthGsm = cellInfoGsm.getCellSignalStrength();

    cellInfoMap.putInt("mcc", cellIdentityGsm.getMcc());
    cellInfoMap.putInt("mnc", cellIdentityGsm.getMnc());
    cellInfoMap.putInt("cellIdentity", cellIdentityGsm.getCid());
    cellInfoMap.putInt("lac", cellIdentityGsm.getLac());
    cellInfoMap.putInt("Dbm", signalStrengthGsm.getDbm());
    cellInfoMap.putInt("signalStrengthLevel", signalStrengthGsm.getLevel());

    return cellInfoMap;
}

// Helper method to get WritableMap for WCDMA CellInfo
private WritableMap getWcdmaCellInfoMap(CellInfoWcdma cellInfoWcdma) {
    WritableMap cellInfoMap = Arguments.createMap();
    CellIdentityWcdma cellIdentityWcdma = cellInfoWcdma.getCellIdentity();
    CellSignalStrength signalStrengthWcdma = cellInfoWcdma.getCellSignalStrength();

    cellInfoMap.putInt("lac", cellIdentityWcdma.getLac());
    cellInfoMap.putInt("cellIdentity", cellIdentityWcdma.getCid());
    cellInfoMap.putInt("psc", cellIdentityWcdma.getPsc());
    cellInfoMap.putInt("mcc", cellIdentityWcdma.getMcc());
    cellInfoMap.putInt("mnc", cellIdentityWcdma.getMnc());
    cellInfoMap.putInt("Dbm", signalStrengthWcdma.getDbm());
    cellInfoMap.putInt("signalStrengthLevel", signalStrengthWcdma.getLevel());

    return cellInfoMap;
}

// Helper method to get WritableMap for CDMA CellInfo
private WritableMap getCdmaCellInfoMap(CellInfoCdma cellInfoCdma) {
    WritableMap cellInfoMap = Arguments.createMap();
    CellIdentityCdma cellIdentityCdma = cellInfoCdma.getCellIdentity();
    CellSignalStrength signalStrengthCdma = cellInfoCdma.getCellSignalStrength();

    cellInfoMap.putInt("systemId", cellIdentityCdma.getSystemId());
    cellInfoMap.putInt("networkId", cellIdentityCdma.getNetworkId());
    cellInfoMap.putInt("basestationId", cellIdentityCdma.getBasestationId());
    cellInfoMap.putInt("Dbm", signalStrengthCdma.getDbm());
    cellInfoMap.putInt("signalStrengthLevel", signalStrengthCdma.getLevel());

    return cellInfoMap;
}

// Helper method to get WritableMap for LTE CellInfo
private WritableMap getLteCellInfoMap(CellInfoLte cellInfoLte) {
    WritableMap cellInfoMap = Arguments.createMap();
    CellIdentityLte cellIdentityLte = cellInfoLte.getCellIdentity();
    CellSignalStrengthLte signalStrengthLte = cellInfoLte.getCellSignalStrength();

    cellInfoMap.putInt("rsrp", signalStrengthLte.getRsrp());
    cellInfoMap.putInt("cellIdentity", cellIdentityLte.getCi());
    cellInfoMap.putInt("pci", cellIdentityLte.getPci());
    cellInfoMap.putInt("Dbm", signalStrengthLte.getDbm());
    cellInfoMap.putInt("mcc", cellIdentityLte.getMcc());
    cellInfoMap.putInt("tac", cellIdentityLte.getTac());
    cellInfoMap.putInt("mnc", cellIdentityLte.getMnc());
    cellInfoMap.putInt("signalStrengthLevel", signalStrengthLte.getLevel());

    return cellInfoMap;
}

// Modify getCellInfoMap method to handle GSM, CDMA, WCDMA and LTE
private WritableMap getCellInfoMap(CellInfo cellInfo) {
    if (cellInfo instanceof CellInfoLte) {
        return getLteCellInfoMap((CellInfoLte) cellInfo);
    } else if (cellInfo instanceof CellInfoGsm) {
        return getGsmCellInfoMap((CellInfoGsm) cellInfo);
    } else if (cellInfo instanceof CellInfoCdma) {
        return getCdmaCellInfoMap((CellInfoCdma) cellInfo);
    } else if (cellInfo instanceof CellInfoWcdma) {
        return getWcdmaCellInfoMap((CellInfoWcdma) cellInfo);
    }

    return null;
}


// Helper method to get ASU level
private int getAsuLevel(CellInfo cellInfo) {
    int asuLevel = -1;
    if (cellInfo instanceof CellInfoLte) {
        asuLevel = ((CellInfoLte) cellInfo).getCellSignalStrength().getAsuLevel();
    } else if (cellInfo instanceof CellInfoGsm) {
        asuLevel = ((CellInfoGsm) cellInfo).getCellSignalStrength().getAsuLevel();
    } else if (cellInfo instanceof CellInfoCdma) {
        asuLevel = ((CellInfoCdma) cellInfo).getCellSignalStrength().getAsuLevel();
    } else if (cellInfo instanceof CellInfoWcdma) {
        asuLevel = ((CellInfoWcdma) cellInfo).getCellSignalStrength().getAsuLevel();
    }
    return asuLevel;
}

// Helper method to get CellInfo for the current network type
private CellInfo getCellInfoForNetworkType(TelephonyManager telephonyManager) {
    List<CellInfo> cellInfoList = telephonyManager.getAllCellInfo();
    if (cellInfoList != null && !cellInfoList.isEmpty()) {
        // Assuming primary cell
        return cellInfoList.get(0);
    }
    return null;
}


@ReactMethod
public void getSimState(Promise promise) {
    try {
        int simCount = telephonyManager.getPhoneCount();
        WritableArray simStates = Arguments.createArray();

        for (int subscriptionId = 0; subscriptionId < simCount; subscriptionId++) {
            try {
                int simState = telephonyManager.getSimState(subscriptionId);
                simStates.pushInt(simState);
            } catch (Exception e) {
                simStates.pushNull();
            }
        }

        promise.resolve(simStates);
    } catch (Exception e) {
        promise.reject("SIM_STATE_ERROR", e.getMessage());
    }
}

@ReactMethod
public void getCallStates(Promise promise) {
    try {
        int simCount = telephonyManager.getPhoneCount();
        WritableArray callStates = Arguments.createArray();

        for (int subscriptionId = 0; subscriptionId < simCount; subscriptionId++) {
            try {
                TelephonyManager telephonyManagerForSlot = telephonyManager.createForSubscriptionId(subscriptionId);
                int callState = telephonyManagerForSlot.getCallState();
                callStates.pushInt(callState);
            } catch (Exception e) {
                callStates.pushNull();
            }
        }

        promise.resolve(callStates);
    } catch (Exception e) {
        promise.reject("CALL_STATE_ERROR", e.getMessage());
    }
}

@ReactMethod
public void getPhoneTypes(Promise promise) {
    try {
        int simCount = telephonyManager.getPhoneCount();
        WritableArray phoneTypes = Arguments.createArray();

        for (int subscriptionId = 0; subscriptionId < simCount; subscriptionId++) {
            try {
                TelephonyManager telephonyManagerForSlot = telephonyManager.createForSubscriptionId(subscriptionId);
                int phoneType = telephonyManagerForSlot.getPhoneType();
                phoneTypes.pushInt(phoneType);
            } catch (Exception e) {
                phoneTypes.pushNull();
            }
        }

        promise.resolve(phoneTypes);
    } catch (Exception e) {
        promise.reject("PHONE_TYPE_ERROR", e.getMessage());
    }
}


@ReactMethod
public void measureUploadSpeed(String url, String data, Promise promise) {
    OkHttpClient client = new OkHttpClient();

    // Convert the data to a request body
    RequestBody requestBody = RequestBody.create(MediaType.parse("application/octet-stream"), data);

    Request request = new Request.Builder().url(url).post(requestBody).build();

    try {
        long startTime = System.currentTimeMillis();
        Response response = client.newCall(request).execute();
        long endTime = System.currentTimeMillis();
        long uploadTime = endTime - startTime;

        if (uploadTime > 0) {
            // Calculate upload speed in Mbps
            double uploadSpeedMbps = (data.length() / 1024.0) / (uploadTime / 1000.0); // Convert to Mbps
            promise.resolve(uploadSpeedMbps);
        } else {
            promise.reject("UPLOAD_SPEED_ERROR", "Upload speed measurement failed");
        }
    } catch (IOException e) {
        promise.reject("UPLOAD_SPEED_ERROR", e.getMessage());
    }
}

@ReactMethod
public void measureDownloadSpeed(String url, Promise promise) {
    OkHttpClient client = new OkHttpClient();
    Request request = new Request.Builder().url(url).build();

    try {
        long startTime = System.currentTimeMillis();
        Response response = client.newCall(request).execute();
        long endTime = System.currentTimeMillis(); // Move this line inside the try block

        long fileSize = response.body().contentLength();
        long downloadTime = endTime - startTime;

        if (downloadTime > 0) {
            double downloadSpeedMbps = (fileSize / 1024.0) / (downloadTime / 1000.0); // Convert to Mbps
            promise.resolve(downloadSpeedMbps);
        } else {
            promise.reject("DOWNLOAD_SPEED_ERROR", "Download speed measurement failed");
        }
    } catch (IOException e) {
        promise.reject("DOWNLOAD_SPEED_ERROR", e.getMessage());
    }
}


@ReactMethod
public void measureLatency(String host, Promise promise) {
    try {
        InetAddress address = InetAddress.getByName(host);
        long startTime = System.currentTimeMillis();
        if (address.isReachable(5000)) { // Timeout in milliseconds
            long endTime = System.currentTimeMillis();
            long latency = endTime - startTime;

            // Convert long to double before resolving
            double latencyInSeconds = latency / 1000.0;
            promise.resolve(latencyInSeconds);
        } else {
            promise.reject("LATENCY_ERROR", "Host is not reachable");
        }
    } catch (UnknownHostException e) {
        promise.reject("LATENCY_ERROR", e.getMessage());
    } catch (IOException e) {
        promise.reject("LATENCY_ERROR", e.getMessage());
    }
}



  @Override
  public String getName() {
    return "RadioParameters";
  }
}