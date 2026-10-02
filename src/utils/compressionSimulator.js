/**
 * Edge Gateway Payload Compression & Bandwidth Simulator
 * Simulates bytes saved via Protobuf / Gzip serialization over low-bandwidth SATCOM
 */

export function calculatePayloadMetrics(telemetryObject, compressionMode = 'PROTOBUF') {
  const jsonString = JSON.stringify(telemetryObject);
  const rawBytes = new TextEncoder().encode(jsonString).length;

  let compressedBytes = rawBytes;
  let algorithmName = 'Raw JSON';

  if (compressionMode === 'PROTOBUF') {
    // Binary schema serialization (~90% compression)
    compressedBytes = Math.round(rawBytes * 0.11);
    algorithmName = 'Protobuf Binary';
  } else if (compressionMode === 'GZIP') {
    // DEFLATE algorithm (~75% compression)
    compressedBytes = Math.round(rawBytes * 0.24);
    algorithmName = 'Gzip Stream';
  } else if (compressionMode === 'FLATBUFFERS') {
    compressedBytes = Math.round(rawBytes * 0.14);
    algorithmName = 'FlatBuffers Zero-Copy';
  }

  const compressionRatio = (((rawBytes - compressedBytes) / rawBytes) * 100).toFixed(1);

  return {
    rawBytes,
    compressedBytes,
    bytesSaved: rawBytes - compressedBytes,
    compressionRatio: `${compressionRatio}%`,
    algorithmName
  };
}
