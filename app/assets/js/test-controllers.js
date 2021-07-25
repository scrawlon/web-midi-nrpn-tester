
const nrpnControllerValuesForm = document.querySelector('form#nrpn-controller-values');
const nrpnTestControllers = document.querySelector('#nrpn-test-controllers');

function initTestControllerForm() {
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
  const controllerId = `nrpn-${msb}-${lsb}-${min}-${max}-${channel}`;
  const duplicateId = nrpnTestControllers.querySelector(`#${controllerId}`);

  if (!duplicateId) {
    renderTestControllerHtml(msb, lsb, min, max, channel, controllerId);
    initTestControllerEvents(controllerId);
  } else {
    console.log('controller already exists');
  }
}

function renderTestControllerHtml(msb, lsb, min, max, channel, controllerId) {
  const controllerHtml = `
    <div class="component-value" 
      data-msb="${msb}" 
      data-lsb="${lsb}" 
      data-channel="${channel}"> 
      <label for="${controllerId}">MSB ${msb} : LSB ${lsb} | (${min} - ${max})</label><br>
      <input 
        type="range" 
        name="${controllerId}" 
        id="${controllerId}" 
        min="${min}" 
        max="${max}" 
        value="${min}">
      <output>${min}</output>
    </div>      
  `;

  nrpnTestControllers.innerHTML += controllerHtml;
}

function initTestControllerEvents(controllerId) {
  const testController = nrpnTestControllers.querySelector(`#${controllerId}`);

  testController.addEventListener('input', function (event) {
    const { target: controller } = event;
    const value = controller.value;
    const component = controller.closest('.component-value');
    const { msb, lsb } = component.dataset;

    controller.nextElementSibling.value = value;
    console.log({ msb, lsb });
    // console.log(`current value = ${value}`);
  });
}

export { initTestControllerForm }