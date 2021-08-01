
import { sendMidiNRPN } from "./web-midi.js";

const nrpnControllerValuesForm = document.querySelector('div#nrpn-controller-values form');
const nrpnTestControllers = document.querySelector('#nrpn-test-controllers');

function initTestControllerForm() {
  initTestControllerCreateButtons();
  initTestControllerEvents();

  // nrpnControllerValuesForm.addEventListener('click', function (event) {
  //   event.preventDefault();

  //   const { target } = event;


  //   if (target.type === 'button') {
  //     addTestController(target.value);
  //   }

  //   // const nrpnControllerValuesInputs = new FormData(event.target);
  //   // let nrpnControllerValues = {};

  //   // for (var input of nrpnControllerValuesInputs.entries()) {
  //   //   const [key, value] = input;

  //   //   nrpnControllerValues[key] = value;
  //   // };

  //   // addTestController(nrpnControllerValues);
  // });
}

function initTestControllerCreateButtons() {
  const testControllerCreateButtons = nrpnControllerValuesForm.querySelectorAll('input[type="button"]');

  testControllerCreateButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      const controllerValues = getControllerValues();
      const controllerType = button.value;

      addTestController(controllerValues, controllerType);
    });
  });
}

function getControllerValues() {
  const nrpnControllerValuesInputs = new FormData(nrpnControllerValuesForm);
  let nrpnControllerValues = {};

  for (var input of nrpnControllerValuesInputs.entries()) {
    const [key, value] = input;

    nrpnControllerValues[key] = value;
  };

  return nrpnControllerValues;
}

function initTestControllerEvents() {
  nrpnTestControllers.addEventListener('input', function (event) {
    const { target: controller } = event;

    /* update slider display value in realtime */
    if (controller && controller.classList.contains('midi-send') && controller.type === 'range') {
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

function addTestController(nrpnControllerValues, controllerType) {
  const { msb, lsb, min, max, channel } = nrpnControllerValues;
  const controllerId = `nrpn-${Date.now()}`;
  const controllerHtml = getControllerHtml(controllerType, controllerId, min, max);
  const componentHtml = `
    <div class="component-value" 
      data-msb="${msb}" 
      data-lsb="${lsb}" 
      data-channel="${channel}"> 
      <div class="close">x</div>
      <label for="channel-${controllerId}">MIDI Channel</label>
      <input type="number" name="channel-${controllerId}" id="channel-${controllerId}" min="1" max="16" value="${channel}"/>
      <label for="${controllerId}">MSB ${msb} : LSB ${lsb} | (${min} - ${max})</label><br>

      ${controllerHtml}
    </div>      
  `;

  nrpnTestControllers.insertAdjacentHTML('beforeend', componentHtml);
}

function getControllerHtml(controllerType, controllerId, min, max) {
  switch (controllerType) {
    case 'slider':
      return `
        <label for="${controllerId}">SEND MIDI</label>
        <input type="range" name="${controllerId}" id="${controllerId}" class="midi-send" min="${min}"  max="${max}" value="${min}"/>
        <output name="display" for="${controllerId}">${min}</output>              
      `;
    case 'select':
      return `
        <label for="${controllerId}">SEND MIDI</label>
        <select name="${controllerId}" id="${controllerId}" class="midi-send">
        ${(() => {
          let optionsHtml = '';

          for (let i = min; i <= max; i++) {
            optionsHtml += `
              <option value="${i}">${i}</option>
            `;
          }

          return optionsHtml;
        })()
        }
        </select >
    `;
    case 'radio':
      return `
        <label for="${controllerId}">SEND MIDI</label>
        ${(() => {
          let radioGroupHtml = '';

          for (let i = min; i <= max; i++) {
            radioGroupHtml += `
              <label>
                <input type="radio" id="${controllerId}-choice-${i}" name="${controllerId}-choice" value="${i}" ${i === min ? "checked" : ""}>
                ${i}
              </label>
            `;
          }

          return radioGroupHtml;
        })()
        }
      `;
  };
}

function sendMidiControllerValues(controller) {
  const component = controller.closest('.component-value');
  const channel = component.querySelector('[name^="channel"]');
  const { msb, lsb } = component.dataset;

  console.log({ controller, channel, msb, lsb });

  if (channel, msb, lsb) {
    sendMidiNRPN(parseInt(channel.value), parseInt(msb), parseInt(lsb), parseInt(controller.value));
  }
}

export { initTestControllerForm }