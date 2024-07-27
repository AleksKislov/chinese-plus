import { $, component$, useSignal } from "@builder.io/qwik";

export const TonesPractice = component$(() => {
  const isRecording = useSignal(false);

  const init = $(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;

    const canvas = document.getElementById("pitchCanvas");
    const ctx = canvas.getContext("2d");
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    let startTime;
    const DURATION = 5; // Duration in seconds
    const NOISE_THRESHOLD = 100; // Increased noise threshold
    const MIN_FREQUENCY = 85; // Minimum frequency to detect (Hz)
    const MAX_FREQUENCY = 255; // Maximum frequency to detect (Hz)
    const INITIAL_DELAY = 0.2; // 200 milliseconds delay
    const SMOOTHING_FACTOR = 0.8; // Smoothing factor for pitch

    let lastFrequency = 0;
    let isDrawing = false;

    function getDominantFrequency(frequencyData) {
      let maxAmplitude = 0;
      let dominantFrequency = 0;
      const minIndex = Math.floor((MIN_FREQUENCY * analyzer.fftSize) / audioContext.sampleRate);
      const maxIndex = Math.ceil((MAX_FREQUENCY * analyzer.fftSize) / audioContext.sampleRate);

      for (let i = minIndex; i < maxIndex; i++) {
        if (frequencyData[i] > maxAmplitude) {
          maxAmplitude = frequencyData[i];
          dominantFrequency = (i * audioContext.sampleRate) / analyzer.fftSize;
        }
      }

      return maxAmplitude > NOISE_THRESHOLD ? dominantFrequency : 0;
    }

    function smoothFrequency(newFrequency) {
      if (lastFrequency === 0) {
        lastFrequency = newFrequency;
      } else {
        lastFrequency = SMOOTHING_FACTOR * lastFrequency + (1 - SMOOTHING_FACTOR) * newFrequency;
      }
      return lastFrequency;
    }

    function drawPitchContour() {
      const currentTime = audioContext.currentTime - startTime;
      if (currentTime > DURATION) {
        return; // Stop drawing after 5 seconds
      }

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyzer.getByteFrequencyData(dataArray);

      let frequency = getDominantFrequency(dataArray);
      frequency = smoothFrequency(frequency);

      const x = (currentTime / DURATION) * WIDTH;
      const y = frequency ? HEIGHT - (frequency / MAX_FREQUENCY) * HEIGHT : HEIGHT;

      if (frequency && currentTime > INITIAL_DELAY) {
        if (!isDrawing) {
          ctx.moveTo(x, y);
          isDrawing = true;
        } else {
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      } else {
        isDrawing = false;
      }

      requestAnimationFrame(drawPitchContour);
    }

    function startRecording() {
      ctx.fillStyle = "rgb(200, 200, 200)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.beginPath();

      startTime = audioContext.currentTime;
      drawPitchContour();
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(function (stream) {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer);
        startRecording();

        // Stop the stream after 5 seconds
        setTimeout(() => {
          stream.getTracks().forEach((track) => track.stop());
          console.log("Recording stopped after 5 seconds");
        }, DURATION * 1000);
      })
      .catch(function (err) {
        console.error("Error accessing the microphone", err);
      });
  });

  const stopCapture = $(() => {
    if (!isRecording.value) return;

    isRecording.value = false;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    // console.log("Recording stopped");

    // document.getElementById("startButton").disabled = false;
    // document.getElementById("stopButton").disabled = true;
  });

  return (
    <>
      <div class='prose mb-1 mt-3'>
        <h4>四声 4 тона</h4>
      </div>
      <div id='container'>
        <div class='btn btn-sm btn-primary' onClick$={init}>
          start
        </div>
        <div class='btn btn-sm btn-primary' onClick$={stopCapture}>
          stop
        </div>
        <canvas id='pitchCanvas' width='800' height='400'></canvas>
      </div>
    </>
  );
});
