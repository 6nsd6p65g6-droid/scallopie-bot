import { phones } from "../../../site-data";

// إعدادات قسم MODERN SURFACE.
// WHATSAPP_NUMBER: الرقم الذي تصل إليه طلبات عرض السعر. يُؤخذ من الأرقام التي أكدت الشركة أن عليها واتساب
// في site-data.ts، ولا يُكتب هنا رقم من عندنا. لو كان فاضياً ولا توجد أرقام بديلة يتعطّل زر الإرسال.
export const WHATSAPP_NUMBER: string = phones.find((p) => p.whatsapp)?.number ?? "";

// أرقام بديلة يختار منها الزبون عند عدم وجود رقم واحد للشركة (غير مستخدمة هنا لأن للشركة رقماً واحداً).
export const WHATSAPP_CONTACTS: { branch: string; name: string; number: string }[] = [];

// لا توجد في الموقع أداة قياس زيارات، فلا تُرسل أي أحداث لأي جهة.
