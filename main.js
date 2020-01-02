'use strict'

const electron        = require('electron')
const app             = electron.app
const globalShortcut  = electron.globalShortcut
const os              = require('os')
const path            = require('path')
const configuration   = require(path.join(__dirname, 'package.json'))
const BrowserWindow   = electron.BrowserWindow
const ipcMain         = electron.ipcMain
const db              = require(path.join(__dirname, 'application', 'db', 'models', 'db.js'))
var mainWindow        = null
app.name              = configuration.productName

app.on(
        'ready' , 
        function () {
          mainWindow = new BrowserWindow({
                                          backgroundColor : 'lightgray'                 ,
                                          title           : configuration.productName   ,
                                          show            : false                       ,
                                       // fullscreen      : true                        ,
                                          webPreferences  : {
                                                              nodeIntegration : true    ,
                                                              defaultEncoding : 'UTF-8'
                                                            }
                                        })

          // enable keyboard shortcuts
          let platform = os.platform()
          if (platform === 'darwin') {
            globalShortcut.register('Command+Option+I', () => {
              mainWindow.webContents.openDevTools()
            })
          } else if (platform === 'linux' || platform === 'win32') {
            globalShortcut.register('Control+Shift+I', () => {
              mainWindow.webContents.openDevTools()
            })
          }

          mainWindow.loadURL(path.join('file://', __dirname, 'application', 'html', 'index.html'))

          mainWindow.once(
                            'ready-to-show' , 
                            () => {
                              mainWindow.setMenu(null)
                              mainWindow.maximize()
                              mainWindow.show()
                            }
                         )

          mainWindow.onbeforeunload = (e) => {
                                        // prevent command-r from unloading the window contents
                                        e.returnValue = false
                                      }
                                  
          mainWindow.on(
                          'closed'  , 
                          function () { mainWindow = null }
                       )            

          ipcMain.on(
                      'main-window-loaded'  ,
                      function() {
                        var records = db.execute(
                                                  "SELECT * FROM people WHERE userName LIKE :userName", 
                                                  { ':userName' : '%' } 
                                                )
                        mainWindow.webContents.send('results-sent', records)                    
                      }
                    ) 
        }
      )

app.on('window-all-closed', () => { app.quit() })
