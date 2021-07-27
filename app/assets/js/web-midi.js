
import { initTestControllerForm } from './test-controllers.js';

const webMidiConnectButton = document.querySelector('#web-midi-connect-device');
let inputID = false;
let outputID = false;
let midi = false;
let midiDevices = {};
let midiIn = {
  channel: 0,
  enabled: false
};
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

// function onMIDIMessage(event) {
//   if (midiIn && midiIn.enabled) {
//     // let str = "";
//     const eventMidiChannel = event.data && event.data[0] ? (event.data[0] & 0x0F) : false;
//     const eventMidiCC = event.data && event.data[1] ? event.data[1] : false;
//     const eventMidiCCValue = event.data && event.data[2] ? event.data[2] : false;

//     if ((eventMidiChannel === midiIn.channel) && eventMidiCC && eventMidiCCValue) {
//       const eventType = event.data[0] & 0xf0;

//       if (eventType === 0xB0) {
//         // updateSliderValue(eventMidiChannel, eventMidiCC, eventMidiCCValue);
//         // updateMidiPatch(eventMidiChannel, eventMidiCC, eventMidiCCValue);
//       }
//     }
//   }
// }

function onMIDIFailure(msg) {
  alert(`midi failure: ${msg}`);
  console.log(`midi failure: ${msg}`);
}

// function sendWebMidiEvent(selectedMidiChannel, selectedMidiCC, selectedMidiCCValue) {
//   let selectedMidiChannelHex = parseInt(selectedMidiChannel).toString(16);
//   let output = false;

//   if (midi && midi.outputs && outputID) {
//     output = midi.outputs.get(outputID);

//     if (output) {
//       output.send(["0xB" + selectedMidiChannelHex, selectedMidiCC, selectedMidiCCValue]);
//     }
//   }

//   // Always check/update MIDI status
//   initWebMidi();
// }

// function updateSliderValue(midiChannel, midiCC, midiCCValue) {
//   let slider = document.querySelectorAll(`[data-midi-channel='${midiChannel}'][data-midi-cc='${midiCC}']`)[0];

//   slider.value = midiCCValue;

//   markControlChange(midiChannel, midiCC, slider);
// }

function initSliderEvents() {
  let ranges = document.getElementsByTagName("input");

  for (var i = 0; i < ranges.length; i++) {
    if (ranges[i].type === 'range') {
      ranges[i].addEventListener('change', function () {
        handlePatchChanges(this, this);
      });
    }
  }
}

// function handlePatchChanges(changedOption, control) {
//   const selectedMidiCC = getComponentMidiCC(control);
//   const selectedMidiCCValue = changedOption.value;
//   const selectedMidiChannel = getComponentMidiChannel(control);

//   // console.log({ changedOption, control });
//   // console.log({ parent: control.closest('.component-section') });
//   console.log({ selectedMidiChannel });

//   markControlChange(selectedMidiChannel, selectedMidiCC, control);
//   // updateMidiPatch(selectedMidiChannel, selectedMidiCC, selectedMidiCCValue);
//   sendWebMidiEvent(selectedMidiChannel, selectedMidiCC, selectedMidiCCValue);
// }

// function sendWebMidiEvent(selectedMidiChannel, selectedMidiCC, selectedMidiCCValue) {
//   let selectedMidiChannelHex = parseInt(selectedMidiChannel).toString(16);
//   let output = false;

//   if (midi && midi.outputs && outputID) {
//     output = midi.outputs.get(outputID);

//     if (output) {
//       output.send(["0xB" + selectedMidiChannelHex, selectedMidiCC, selectedMidiCCValue]);
//     }
//   }

//   // Always check/update MIDI status
//   initWebMidi();
// }

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