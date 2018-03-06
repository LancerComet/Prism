const fs = require('fs')
const http = require('http')
const path = require('path')

const host = '127.0.0.1'
const port = 50005
const updateInterval = 1000 * 60 * 5

const imageFolder = path.resolve(__dirname, './images')
let fileList = []

main()

function main () {
  updateFileList()
  if (ifHaveImages()) {
    updateFileListByInterval()
    startServer()
  } else {
    console.log('[Info] No file is detected, program will exit.')
    process.exit(0)
  }
}

function ifHaveImages () {
  return fileList.length > 0
}

function startServer () {
  const server = http.createServer((req, res) => {
    const { url } = req
    switch (url) {
      case '/':
        const filePath = getRandomFilePath()
        fs.createReadStream(filePath).pipe(res)
        break

      default:
        res.statusCode = 404
        res.end('NOT FOUND')
        break
    }
  })

  server.on('error', error => {
    console.error('[Error] Failed to start server:', error)
    process.exit(1)
  })

  server.listen(port, host, () => {
    console.log(`[Info] Server is on at ${host}:${port}.`)
  })
}

function updateFileListByInterval () {
  setInterval(updateFileList, updateInterval)
}

function updateFileList () {
  fileList = getFileList()
}

function getFileList () {
  return fs.readdirSync(imageFolder)
    .filter(fileName => /\.jp(e)?g$/.test(fileName))
    .map(fileName => path.resolve(imageFolder, fileName))
}

function getRandomFilePath () {
  return fileList[Math.floor(Math.random() * fileList.length)]
}
