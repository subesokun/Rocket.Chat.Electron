'use strict';

var Tray = require('tray');
var Menu = require('menu');
var path = require('path');

let _tray;
let _mainWindow = null;
let _callbackOnQuit;

let _iconTray, _iconTrayAlert;

if (process.platform === 'win32') {
    _iconTray = path.join(__dirname, 'icons', 'tray', 'windows', 'icon-tray.png');
    _iconTrayAlert = path.join(__dirname, 'icons', 'tray', 'windows', 'icon-tray-alert.png');
} else if (process.platform === 'linux') {
    _iconTray = path.join(__dirname, 'icons', 'tray', 'linux', 'icon-tray.png');
    _iconTrayAlert = path.join(__dirname, 'icons', 'tray', 'linux', 'icon-tray-alert.png');
} else if (process.platform === 'darwin') {
    _iconTray = path.join(__dirname, 'icons', 'tray', 'osx', 'icon-trayTemplate.png');
    _iconTrayAlert = path.join(__dirname, 'icons', 'tray', 'osx', 'icon-tray-alert.png');
}

function createAppTray(mainWindow) {
    _tray = new Tray(_iconTray);
    var contextMenu = Menu.buildFromTemplate([
        { label: 'Hide', click: function() { showMainWindow(false); }},
        { label: 'Show', click: function() { showMainWindow(true); }},
        { label: 'Quit', click: function() { doQuit(); }}
    ]);
    _tray.setToolTip('Rocket.Chat');
    _tray.setContextMenu(contextMenu);
    _mainWindow = mainWindow;
    _mainWindow.tray = _tray;
}

function destroy() {
    if (_tray !== null && _tray !== undefined) {
        _tray.destroy();
        _tray = null;
    }
    _mainWindow = null;
    _callbackOnQuit = null;
}

function doQuit() {
    if (typeof _callbackOnQuit === 'function') {
        _callbackOnQuit();
    }
}

function showTrayAlert(showAlert, title) {
    if ((_tray !== null && _tray !== undefined) && (_mainWindow !== null && _mainWindow !== undefined)) {
        _mainWindow.flashFrame(showAlert);
        if (showAlert) {
            _tray.setImage(_iconTrayAlert);
            if (process.platform == 'darwin') {
                _tray.setTitle(title);
                _tray.setTitle(title);
            }
        } else {
            _tray.setImage(_iconTray);
            if (process.platform == 'darwin') {
                _tray.setTitle('');
            }
        }
    }
}

function minimizeMainWindow() {
    showMainWindow(false);
}

function restoreMainWindow() {
    showMainWindow(true);
}

function showMainWindow(show) {
    if (_mainWindow !== null && _mainWindow !== undefined) {
        if (show) {
            _mainWindow.restore();
            _mainWindow.setSkipTaskbar(false);
        } else {
            if (process.platform == 'darwin') {
                _mainWindow.hide();
            } else {
                _mainWindow.minimize();
            }
            _mainWindow.setSkipTaskbar(true);
        }
    }
}

function bindOnQuit(callback) {
    _callbackOnQuit = callback;
}

module.exports = {
    createAppTray: createAppTray,
    showTrayAlert: showTrayAlert,
    minimizeMainWindow: minimizeMainWindow,
    restoreMainWindow: restoreMainWindow,
    bindOnQuit: bindOnQuit,
    destroy: destroy
};
