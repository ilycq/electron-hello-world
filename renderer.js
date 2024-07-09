// renderer.js
const information = document.getElementById('info')
const ipcInfo = document.getElementById('ipcInfo')

information.innerText = `本应用正在使用 Chrome (v${versions.node()}),Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

const func = async () => {
    const response = await window.versions.ping("arg")
    console.log(response) // 打印 'pong'
    ipcInfo.innerText = response.name+response.type;
}

func()