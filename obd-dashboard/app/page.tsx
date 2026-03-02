'use client'

import { useState, useEffect } from 'react'

interface LiveData {
  rpm: number
  temperature: number
  speed: number
}

interface DtcCode {
  code: string
  description: string
}

export default function Dashboard() {
  const [liveData, setLiveData] = useState<LiveData | null>(null)
  const [dtcCodes, setDtcCodes] = useState<DtcCode[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [brand, setBrand] = useState('')
  const [year, setYear] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({})
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({})
  const [openCodes, setOpenCodes] = useState<Record<string, boolean>>({})

  const fetchLiveData = async () => {
    const res = await fetch('/api/obd?type=live')
    const json = await res.json()
    if (json.success) setLiveData(json.data)
  }

  const fetchDTC = async () => {
    setLoading(true)
    const res = await fetch('/api/obd?type=dtc')
    const json = await res.json()
    if (json.success) setDtcCodes(json.data)
    setLoading(false)
  }

  const askAI = async (code: string) => {
    setAiLoading(prev => ({ ...prev, [code]: true }))
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, brand, year, fuelType })
    })
    const json = await res.json()
    if (json.success) {
      setAiExplanations(prev => ({ ...prev, [code]: json.explanation }))
      setOpenCodes(prev => ({ ...prev, [code]: true }))
    }
    setAiLoading(prev => ({ ...prev, [code]: false }))
  }

  const clearDTC = async () => {
    const res = await fetch('/api/obd', { method: 'DELETE' })
    const json = await res.json()
    if (json.success) {
      setDtcCodes([])
      setMessage('Hata kodları temizlendi')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  useEffect(() => {
    if (brand && year && fuelType) {
      fetchLiveData()
      fetchDTC()
      const interval = setInterval(fetchLiveData, 3000)
      return () => clearInterval(interval)
    }
  }, [brand, year, fuelType])

  useEffect(() => {
    if (dtcCodes.length > 0 && brand && year && fuelType) {
      dtcCodes.forEach((dtc) => {
        if (!aiExplanations[dtc.code] && !aiLoading[dtc.code]) {
          askAI(dtc.code)
        }
      })
    }
  }, [dtcCodes])

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#1C1008', color: '#FFF8F0', padding: '32px', fontFamily: 'Georgia, serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px', borderBottom: '2px solid #F5C518', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px', height: '48px',
          backgroundColor: '#F5C518',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px'
        }}>
          🔧
        </div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#F5C518', margin: 0, letterSpacing: '2px' }}>
            OBD DASHBOARD
          </h1>
          <p style={{ color: '#D4845A', fontSize: '13px', margin: 0, letterSpacing: '1px' }}>
            Araç Diagnostik Sistemi
          </p>
        </div>
      </div>

      {/* Araç Bilgileri */}
      <div style={{
        backgroundColor: '#2D1F0E',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
        border: '1px solid #3D2A10'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '4px', height: '22px', backgroundColor: '#F5C518', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFF8F0', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Araç Bilgileri
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          {[
            { label: 'Araç Markası', value: brand, setter: setBrand, options: ['Marka Seçin', 'Toyota', 'BMW', 'Mercedes', 'Volkswagen', 'Ford', 'Renault', 'Fiat', 'Honda', 'Hyundai', 'Kia', 'Audi', 'Volvo', 'Peugeot', 'Opel', 'Skoda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'Seat'] },
            { label: 'Araç Yılı', value: year, setter: setYear, options: ['Yıl Seçin', ...Array.from({ length: 30 }, (_, i) => String(2025 - i))] },
            { label: 'Yakıt Tipi', value: fuelType, setter: setFuelType, options: ['Yakıt Tipi Seçin', 'Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik'] },
          ].map((field) => (
            <div key={field.label}>
              <label style={{ color: '#D4845A', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                {field.label}
              </label>
              <select
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#1C1008',
                  color: field.value ? '#FFF8F0' : '#8B7355',
                  border: `1px solid ${field.value ? '#F5C518' : '#3D2A10'}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23F5C518' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                  paddingRight: '36px'
                }}
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt === field.options[0] ? '' : opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard içeriği */}
      {brand && year && fuelType ? (
        <>
          {/* Araç bilgisi özeti */}
          <div style={{
            backgroundColor: '#2D1F0E',
            border: '1px solid #F5C518',
            borderRadius: '12px',
            padding: '14px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ color: '#F5C518', fontSize: '18px' }}>🚗</span>
            <span style={{ color: '#FFF8F0', fontSize: '15px', fontWeight: 'bold' }}>
              {brand} · {year} · {fuelType}
            </span>
            <span style={{ marginLeft: 'auto', color: '#D4845A', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#4CAF50', borderRadius: '50%', display: 'inline-block' }} />
                Bağlı
              </span>
              <button
                onClick={() => { setBrand(''); setYear(''); setFuelType(''); setDtcCodes([]); setLiveData(null); setAiExplanations({}) }}
                style={{
                  backgroundColor: 'transparent',
                  color: '#D4845A',
                  border: '1px solid #D4845A',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Aracı Değiştir
              </button>
            </span>
          </div>

          {/* Canlı Veri Kartları */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            {[
              { label: 'RPM', value: liveData?.rpm ?? '-', unit: '', color: '#F5C518', icon: '⚙️' },
              { label: 'Motor Sıcaklığı', value: liveData?.temperature ?? '-', unit: '°C', color: '#D4845A', icon: '🌡️' },
              { label: 'Hız', value: liveData?.speed ?? '-', unit: ' km/h', color: '#E8B86D', icon: '🏎️' },
            ].map((card) => (
              <div key={card.label} style={{
                backgroundColor: '#2D1F0E',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'center',
                border: '1px solid #3D2A10',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '20px', opacity: 0.4 }}>
                  {card.icon}
                </div>
                <p style={{ color: '#8B7355', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {card.label}
                </p>
                <p style={{ color: card.color, fontSize: '42px', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                  {card.value}<span style={{ fontSize: '18px' }}>{card.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Hata Kodları */}
          <div style={{ backgroundColor: '#2D1F0E', borderRadius: '16px', padding: '28px', border: '1px solid #3D2A10' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '4px', height: '22px', backgroundColor: '#D4845A', borderRadius: '2px' }} />
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFF8F0', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Hata Kodları
                </h2>
                {dtcCodes.length > 0 && (
                  <span style={{ backgroundColor: '#D4845A', color: '#1C1008', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 'bold' }}>
                    {dtcCodes.length}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={fetchDTC} style={{
                  backgroundColor: 'transparent',
                  color: '#F5C518',
                  border: '1px solid #F5C518',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  letterSpacing: '0.5px'
                }}>
                  Yenile
                </button>
                <button onClick={clearDTC} style={{
                  backgroundColor: '#D4845A',
                  color: '#1C1008',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  letterSpacing: '0.5px'
                }}>
                  Temizle
                </button>
              </div>
            </div>

            {message && (
              <div style={{ backgroundColor: '#1C1008', border: '1px solid #F5C518', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', color: '#F5C518', fontSize: '13px' }}>
                ✓ {message}
              </div>
            )}

            {loading ? (
              <p style={{ color: '#8B7355', textAlign: 'center', padding: '24px' }}>Yükleniyor...</p>
            ) : dtcCodes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#8B7355' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                <p style={{ margin: 0, fontSize: '14px' }}>Hata kodu bulunamadı</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dtcCodes.map((dtc) => (
                  <div key={dtc.code} style={{
                    backgroundColor: '#1C1008',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    border: '1px solid #3D2A10'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{
                          backgroundColor: '#3D1A0A',
                          color: '#D4845A',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          fontSize: '15px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #D4845A'
                        }}>
                          {dtc.code}
                        </span>
                        <span style={{ color: '#C8B89A', fontSize: '14px' }}>{dtc.description}</span>
                      </div>
                      <button
                        onClick={() => setOpenCodes(prev => ({ ...prev, [dtc.code]: !prev[dtc.code] }))}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#F5C518',
                          border: '1px solid #F5C518',
                          borderRadius: '8px',
                          padding: '6px 14px',
                          fontSize: '18px',
                          cursor: 'pointer',
                          transform: openCodes[dtc.code] ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}
                      >
                        {aiLoading[dtc.code] ? '⏳' : '▼'}
                      </button>
                    </div>
                    {openCodes[dtc.code] && aiExplanations[dtc.code] && (
                      <div style={{
                        marginTop: '14px',
                        padding: '16px',
                        backgroundColor: '#2D1F0E',
                        borderRadius: '10px',
                        borderLeft: '3px solid #F5C518',
                        fontSize: '13px',
                        lineHeight: '1.8',
                        color: '#FFF8F0',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {aiExplanations[dtc.code]
                          .replace(/\*\*(.*?)\*\*/g, '$1')
                          .replace(/^\* /gm, '• ')
                          .replace(/^\d+\. /gm, (m) => m)}
                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{
          backgroundColor: '#2D1F0E',
          borderRadius: '16px',
          padding: '60px 32px',
          textAlign: 'center',
          border: '1px dashed #3D2A10'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔌</div>
          <p style={{ color: '#8B7355', fontSize: '15px', margin: 0 }}>
            Devam etmek için lütfen araç bilgilerini seçin
          </p>
        </div>
      )}
    </main>
  )
}
