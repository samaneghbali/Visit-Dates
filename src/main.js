
console.log('main!');
const electron = require('electron');


const { app, BrowserWindow } = electron;
const ipc = electron.ipcMain;

let mainWindow;
let reportWindow;


app.on("ready", _ => {
    console.log('Ready!');
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    mainWindow.loadURL(`file://${__dirname}/page1.html`)

    mainWindow.on("closed", _ => {
        console.log('Main Win Closed');
        mainWindow = null;
    })
});


ipc.on('see-report', (event, info) => {
    console.log('SEE REPORT IN MAIN', event);
    console.log('SEE REPORT IN MAIN', info);
    mainWindow.close();

    reportWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    reportWindow.loadURL(`file://${__dirname}/report.html`).then(
        value => {
            reportWindow.webContents.send('show-report', info);
        }
    );

    reportWindow.on("closed", _ => {
        console.log('Report Win Closed');
        reportWindow = null;
    })

    // mainWindow.webContents.send('ddd', info);
})


ipc.on('edit-info', (event, info) => {
    console.log('EDIT INFO IN MAIN', info);
    reportWindow.close();

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    mainWindow.loadURL(`file://${__dirname}/page1.html`).then(
        value => {
            mainWindow.webContents.send('edit-report', info);
        }
    );

    mainWindow.on("closed", _ => {
        console.log('Main Win Closed');
        mainWindow = null;
    })

    // mainWindow.webContents.send('ddd', info);
})

