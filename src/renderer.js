console.log('In Renderer!');

let patientInfo = {
    name: '',
    nationalCode: '',
    sickness : '',
    startDate: {
        day: '',
        month: '',
        year: '',
    },
    visits: '',
    price: '',
    insurance: '',
}

const electron = require('electron');
const { ipc } = electron;

function makeInfoObject() {
    patientInfo.name = document.getElementById('name').value;
    patientInfo.nationalCode = document.getElementById('national-code').value;
    patientInfo.sickness = document.getElementById('sickness').value;

    patientInfo.startDate.day = document.getElementById('day').value;
    patientInfo.startDate.month = document.getElementById('month').value;
    patientInfo.startDate.year = document.getElementById('year').value;

    patientInfo.visits = document.getElementById('visits').value;
    patientInfo.price = document.getElementById('price').value;
    patientInfo.insurance = document.getElementById('insurance').value;

    console.log('INFO', patientInfo);
}

document.getElementById('report').addEventListener(
    'click',
    _ => {
        makeInfoObject();
    }
)



