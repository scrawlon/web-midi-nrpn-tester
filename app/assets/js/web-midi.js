
import { initTestControllerForm } from './test-controllers.js';

const messageHolder = document.querySelector('#web-midi-connection-status');
const nrpnMidiEventStatus = document.querySelector('#nrpn-midi-event-status');
const nrpnLastMidiEvent = nrpnMidiEventStatus.querySelector('#last-midi-event');

let outputID = false;
let midi = false;
let midiDevices = {};
let midiStatus = {
  input: false,
  output: false
};
let loadTestControllerForm = true;

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

  if (loadTestControllerForm) {
    initTestControllerForm();
    loadTestControllerForm = false;
  }
}

function onMIDIFailure(msg) {
  alert(`midi failure: ${msg}`);
  console.log(`midi failure: ${msg}`);
}

function sendMidiNRPN(channel, msb, lsb, value) {
  let output = false;

  if (midi && midi.outputs && outputID) {
    let midiChannel = 0xB0 + (channel - 1);

    output = midi.outputs.get(outputID);

    if (output) {
      /* MSB */
      output.send([midiChannel, 99, msb]);

      /* LSB */
      output.send([midiChannel, 98, lsb]);

      /* value */
      output.send([midiChannel, 6, value]);

      updateMidiEventStatus(channel, msb, lsb, value);
    }
  }
}

function updateMidiEventStatus(midiChannel, msb, lsb, value) {
  let midiEventStatusHtml = `
    MIDI Channel: ${midiChannel}<br />
  
    <table>
      <tbody>
        <tr>
          <th scope="row">MSB</th>
          <td>CC 99</td>
          <td>value ${msb}</td>
        </tr>
        <tr>
          <th scope="row">LSB</th>
          <td>CC 98</td>
          <td>value ${lsb}</td>
        </tr>
        <tr>
          <th scope="row">Value</th>
          <td>CC 6</td>
          <td>value ${value}</td>
        </tr>
      </tbody>
    </table>
  `;
  nrpnLastMidiEvent.innerHTML = '';
  nrpnLastMidiEvent.insertAdjacentHTML('beforeend', midiEventStatusHtml);
  nrpnMidiEventStatus.classList.remove('hidden');
}

export { initWebMidi, sendMidiNRPN }