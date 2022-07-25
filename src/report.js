console.log('In Report!');
const electron = require('electron');
const ipc = electron.ipcRenderer;
let patientInfo;

let offDays = {
    1: [1, 2, 3, 4, 5, 12, 13, 19, 26],
    2: [2, 3, 9, 13, 14, 16, 23, 30],
    3: [6, 13, 14, 15, 20, 27],
    4: [3, 10, 17, 19, 24, 27, 31],
    5: [7, 14, 16, 17, 21, 28],
    6: [4, 11, 18, 25, 26],
    7: [1, 3, 5, 8, 13, 15, 22, 29],
    8: [6, 13, 20, 27],
    9: [4, 11, 18, 25],
    10: [2, 6, 9, 16, 23, 30],
    11: [7, 14, 15, 21, 22, 28, 29],
    12: [5, 12, 17, 19, 26, 29]
}



function writeReport(info) {
    patientInfo = info;
    document.getElementById('insurance').innerText = patientInfo.insurance;
    document.getElementById('name').innerText = patientInfo.name;
    document.getElementById('national-code').innerText = patientInfo.nationalCode

    document.getElementById('day').innerText =  patientInfo.startDate.day;
    document.getElementById('month').innerText = patientInfo.startDate.month;
    document.getElementById('year').innerText = patientInfo.startDate.year;

    document.getElementById('sickness').innerText = patientInfo.sickness;
    document.getElementById('visits').innerText =  patientInfo.visits ;
    document.getElementById('sessions').innerText =  (+patientInfo.visits * 2).toString();
    document.getElementById('price').innerText = patientInfo.price;
    document.getElementById('total-price').innerText = (+patientInfo.price * 2).toString();

    calculateVisitDates(
        +patientInfo.startDate.year,
        +patientInfo.startDate.month,
        +patientInfo.startDate.day,
        +patientInfo.visits
    );
    console.log('INFO IN REPORT', info);
}


function calculateVisitDates(year, month, day, visits) {
    let allValidDates = [];
    let firstDate = {
        year: year,
        month: month,
        day: day
    }
    allValidDates.push(firstDate);

    console.log('START: ', year, month, day, ' VISITS: ', visits);

    let validNextDate = getNextDay(year, month, day);

    for(let i=1; i < visits; i++ ) {
        // Calculating Valid Next Date
        let j = 0;

        while( isHoliday(validNextDate.year, validNextDate.month, validNextDate.day) && j <= 10 ) {
            console.log('Holiday Found', j , validNextDate);
            validNextDate = getNextDay(
                validNextDate.year,
                validNextDate.month,
                validNextDate.day
            )
            j++;
        }

        console.log(i, validNextDate);
        allValidDates.push(validNextDate);
        let temp = {...validNextDate}
        validNextDate = getNextDay(temp.year, temp.month, temp.day);
    }

    console.log('All Days: ', allValidDates);
    let daysCount = allValidDates.length;
    console.log('daysCount', daysCount);

    drawTable(allValidDates);
}

function drawTable(days) {
    let arr1 = days.slice(0, Math.round(days.length / 2));
    let arr2 = days.slice(Math.round(days.length / 2) , days.length);
    console.log('1', arr1);
    console.log('2', arr2);

    insertTableFromArray('table-one', arr1, 0);
    insertTableFromArray('table-two', arr2, Math.round(days.length / 2));
}

function insertTableFromArray(id, arr, offset) {

    let tHeader = document.createElement('thead');
    let headerRow = document.createElement('tr');
    let tableHeader1 = document.createElement('th');
    let tableHeader2 = document.createElement('th');
    let tableHeader3 = document.createElement('th');
    let tableHeader4 = document.createElement('th');
    let tableHeader5  = document.createElement('th');

    tableHeader1.innerText = 'ردیف'
    headerRow.appendChild(tableHeader1);
    tableHeader2.innerText = 'تاریخ'
    headerRow.appendChild(tableHeader2);
    tableHeader3.innerText = 'تعداد جلسات'
    headerRow.appendChild(tableHeader3);
    tableHeader4.innerText = 'نقاط کار شده (report)'
    headerRow.appendChild(tableHeader4);
    tableHeader5.innerText = 'مبلغ پرداختی (تومان)'
    headerRow.appendChild(tableHeader5);

    tHeader.appendChild(headerRow);
    let table = document.getElementById(id);
    let tBody = document.createElement('tbody');

    for(let i=0; i<arr.length; i++) {
        let td1 = document.createElement('td');
        td1.innerText = (i + 1 + offset).toString();
        let td2 = document.createElement('td');
        td2.innerText = arr[i]['day']  + ' / ' + arr[i]['month'] + ' / ' + + arr[i]['year'] ;
        let td3 = document.createElement('td');
        td3.innerText = '2';
        let td4 = document.createElement('td');
        td4.innerText = 'Left-right'
        let td5 = document.createElement('td');
        td5.innerText = (+patientInfo.price * 2).toString();

        let tr = document.createElement('tr');
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        tBody.appendChild(tr);
    }

    table.appendChild(tHeader);
    table.appendChild(tBody);

}


ipc.on('show-report', (event, info) => {
    writeReport(info);
    console.log('INFO IN REPORT', info);
})

document.getElementById('print-btn').addEventListener(
    'click',
    _ => {
        window.print();
        console.log('Print');
    }
)

document.getElementById('return').addEventListener(
    'click',
    _ => {
        ipc.send('edit-info', patientInfo);
        console.log('Return');
    }
)

function getNextDay(year, month, day) {
    console.log('add to', year, month, day);
    let maxDays = month <= 6 ? 31 : 30;
    if (month === 12) {
        maxDays = 29
    }

    let nextDate = {
        year: year,
        month: month,
        day: day,
    }

    if( day < maxDays ) {
        nextDate.day = day + 1;
        return nextDate;
    }

    if( day === maxDays ) {
        nextDate.day = 1;
        nextDate.month = month + 1;

        if (month === 12) {
            nextDate.day = 1;
            nextDate.month = 1;
            nextDate.year = year + 1;
        }
        return nextDate;
    }

    if( day > maxDays ) {
        window.alert('تاریخ شروع درمان اشتباه است');
        return nextDate;
    }
}

function isHoliday( year, month, day ) {
    if(year > 1401) {
        return true;
    }
    let isHoliday = !!(offDays[month].indexOf(day) + 1);
    console.log('Checking Holyday:', year, month, day, isHoliday);

    return isHoliday;
}





