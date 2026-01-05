const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
        backgroundColor: '#f5f5f5',
        show: false, // Don't show until ready
    });

    // Determine if we're in development or production
    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

    if (isDev) {
        // Development: load from Vite dev server
        mainWindow.loadURL('http://localhost:5173')
            .then(() => {
                console.log('✅ Loaded from Vite dev server');
            })
            .catch(err => {
                console.error('❌ Failed to load from Vite dev server:', err);
            });

        // Open DevTools in development
        mainWindow.webContents.openDevTools();
    } else {
        // Production: load from built files
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
            .then(() => {
                console.log('✅ Loaded from built files');
            })
            .catch(err => {
                console.error('❌ Failed to load built files:', err);
            });
    }

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        console.log('🚀 Life Dashboard is running!');
        console.log(`📍 Mode: ${isDev ? 'Development' : 'Production'}`);
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Create window when Electron is ready
app.whenReady().then(() => {
    createWindow();

    // On macOS, re-create window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Log any errors
app.on('render-process-gone', (event, webContents, details) => {
    console.error('Renderer process gone:', details);
});

app.on('child-process-gone', (event, details) => {
    console.error('Child process gone:', details);
});

console.log('🎯 Electron main process started');
console.log(`📂 App path: ${app.getAppPath()}`);
console.log(`🏠 User data: ${app.getPath('userData')}`);
