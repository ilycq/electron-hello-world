
/**
 * 当文档加载完成时，添加事件监听器以替换特定元素的文本内容。
 * 这个函数会在页面加载完成后执行，它会寻找特定ID的元素，并将它们的文本内容替换为对应进程版本的文本。
 */
window.addEventListener('DOMContentLoaded', () => {
    /**
     * 替换指定元素的文本内容。
     * @param {string} selector - 要替换文本的元素的ID。
     * @param {string} text - 要设置的新文本内容。
     * 此函数通过ID查找元素，并将找到的元素的文本内容替换为给定的文本。
     */
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    // 遍历一个包含不同依赖名称的数组，为每个依赖替换文本内容
    for (const dependency of ['chrome', 'node', 'electron']) {
        // 根据依赖名称动态生成元素ID，并替换该元素的文本内容为对应依赖的版本号
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping')
    // 除函数之外，我们也可以暴露变量
})
