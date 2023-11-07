function calculateNetworkMetrics(data) {
  // Define conversion factors
  const bitsInByte = 8;
  const bytesInKB = 1024;
  const bytesInMB = 1024 * 1024;

  // Convert data to consistent units
  const receivedSpeedInBps = parseInt(data.receivedNetworkSpeed, 10); // Convert to integer
  const receivedTotalInMB = parseFloat(data.receivedNetworkTotal);
  const sendSpeedInBps = parseInt(data.sendNetworkSpeed, 10); // Convert to integer
  const sendTotalInKB = parseFloat(data.sendNetworkTotal);

  // Calculate download and upload speeds in Mbps
  const downloadSpeedInMbps = receivedSpeedInBps / bitsInByte / bytesInMB;
  const uploadSpeedInMbps = sendSpeedInBps / bitsInByte / bytesInMB;

  // Calculate latency (time taken to send data) in milliseconds
  const latencyInSeconds =
    (sendTotalInKB * bytesInKB) / (sendSpeedInBps / bitsInByte);
  const latencyInMilliseconds = latencyInSeconds * 1000;

  return {
    downloadSpeedInMbps,
    uploadSpeedInMbps,
    latencyInMilliseconds, // Updated to provide latency in milliseconds
  };
}

// Example data
const networkData = {
  receivedNetworkSpeed: '102B/s',
  receivedNetworkTotal: '8.4MB',
  sendNetworkSpeed: '225B/s',
  sendNetworkTotal: '261.0KB',
};

// Calculate network metrics
const metrics = calculateNetworkMetrics(networkData);

// Output the results
console.log('Download Speed (Mbps):', metrics.downloadSpeedInMbps);
console.log('Upload Speed (Mbps):', metrics.uploadSpeedInMbps);
console.log('Latency (milliseconds):', metrics.latencyInMilliseconds);
