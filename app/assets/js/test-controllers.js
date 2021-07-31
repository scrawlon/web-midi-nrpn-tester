
import { sendMidiNRPN } from "./web-midi.js";

const nrpnControllerValuesForm = document.querySelector('form#nrpn-controller-values');
const nrpnTestControllers = document.querySelector('#nrpn-test-controllers');

function initTestControllerForm() {
  initTestControllerEvents();

  nrpnControllerValuesForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const nrpnControllerValuesInputs = new FormData(event.target);
    let nrpnControllerValues = {};

    for (var input of nrpnControllerValuesInputs.entries()) {
      const [key, value] = input;

      nrpnControllerValues[key] = value;
    };

    addTestController(nrpnControllerValues);
  });
}

function addTestController(nrpnControllerValues) {
  const { msb, lsb, min, max, channel } = nrpnControllerValues;
  const controllerId = `nrpn-${Date.now()}`;
  const controllerHtml = `
    <div class="component-value" 
      data-msb="${msb}" 
      data-lsb="${lsb}" 
      data-channel="${channel}"> 
      <div class="close">x</div>
      <label for="channel-${controllerId}">MIDI Channel</label>
      <input type="number" name="channel-${controllerId}" id="channel-${controllerId}" min="1" max="16" value="${channel}"/>
      <label for="${controllerId}">MSB ${msb} : LSB ${lsb} | (${min} - ${max})</label><br>
      <input 
        type="range" 
        name="${controllerId}" 
        id="${controllerId}" 
        class="midi-send"
        min="${min}" 
        max="${max}" 
        value="${min}"/>
      <output name="display" for="${controllerId}">${min}</output>
    </div>      
  `;

  nrpnTestControllers.insertAdjacentHTML('beforeend', controllerHtml);
}

function initTestControllerEvents() {
  nrpnTestControllers.addEventListener('input', function (event) {
    const { target: controller } = event;

    /* update slider display value in realtime */
    if (controller && controller.classList.contains('midi-send')) {
      controller.nextElementSibling.value = controller.value;
    }
  });

  nrpnTestControllers.addEventListener('change', function (event) {
    const { target: controller } = event;

    /* send MIDI event */
    if (controller && controller.classList.contains('midi-send')) {
      sendMidiControllerValues(controller);
    }
  });

  nrpnTestControllers.addEventListener('click', function (event) {
    const { target: controller } = event;

    /* Remove test controller */
    if (controller && controller.classList.contains('close')) {
      const component = controller.closest('.component-value');

      if (component) {
        component.remove();
      }
    }
  });
}

function sendMidiControllerValues(controller) {
  const component = controller.closest('.component-value');
  const channel = component.querySelector('[name^="channel"]');
  const { msb, lsb } = component.dataset;

  if (channel, msb, lsb) {
    sendMidiNRPN(parseInt(channel.value), parseInt(msb), parseInt(lsb), parseInt(controller.value));
  }
}

export { initTestControllerForm }