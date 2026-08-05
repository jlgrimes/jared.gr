/**
 * Mic capture worklet, shipped as a source string.
 *
 * An AudioWorklet module has to be loaded from a URL, and a package can't rely on the host
 * app serving a static asset. Compiling it to a Blob URL at runtime keeps the whole pipeline
 * inside this package with nothing to wire up in `public/`.
 *
 * It does two jobs from one capture: batch PCM for the socket, and report a level for the
 * waveform. Two consumers, one microphone — which also avoids the permission contention you
 * get from opening the mic twice.
 */
const WORKLET_SOURCE = /* js */ `
class FlowCaptureProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    // ~64ms at 16kHz: small enough to feel live, large enough not to flood the socket
    // with 128-sample frames every 8ms.
    this._batchSize = (options.processorOptions && options.processorOptions.batchSize) || 1024;
    this._buffer = new Float32Array(this._batchSize);
    this._offset = 0;
  }

  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel) return true;

    for (let i = 0; i < channel.length; i++) {
      this._buffer[this._offset++] = channel[i];
      if (this._offset < this._batchSize) continue;

      // Float32 [-1,1] -> little-endian PCM16, the format the start frame declares.
      const pcm = new Int16Array(this._batchSize);
      let sumSquares = 0;
      for (let j = 0; j < this._batchSize; j++) {
        const sample = Math.max(-1, Math.min(1, this._buffer[j]));
        pcm[j] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        sumSquares += sample * sample;
      }

      this.port.postMessage(
        { pcm: pcm.buffer, rms: Math.sqrt(sumSquares / this._batchSize) },
        [pcm.buffer]
      );
      this._offset = 0;
    }
    return true;
  }
}

registerProcessor('flow-capture', FlowCaptureProcessor);
`;

let cachedUrl: string | null = null;

export const captureWorkletUrl = () => {
  if (cachedUrl) return cachedUrl;
  cachedUrl = URL.createObjectURL(
    new Blob([WORKLET_SOURCE], { type: 'application/javascript' })
  );
  return cachedUrl;
};

export const CAPTURE_SAMPLE_RATE = 16000;
export const CAPTURE_PROCESSOR = 'flow-capture';
