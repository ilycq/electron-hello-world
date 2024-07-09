// 引入 Electron 模块中的 app 和 BrowserWindow 对象
// app 对象提供了应用程序控制和事件，用于控制整个应用生命周期和主机窗口的行为
// BrowserWindow 是 Electron 中用于创建和管理浏览器窗口的模块
const { app, BrowserWindow, ipcMain } = require('electron/main');

const path = require('node:path')
/**
 * 创建一个窗口。
 *
 * 此函数创建一个具有固定宽度和高度的浏览器窗口，并加载index.html文件。
 * 它不接受任何参数，也不返回任何值。
 *
 * @returns {void}
 */
const createWindow = () => {
    // 创建一个浏览器窗口，设置初始宽度为800像素，高度为600像素
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // 启用渲染器进程的预加载脚本
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // 在新创建的窗口中加载index.html文件
    win.loadFile('index.html')
}

/**
 * 在应用程序准备就绪时初始化主窗口。
 *
 * 此注释解释了为什么使用app.whenReady().then()结构：它确保在应用程序的所有准备工作（如加载库和设置）完成后才创建主窗口。
 * 这种延迟创建窗口的方法有助于避免在应用程序尚未完全初始化时尝试访问或操作窗口可能导致的问题。
 */
// app.whenReady().then(() => {
//     createWindow()
// })


/**
 * 当应用程序准备就绪时执行初始化窗口创建。
 * 这个延迟执行确保了应用程序的所有资源都已加载，避免了过早创建窗口可能导致的问题。
 */
app.whenReady().then(() => {
    const ipcArgs = {
        name: "ipcCommunication",
        type: "ipc",
    }
    ipcMain.handle('ping', () => ipcArgs)

    // 创建主应用程序窗口
    createWindow()

    /**
     * 在应用程序被激活时注册事件监听器。
     * 这个事件会在用户从Dock或任务栏点击应用程序图标时触发。
     * 目的是确保在应用程序被激活时至少有一个窗口可见。
     */
    app.on('activate', () => {
        // 如果当前没有打开的窗口，创建一个新的窗口
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

/**
 * 当所有窗口都关闭时触发的事件处理函数。
 *
 * 在某些操作系统中，用户关闭最后一个窗口并不意味着他们希望退出应用程序。
 * 这个函数的目的是在所有窗口关闭时决定是否退出应用程序。
 *
 * 对于MacOS（darwin平台），应用程序在所有窗口关闭后通常不会退出，因为用户可能期望在Dock上仍然可以访问它。
 * 对于其他平台，关闭所有窗口通常意味着用户想要退出应用程序。
 */
app.on('window-all-closed', () => {
    // 检查当前操作系统是否为MacOS，因为对于MacOS，我们需要不同的行为。
    if (process.platform !== 'darwin') {
        // 如果不是MacOS，则退出应用程序。
        app.quit()
    }
})
