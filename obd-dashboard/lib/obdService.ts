import * as net from 'net'

const OBD_HOST = '127.0.0.1'
const OBD_PORT = 35000

function parseRPM(response: string): number {
  const parts = response.trim().split(' ')
  if (parts.length >= 4) {
    const A = parseInt(parts[2], 16)
    const B = parseInt(parts[3], 16)
    return ((A * 256) + B) / 4
  }
  return 0
}

function parseTemperature(response: string): number {
  const parts = response.trim().split(' ')
  if (parts.length >= 3) {
    const A = parseInt(parts[2], 16)
    return A - 40
  }
  return 0
}

function parseSpeed(response: string): number {
  const parts = response.trim().split(' ')
  if (parts.length >= 3) {
    return parseInt(parts[2], 16)
  }
  return 0
}

function parseDTC(response: string): string[] {
  const codes: string[] = []
  const parts = response.trim().split(' ')
  if (parts[0] !== '43') return codes

  for (let i = 1; i < parts.length - 1; i += 2) {
    const byte1 = parseInt(parts[i], 16)
    const byte2 = parseInt(parts[i + 1], 16)
    if (byte1 === 0 && byte2 === 0) continue

    const type = (byte1 & 0xC0) >> 6
    const prefix = ['P', 'C', 'B', 'U'][type]
    const code = prefix + ((byte1 & 0x3F).toString(16).toUpperCase().padStart(2, '0')) + byte2.toString(16).toUpperCase().padStart(2, '0')
    codes.push(code)
  }
  return codes
}

export function sendCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = new net.Socket()
    let response = ''

    client.connect(OBD_PORT, OBD_HOST, () => {
      client.write(command + '\r')
    })

    client.on('data', (data) => {
      response += data.toString()
      if (response.includes('>')) {
        client.destroy()
        resolve(response.replace('>', '').trim())
      }
    })

    client.on('error', reject)
    setTimeout(() => { client.destroy(); reject(new Error('Timeout')) }, 3000)
  })
}

export async function getLiveData() {
  const [rpmRes, tempRes, speedRes] = await Promise.all([
    sendCommand('010C'),
    sendCommand('0105'),
    sendCommand('010D')
  ])

  return {
    rpm: parseRPM(rpmRes),
    temperature: parseTemperature(tempRes),
    speed: parseSpeed(speedRes)
  }
}

export async function getDTCCodes(): Promise<string[]> {
  const response = await sendCommand('03')
  return parseDTC(response)
}

export async function clearDTCCodes(): Promise<boolean> {
  const response = await sendCommand('04')
  return response.includes('44')
}