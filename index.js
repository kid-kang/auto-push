const schedule = require('node-schedule')
const child_process = require('child_process')
const fs = require('fs')
const FILE_PATH = `${__dirname}/README.md`
const moment = require('moment')
const newDate = () => moment().format('YYYY-MM-DD HH:mm:ss')

const implementShell = async (shell, callback) => {
  callback(`[${newDate()}] ${shell}`)
  return new Promise((resolve, reject) => {
    try {
      const sh = child_process.exec(`cd ${__dirname} && ${shell}`, (error, stdout, stderr) => {
        if (error) {
          reject(error)
          callback(`[${newDate()}] ${error}`)
        }
        resolve()
      })
      sh.stdout.on('data', (data) => {
        callback(`[${newDate()}] ${data}`)
      })
      sh.stderr.on('data', (error) => {
        callback(`[${newDate()}] ${error}`)
      })
    } catch (error) {
      callback(`[${newDate()}] ${error}`)
      reject(error)
    }
  })
}

const editFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(FILE_PATH, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
        throw err
      }
      const temp = `${data} - ${newDate()}`
      fs.writeFile(FILE_PATH, temp, null, err => err ? reject(err) : resolve())
    })
  })
}

const setTimePush = (t) => {
  schedule.scheduleJob(t, async () => {
    await editFile()
    await implementShell('git add .', console.log)
    await implementShell('git commit -m "feat: 测试产品"', console.log)
    await implementShell('git push -u origin main', console.log)
  })
}

// setTimePush('30 * * * * *')
setTimePush('30 1 * * * *')
setTimePush('30 10 * * * *')
setTimePush('30 20 * * * *')
setTimePush('30 30 * * * *')
setTimePush('30 40 * * * *')
setTimePush('30 50 * * * *')


