console.log('In Renderer!');
const electron = require('electron');
const ipc = electron.ipcRenderer;

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

}

document.getElementById('report').addEventListener(
    'click',
    _ => {
        makeInfoObject();
        console.log('INFO', patientInfo);
        ipc.send('see-report', patientInfo);
        console.log('Already SEND');
        // ipc.send('seeReport');
    }
)

ipc.on('edit-report', (event, info) => {
    reInsertDataToFields(info);
    console.log('INFO IN REPORT', info);
})

function reInsertDataToFields(info) {
    document.getElementById('name').value = info.name;
    document.getElementById('national-code').value = info.nationalCode;
    document.getElementById('sickness').value = info.sickness;

    document.getElementById('day').value = info.startDate.day;
    document.getElementById('month').value = info.startDate.month;
    document.getElementById('year').value = info.startDate.year;

    document.getElementById('visits').value = info.visits;
    document.getElementById('price').value = info.price;
    document.getElementById('insurance').value = info.insurance;
}




