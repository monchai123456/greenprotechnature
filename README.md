# Green Protech (Green Protech Nature) — Single-Page Website

เว็บไซต์หน้าเดียว (Single-Page Smooth Scrolling Website) ของ **Green Protech Nature** บริการกำจัดปลวก มด หนู แมลงสาบ ด้วยสมุนไพรนาโนเทคโนโลยีชีวภาพ ปลอดภัย 100%

---

## 1. ระบบส่งแบบฟอร์มนัดสำรวจพื้นที่เข้าอีเมล (`greenprotechnature@gmail.com`)

เมื่อลูกค้ากรอกข้อมูลและกดปุ่ม **`🚀 ส่งข้อมูลนัดสำรวจพื้นที่ฟรีทันที`** บนหน้าเว็บ ระบบจะส่งข้อมูลเข้าอีเมล **`greenprotechnature@gmail.com`** โดยอัตโนมัติ:

### วิธีที่ 1: ใช้งานอัตโนมัติเมื่อนำเว็บขึ้น GitHub Pages (ไม่ต้องเขียนโค้ดเพิ่ม)
1. เมื่อนำเว็บไซต์ขึ้นบน GitHub Pages (`https://...`) แล้ว ให้ลองกรอกฟอร์มและกดส่ง **ครั้งแรก 1 ครั้ง**
2. เปิดกล่องจดหมายของอีเมล **`greenprotechnature@gmail.com`** (ตรวจสอบทั้งใน Inbox และ Spam/จดหมายขยะ)
3. เปิดอีเมลจาก **FormSubmit** แล้วกดปุ่ม **`Activate Form`** เพียงครั้งเดียว
4. หลังจากกดยืนยันแล้ว ทุกครั้งที่ลูกค้ากรอกฟอร์มบนหน้าเว็บ ข้อมูลจะถูกส่งเข้าอีเมล `greenprotechnature@gmail.com` ทันที

### วิธีที่ 2 (ทางเลือกเสริม): ใช้ Google Apps Script ส่งเมลผ่าน Gmail ของคุณเองโดยตรง
หากต้องการให้ส่งเมลได้ทันทีแม้เปิดจากไฟล์ในเครื่อง (`file://`) และไม่ต้องกด Activate ผ่าน FormSubmit:
1. ไปที่ [script.google.com](https://script.google.com/) ➔ กด **New project**
2. วางโค้ดด้านล่างนี้ลงไป:

```javascript
const NOTIFY_EMAIL = 'greenprotechnature@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const subject = '🌿 แจ้งนัดสำรวจพื้นที่ฟรี: ' + (data.name || '-') + ' (' + (data.phone || '-') + ')';
    const textMsg = [
      '🌿 แจ้งนัดสำรวจพื้นที่ฟรี (จากหน้าเว็บ Green Protech)',
      '------------------------',
      '👤 ชื่อลูกค้า: ' + (data.name || '-'),
      '📞 เบอร์โทร: ' + (data.phone || '-'),
      '🛡️ บริการ: ' + (data.service || '-'),
      '📍 สถานที่/หมู่บ้าน: ' + (data.area || '-'),
      '📅 วัน/เวลาที่สะดวก: ' + (data.date || '-'),
      '📝 รายละเอียด: ' + (data.note || '-'),
      '⏰ เวลาที่ส่ง: ' + (data.timestamp || '-')
    ].join('\n');

    MailApp.sendEmail(NOTIFY_EMAIL, subject, textMsg);

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. กด **Deploy ➔ New deployment ➔ Web app** (ตั้งค่า *Execute as: Me* และ *Who has access: Anyone*)
4. นำ Web app URL มาใส่ในไฟล์ `assets/js/main.js` บรรทัดที่ 154 (`const EMAIL_WEBHOOK_URL = 'https://script.google.com/macros/s/.../exec';`)

---

## 2. วิธีนำขึ้นแสดงผลบน GitHub Pages

1. สร้าง Repository ใหม่บน GitHub (เช่น `greenprotech`)
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้นไปยัง Repository ด้วยคำสั่ง Git:
   ```bash
   git init
   git add .
   git commit -m "Green Protech single-page website"
   git branch -M main
   git remote add origin https://github.com/<ชื่อผู้ใช้ของคุณ>/<ชื่อ-repo>.git
   git push -u origin main
   ```
3. ไปที่หน้า Repository บน GitHub ➔ คลิกแท็บ **Settings** ➔ เมนูซ้ายเลือก **Pages**
4. ในหัวข้อ **Build and deployment (Source)** เลือก **Deploy from a branch** ➔ เลือกกิ่ง `main` และโฟลเดอร์ `/ (root)` แล้วกด **Save**
