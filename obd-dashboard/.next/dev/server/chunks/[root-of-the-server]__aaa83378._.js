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
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[project]/lib/obdService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearDTCCodes",
    ()=>clearDTCCodes,
    "getDTCCodes",
    ()=>getDTCCodes,
    "getLiveData",
    ()=>getLiveData,
    "sendCommand",
    ()=>sendCommand
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$net__$5b$external$5d$__$28$net$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/net [external] (net, cjs)");
;
const OBD_HOST = '127.0.0.1';
const OBD_PORT = 35000;
function parseRPM(response) {
    const parts = response.trim().split(' ');
    if (parts.length >= 4) {
        const A = parseInt(parts[2], 16);
        const B = parseInt(parts[3], 16);
        return (A * 256 + B) / 4;
    }
    return 0;
}
function parseTemperature(response) {
    const parts = response.trim().split(' ');
    if (parts.length >= 3) {
        const A = parseInt(parts[2], 16);
        return A - 40;
    }
    return 0;
}
function parseSpeed(response) {
    const parts = response.trim().split(' ');
    if (parts.length >= 3) {
        return parseInt(parts[2], 16);
    }
    return 0;
}
function parseDTC(response) {
    const codes = [];
    const parts = response.trim().split(' ');
    if (parts[0] !== '43') return codes;
    for(let i = 1; i < parts.length - 1; i += 2){
        const byte1 = parseInt(parts[i], 16);
        const byte2 = parseInt(parts[i + 1], 16);
        if (byte1 === 0 && byte2 === 0) continue;
        const type = (byte1 & 0xC0) >> 6;
        const prefix = [
            'P',
            'C',
            'B',
            'U'
        ][type];
        const code = prefix + (byte1 & 0x3F).toString(16).toUpperCase().padStart(2, '0') + byte2.toString(16).toUpperCase().padStart(2, '0');
        codes.push(code);
    }
    return codes;
}
function sendCommand(command) {
    return new Promise((resolve, reject)=>{
        const client = new __TURBOPACK__imported__module__$5b$externals$5d2f$net__$5b$external$5d$__$28$net$2c$__cjs$29$__["Socket"]();
        let response = '';
        client.connect(OBD_PORT, OBD_HOST, ()=>{
            client.write(command + '\r');
        });
        client.on('data', (data)=>{
            response += data.toString();
            if (response.includes('>')) {
                client.destroy();
                resolve(response.replace('>', '').trim());
            }
        });
        client.on('error', reject);
        setTimeout(()=>{
            client.destroy();
            reject(new Error('Timeout'));
        }, 3000);
    });
}
async function getLiveData() {
    const [rpmRes, tempRes, speedRes] = await Promise.all([
        sendCommand('010C'),
        sendCommand('0105'),
        sendCommand('010D')
    ]);
    return {
        rpm: parseRPM(rpmRes),
        temperature: parseTemperature(tempRes),
        speed: parseSpeed(speedRes)
    };
}
async function getDTCCodes() {
    const response = await sendCommand('03');
    return parseDTC(response);
}
async function clearDTCCodes() {
    const response = await sendCommand('04');
    return response.includes('44');
}
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('MONGODB_URI tanımlanmamış');
}
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI).then((mongoose)=>mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectDB;
}),
"[project]/lib/models/DtcLog.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const DtcLogSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            'active',
            'cleared'
        ],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.DtcLog || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('DtcLog', DtcLogSchema);
}),
"[project]/app/api/obd/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$obdService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/obdService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$DtcLog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/DtcLog.ts [app-route] (ecmascript)");
;
;
;
;
const DTC_DESCRIPTIONS = {
    'P0121': 'Gaz Kelebeği Konum Sensörü Sorunu',
    'P0300': 'Rastgele Ateşleme Kaçağı',
    'P0420': 'Katalitik Konvertör Verimsizliği',
    'P0171': 'Yakıt Sistemi Çok Fakir',
    'P0301': '1. Silindir Ateşleme Kaçağı'
};
async function GET(req) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        if (type === 'live') {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$obdService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLiveData"])();
            //await LiveData.create(data)
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data
            });
        }
        if (type === 'dtc') {
            const codes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$obdService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDTCCodes"])();
            const dtcList = codes.map((code)=>({
                    code,
                    description: DTC_DESCRIPTIONS[code] || 'Bilinmeyen Hata Kodu'
                }));
            for (const dtc of dtcList){
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$DtcLog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
                    code: dtc.code,
                    status: 'active'
                }, {
                    ...dtc,
                    status: 'active'
                }, {
                    upsert: true
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: dtcList
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Geçersiz tip'
        }, {
            status: 400
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Sunucu hatası'
        }, {
            status: 500
        });
    }
}
async function DELETE(req) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$obdService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearDTCCodes"])();
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$DtcLog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].updateMany({
            status: 'active'
        }, {
            status: 'cleared'
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Hata kodları temizlendi'
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Sunucu hatası'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__aaa83378._.js.map