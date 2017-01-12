const {app,Menu,BrowserWindow} = require('electron');

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

  // Create the Application's main menu
  var template = [{
      label: "Application",
      submenu: [
          { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
          { type: "separator" },
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]}, {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));


}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
     app.quit();
})
