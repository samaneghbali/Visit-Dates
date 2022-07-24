
console.log('main!');
const electron = require('electron');

const { app, BrowserWindow } = electron;

let mainWindow;



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
    })

    mainWindow.loadURL(`file://${__dirname}/page1.html`)

    mainWindow.on("closed", _ => {
        console.log('Main Win Closed');
        mainWindow = null;
    })
});
