const electron = require('electron');
const app = electron.app;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const path = require('path');
const url = require('url');

let mainWindow;

function goHome()
{
    mainWindow.loadURL(url.format(
    {
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
}

function goYouTube()
{
    mainWindow.loadURL("https://youtube.com");
}

function createWindow()
{
    mainWindow = new BrowserWindow({width: 800, height: 600});

    let mainMenu = new Menu();
    mainMenu.append(new MenuItem({label: "Home", click: goHome}));
    mainMenu.append(new MenuItem({label: "YouTube", click: goYouTube}));
    mainMenu.append(new MenuItem({label: "Refresh", role: "reload"}));
    mainWindow.setMenu(mainMenu);

    goHome();

    // Open the dev tools
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function()
    {
        mainWindow = null;
    });

    var registered = globalShortcut.register('mediaplaypause', function()
    {
        mainWindow.webContents.executeJavaScript(`
            var playButtons = document.querySelectorAll('.ytp-play-button');
            for (var i = 0; i < playButtons.length; ++i) {
                playButtons[i].click();
            }

            var pauseButtons = document.querySelectorAll('.ytp-pause-button');
            for (var i = 0; i < pauseButtons.length; ++i) {
                pauseButtons[i].click();
            }
        `);
    });
    if (!registered)
    {
        console.log('play/pause registration failed');
    }
    else
    {
        console.log('play/pause registration success');
    }

    var registered = globalShortcut.register('medianexttrack', function()
    {
        mainWindow.webContents.executeJavaScript(`
            var nextButtons = document.querySelectorAll('.ytp-next-button');
            for (var i = 0; i < nextButtons.length; ++i) {
                nextButtons[i].click();
            }
        `);
    });
    if (!registered)
    {
        console.log('next registration failed');
    }
    else
    {
        console.log('next registration success');
    }

    var registered = globalShortcut.register('mediaprevioustrack', function()
    {
        mainWindow.webContents.executeJavaScript(`
            var nextButtons = document.querySelectorAll('.ytp-prev-button');
            for (var i = 0; i < nextButtons.length; ++i) {
                nextButtons[i].click();
            }
        `);
    });
    if (!registered)
    {
        console.log('previous registration failed');
    }
    else
    {
        console.log('previous registration success');
    }
}

ipcMain.on('goto-url', function (event, urlString)
{
    console.log(urlString);
    mainWindow.loadURL(urlString);
});

app.on('ready', createWindow);

app.on('window-all-closed', function()
{
    if (process.platform !== 'darwin')
    {
        app.quit();
    }
});

app.on('activate', function()
{
    if (mainWindow == null)
    {
        createWindow();
    }
});
