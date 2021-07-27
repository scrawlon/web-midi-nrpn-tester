
// import { initWebMidi } from './web-midi.js';

// // function sendWebMidiEvent(selectedMidiChannel, selectedMidiCC, selectedMidiCCValue) {
// //   let selectedMidiChannelHex = parseInt(selectedMidiChannel).toString(16);
// //   let output = false;

// //   if (midi && midi.outputs && outputID) {
// //     output = midi.outputs.get(outputID);

// //     if (output) {
// //       output.send(["0xB" + selectedMidiChannelHex, selectedMidiCC, selectedMidiCCValue]);
// //     }
// //   }

// //   // Always check/update MIDI status
// //   initWebMidi();
// // }

// function sendMidiNRPN(channel, msb, lsb, value) {
//   let channel = parseInt(channel).toString(16);
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


// export { sendMidiNRPN }