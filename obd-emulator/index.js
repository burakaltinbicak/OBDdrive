const net = require('net')

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRPMHex(rpm) {
  const val = rpm * 4
  const A = Math.floor(val / 256)
  const B = val % 256
  return `41 0C ${A.toString(16).padStart(2, '0').toUpperCase()} ${B.toString(16).padStart(2, '0').toUpperCase()}`
}

function getTempHex(temp) {
  const val = temp + 40
  return `41 05 ${val.toString(16).padStart(2, '0').toUpperCase()}`
}

function getSpeedHex(speed) {
  return `41 0D ${speed.toString(16).padStart(2, '0').toUpperCase()}`
}

const dtcListesi = [
  '01 01', // P0101
  '03 00', // P0300
  '04 20', // P0420
  '01 71', // P0171
  '03 01', // P0301
  '01 15', // P0115
  '02 00', // P0200
  '04 40', // P0440
]

function randomDTC() {
  const adet = randomInt(1, 3)
  const secilen = [...dtcListesi].sort(() => Math.random() - 0.5).slice(0, adet)
  const yanit = `43 0${adet} ` + secilen.join(' ') + ' 00 00'
  return yanit
}

let currentRPM = randomInt(700, 3000)
let currentTemp = randomInt(70, 100)
let currentSpeed = randomInt(0, 120)
let currentDTC = randomDTC()

// Her 5 saniyede değerleri güncelle
setInterval(() => {
  currentRPM = Math.max(500, Math.min(4000, currentRPM + randomInt(-200, 200)))
  currentTemp = Math.max(60, Math.min(110, currentTemp + randomInt(-2, 3)))
  currentSpeed = Math.max(0, Math.min(180, currentSpeed + randomInt(-10, 10)))
}, 5000)

const server = net.createServer((socket) => {
  console.log('Bağlantı kuruldu')

  socket.on('data', (data) => {
    const command = data.toString().trim().toUpperCase()
    console.log('Gelen komut:', command)

    if (command === 'ATZ') {
      socket.write('ELM327 v1.5\r\n>')
    } else if (command === 'ATSP0') {
      socket.write('OK\r\n>')
    } else if (command === '010C') {
      socket.write(getRPMHex(currentRPM) + '\r\n>')
    } else if (command === '0105') {
      socket.write(getTempHex(currentTemp) + '\r\n>')
    } else if (command === '010D') {
      socket.write(getSpeedHex(currentSpeed) + '\r\n>')
    } else if (command === '03') {
      currentDTC = randomDTC()
      socket.write(currentDTC + '\r\n>')
    } else if (command === '04') {
      socket.write('44\r\n>')
    } else {
      socket.write('?\r\n>')
    }
  })

  socket.on('end', () => {
    console.log('Bağlantı kesildi')
  })
})

server.listen(35000, '127.0.0.1', () => {
  console.log('OBD Emulatör çalışıyor: 127.0.0.1:35000')
})