module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/ai/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
;
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY);
async function POST(req) {
    try {
        const { code, brand, year, fuelType } = await req.json();
        if (!code || !brand || !year || !fuelType) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Eksik bilgi'
            }, {
                status: 400
            });
        }
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash'
        });
        const prompt = `
Sen bir araç arıza uzmanısın. Aşağıdaki araç bilgileri ve OBD hata kodu verildi:

Araç Markası: ${brand}
Araç Yılı: ${year}
Yakıt Tipi: ${fuelType}
OBD Hata Kodu: ${code}

Bu hata kodu için:
1. Bu OBD-II hata kodunun resmi Türkçe karşılığını tek satırda yaz
2. Bu araçta bu hatanın olası sebeplerini say
3. Çözüm önerilerini say

Türkçe olarak ek açıklama olmadan kısa ve net yanıt ver ve sorularımdan başka bir cevap verme cozum onerilerinden sonra ekstra bir şey soyleme sadece istenilen bilgileri ver
`;
        /* -claude- Sadece şunları yaz, başka hiçbir şey ekleme:
        1. Hata kodunun resmi Türkçe karşılığı (tek satır)
        2. Olası sebepler (madde madde)
        3. Çözüm önerileri (madde madde)*/ /* -gemini-
        "Sen profesyonel bir otomotiv diagnostik uzmanısın. Sadece aşağıda verilen değişkenlere göre, sohbet cümleleri kurmadan ve yorum yapmadan doğrudan yanıt ver:
        
        Araç Bilgileri:
        Marka: ${brand}
        Yıl: ${year}
        Yakıt: ${fuelType}
        Kod: ${code}
        
        Yanıt Formatı:
        
        Resmi Tanım: [Kodun Türkçe teknik karşılığı]
        
        Olası Sebepler: [Madde madde en yaygın nedenler]
        
        Çözüm Yolları: [Madde madde onarım adımları]
        
        Kritik Kural: Cevap sonunda 'Yardımcı olabilir miyim?' veya 'Başka sorunuz var mı?' gibi kapanış cümleleri kesinlikle kurma. Sadece istenen teknik veriyi yaz ve bitir."*/ /* -chatgpt-
        Sen uzman bir otomotiv arıza teşhis teknisyenisin.
        
        Aşağıdaki bilgiler verilecektir:
        - Araç Markası: {brand}
        - Araç Model Yılı: {year}
        - Yakıt Tipi: {fuelType}
        - OBD-II Hata Kodu: {code}
        
        Görev:
        
        1) OBD-II hata kodunun resmi Türkçe teknik karşılığını TEK SATIR olarak yaz.
        2) Bu araç özelinde olası teknik sebepleri madde madde listele.
        3) Profesyonel çözüm önerilerini madde madde listele.
        
        Kurallar:
        - Yanıt tamamen Türkçe olacak.
        - Ek açıklama, giriş, sonuç veya yorum yazma.
        - Sadece istenen 3 başlığı ver.
        - Her madde kısa, teknik ve net olsun.
        - Tahmin yürütme, teknik mantık dışına çıkma.
        - Format aşağıdaki gibi olsun:
        
        Hata Tanımı:
        ...
        
        Olası Sebepler:
        - ...
        - ...
        
        Çözüm Önerileri:
        - ...
        - ...
        */ /*-buda claude un ama aklıma en cok yatanı-
        Sen uzman bir otomotiv diagnostik teknisyenisin.
        
        Araç Markası: ${brand}
        Araç Yılı: ${year}
        Yakıt Tipi: ${fuelType}
        OBD-II Hata Kodu: ${code}
        
        Aşağıdaki formatı birebir uygula, başka hiçbir şey yazma:
        
        Hata Tanımı: [Kodun resmi Türkçe teknik karşılığı, tek satır]
        
        Olası Sebepler:
        - [sebep]
        - [sebep]
        
        Çözüm Önerileri:
        - [adım]
        - [adım]
        
        Kurallar:
        - Yalnızca teknik bilgi ver
        - Giriş, yorum, sonuç, kapanış cümlesi yazma
        - Her madde kısa ve net olsun
        - Bu araca,yılına ve yakıt tipine özel düşün 
        */ const result = await model.generateContent(prompt);
        const text = result.response.text();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            explanation: text
        });
    } catch (error) {
        console.error('AI HATA:', error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09d616b7._.js.map