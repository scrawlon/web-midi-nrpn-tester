
import { initTestControllerForm } from './test-controllers.js';

const webMidiConnectButton = document.querySelector('#web-midi-connect-device');

let inputID = false;
let outputID = false;
let midi = false;
let midiDevices = {};
let midiStatus = {
  input: false,
  output: false
};

function initWebMidi() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    initWebMidiEvents();
  } else {
    // Web Midi not supported, or user denied access
    onMIDIFailure('Your browser does not support web midi. See here for a list of supported browsers: https://caniuse.com/?search=web%20midi');
  }
}

function initWebMidiEvents() {
  webMidiConnectButton.addEventListener('click', function () {
    if (!midiStatus.input || !midiStatus.output) {
      initWebMidi();
    }
  });

  initTestControllerForm();
}

function onMIDISuccess(MIDIAccess) {
  midi = MIDIAccess;
  midiDevices.inputs = getMidiDevices(midi, 'inputs');
  midiDevices.outputs = getMidiDevices(midi, 'outputs');

  if (!midiDevices.inputs.size) {
    midiStatus.input = false;
    updateMidiStatus();
  } else {
    midiDevices.inputs.forEach(function (device) {
      if (device.name.toLowerCase() === 'circuit') {
        midiStatus.input = true;
        updateMidiStatus();
        device.onmidimessage = onMIDIMessage;
        inputID = device.id;
      }
    });
  }

  if (!midiDevices.outputs.size) {
    midiStatus.output = false;
    updateMidiStatus();
  } else {
    midiDevices.outputs.forEach(function (device) {
      if (device.name.toLowerCase() === 'circuit') {
        midiStatus.output = true;
        updateMidiStatus();
        outputID = device.id;
      }
    });
  }
}

function getMidiDevices(midi, connectionType) {
  if (midi && midi[connectionType] && midi.size !== 0) {
    return midi[connectionType];
  }
}

function updateMidiStatus() {
  const messageHolder = document.getElementById('web-midi-connection-status');
  const midiInText = midiStatus.input ? '&#10003;' : '<span class="error">x</span>';
  const midiOutText = midiStatus.output ? '&#10003;' : '<span class="error">x</span>';
  const midiConnectButton = document.querySelector('#web-midi-connect-device');

  messageHolder.innerHTML = `
        MIDI IN: ( ${midiInText} ) MIDI OUT: ( ${midiOutText} ) <br />
      `;

  if (!midiStatus.input || !midiStatus.output) {
    midiConnectButton.style.visibility = 'visible';
  } else {
    midiConnectButton.style.visibility = 'hidden';
  }
}

function onMIDIFailure(msg) {
  alert(`midi failure: ${msg}`);
  console.log(`midi failure: ${msg}`);
}

function sendMidiNRPN(channel, msb, lsb, value) {
  let channelHex = parseInt(channel - 1).toString(16);
  let output = false;

  if (midi && midi.outputs && outputID) {
    output = midi.outputs.get(outputID);

    if (output) {
      /* MSB */
      output.send(["0xB" + channelHex, 99, msb]);

      /* LSB */
      output.send(["0xB" + channelHex, 98, lsb]);

      /* value */
      output.send(["0xB" + channelHex, 6, value]);
    }
  }

  // Always check/update MIDI status
  initWebMidi();
}

export { initWebMidi, sendMidiNRPN }