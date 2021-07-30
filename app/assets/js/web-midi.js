
import { initTestControllerForm } from './test-controllers.js';

const webMidiConnectButton = document.querySelector('#web-midi-connect-device');
const messageHolder = document.getElementById('web-midi-connection-status');
const midiConnectButton = document.querySelector('#web-midi-connect-device');

// let inputID = false;
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
  } else {
    // Web Midi not supported, or user denied access
    onMIDIFailure('Your browser does not support web midi. See here for a list of supported browsers: https://caniuse.com/?search=web%20midi');
  }
}

function onMIDISuccess(MIDIAccess) {
  midi = MIDIAccess;
  midiDevices.outputs = getMidiDevices('outputs');

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

  initWebMidiEvents();
}

function getMidiDevices(connectionType) {
  if (midi && midi[connectionType] && midi.size !== 0) {
    return midi[connectionType];
  }
}

function updateMidiStatus() {
  const midiOutText = midiStatus.output ? '&#10003;' : '<span class="error">x</span>';

  messageHolder.innerHTML = `
    MIDI OUT: ( ${midiOutText} ) <br />
  `;
}

function initWebMidiEvents() {
  if (midi) {
    midi.addEventListener('statechange', () => initWebMidi());
  }

  initTestControllerForm();
}

function onMIDIFailure(msg) {
  alert(`midi failure: ${msg}`);
  console.log(`midi failure: ${msg}`);
}

function sendMidiNRPN(channel, msb, lsb, value) {
  let output = false;

  if (midi && midi.outputs && outputID) {
    output = midi.outputs.get(outputID);

    if (output) {
      console.log({ channel, msb, lsb, value });
      /* MSB */
      output.send([0xB0 + (channel - 1), 99, msb]);

      /* LSB */
      output.send([0xB0 + (channel - 1), 98, lsb]);

      /* value */
      output.send([0xB0 + (channel - 1), 6, value]);
    }
  }
}

export { initWebMidi, sendMidiNRPN }