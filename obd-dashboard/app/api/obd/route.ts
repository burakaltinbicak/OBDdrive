import { NextRequest, NextResponse } from 'next/server'
import { getLiveData, getDTCCodes, clearDTCCodes } from '@/lib/obdService'
import connectDB from '@/lib/mongodb'
import LiveData from '@/lib/models/LiveData'
import DtcLog from '@/lib/models/DtcLog'

import dtcCodes from '@/lib/dtcCodes.json'
const DTC_DESCRIPTIONS = dtcCodes as Record<string, string>

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    if (type === 'live') {
      const data = await getLiveData()
      //await LiveData.create(data)
      return NextResponse.json({ success: true, data })
    }

    if (type === 'dtc') {
      const codes = await getDTCCodes()
      const dtcList = codes.map(code => ({
        code,
        description: DTC_DESCRIPTIONS[code] || 'Bilinmeyen Hata Kodu'
      }))

      for (const dtc of dtcList) {
        await DtcLog.findOneAndUpdate(
          { code: dtc.code, status: 'active' },
          { ...dtc, status: 'active' },
          { upsert: true }
        )
      }

      return NextResponse.json({ success: true, data: dtcList })
    }

    return NextResponse.json({ error: 'Geçersiz tip' }, { status: 400 })

  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    await clearDTCCodes()
    await DtcLog.updateMany({ status: 'active' }, { status: 'cleared' })
    return NextResponse.json({ success: true, message: 'Hata kodları temizlendi' })
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}