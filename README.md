# Web MIDI NRPN Tester

Simple app for creating MIDI NRPN controllers and sending NRPN messages to external devices via Web MIDI.

---
**NOTE:** *Web MIDI is not supported in all browsers. Google Chrome is recommended, but check 
[caniuse.com for more info on browser support.](https://caniuse.com/?search=web%20midi)*

---
## Quick Intro to MIDI NRPN

If you're new to the idea of NRPN midi events, it can be a bit confusing. 
Normal MIDI CC messages are sent as one event, including MIDI Channel, CC # and value.
However, NRPN MIDI messages are sent as three or four separate events
in this specific order:

- MIDI Channel, CC 99, MSB value
- MIDI Channel, CC 98, LSB value
- MIDI Channel, CC 6, value
- MIDI Channel, CC 38, value

**NOTE:** *The fourth event is optional, and sets a "fine-tune" value. More info available 
[on Wikipedia](https://en.wikipedia.org/wiki/NRPN)*

For example, from the Novation Circuit Programmers Reference Guide,
NRPN "FX Bypass" is a Session parameter (default MIDI Channel 16), 
with the following settings:

| Control Number | Range |
|----------------|-------|
| 1:21           | 0-1   |

To change "FX Bypass" NRPN value to "1" you would need to send the 
following three MIDI events:

- MIDI Channel 16, CC 99, MSB value 1
- MIDI Channel 16, CC 98, LSB value 21
- MIDI Channel 16, CC 6, value 1

---
## User Guide

This app allows you to experiment with MIDI NRPNs by:
- Connecting to an external MIDI device via Web MIDI
- Creating interactive MIDI NRPN controllers
- Monitoring the MIDI NRPN events as they're being transmitted to your external MIDI device

### 1.  Open the App

[Click here to launch the application.](https://scrawlon.com/web-midi-nrpn-tester/app/)

*Google Chrome is recommended, but check 
[caniuse.com for more info on browser support.](https://caniuse.com/?search=web%20midi)*

### 2. Connect a MIDI Device
Connect an external MIDI device to your computer. Once connected, the "MIDI OUT" display at the top of the screen should change from a red "x" to a "&#10003;".

I'll be using the Novation Circuit as an example in this guide. It uses a USB cable to connect to a computer.

### 3. Create an NRPN Controller

The Novation Circuit Programmers Reference Guide lists the following for the Session NRPN parameter "FX Bypass".

| Control Number | Range |
|----------------|-------|
| 1:21           | 0-1   |

For an NRPN controller, this translates to:

- MSB: 1
- LSB: 21
- Value: 0 - 1
- MIDI Channel: 16 (default for Session parameters on the Novation Circuit)

To create an NRPN test controller for this parameter, enter those
values in the form, and choose a controller type.

![Create an NRPN controller form](/app/assets/images/create-nrpn-fx-bypass.png)

There are three available controller types: "slider", "select"
and "radio". For the above, there are only two possible values 
(0 and 1), so I would choose the "radio" type.

![NRPN test controller](/app/assets/images/nrpn-controller-fx-bypass.png)

### 4. Send NRPN MIDI events

Once you have one or more NRPN test controllers, you can send NRPN
MIDI events by adjusting the "SEND MIDI" controls. For the "FX Bypass"
controller described above, you could select "0" or "1" to transmit
the NRPN value to a Novation Circuit.

A small status window will display information about the last MIDI 
sent MIDI event.


![NRPN MIDI event status](/app/assets/images/nrpn-midi-event-status.png)