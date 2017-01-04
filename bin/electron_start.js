const {app, BrowserWindow} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {

  // Start Express
  app.common = require(__dirname + '/common')();

  // Create the browser window.
  win = new BrowserWindow();
  // win.maximize();

  // load express app into electron
  win.loadURL('http://localhost:'+3000);

  //win.webContents.openDevTools();

  win.focus();

  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
     app.quit();
})
