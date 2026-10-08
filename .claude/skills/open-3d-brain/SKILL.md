---
name: open-3d-brain
description: "Open the learner's saved local 3D knowledge graph only when explicitly requested."
disable-model-invocation: true
---

# open-3d-brain

ใช้เฉพาะเมื่อผู้ใช้ขอเปิด 3D Brain โดยตรง ห้ามเรียกจากการติดตั้ง การตรวจไฟล์ หรือ onboarding และไม่ตรวจ Node.js จนกว่าผู้ใช้จะขอเปิดแอป

1. อ่าน `apps/3d-brain/README.md` และใช้ `brain.config.json` ที่บันทึกไว้ รักษาชื่อ หมวด และเส้นทางเดิม
2. ตรวจ endpoint `/api/graph` ของ port ที่กำหนดก่อน หากเป็นแอปนี้อยู่แล้ว ให้ใช้ URL เดิม หากเป็นบริการอื่น ให้เลือก port ว่างโดยไม่ปิดบริการนั้น
3. จากรากโฟลเดอร์ผู้เรียน รัน `node apps/3d-brain/serve.mjs --port 4782` เมื่อ port นี้ว่าง หาก config ใช้ port อื่น ให้ใช้ค่าที่บันทึกไว้ คำสั่งนี้เปิดเฉพาะ server ของ 3D Brain และไม่เปิด browser อัตโนมัติ
4. บน Windows ให้เริ่มงานเบื้องหลังด้วยหน้าต่างซ่อน จากนั้นตรวจ `/api/graph` ก่อนเปิด URL ผ่าน browser panel ที่มีอยู่และส่งลิงก์ให้ผู้ใช้ บอกตามจริงหากเปิด panel ได้เพียง queued
5. รีเฟรชด้วยปุ่ม **Rebuild from disk** หลังบันทึกโน้ตเมื่อผู้ใช้ขอ ห้ามเปลี่ยนชื่อ หมวด หรือเพิ่มแหล่งข้อมูลเอง หากต้องการสร้างใหม่หรือเลือกหมวด ให้ใช้ `3d-brain`

URL ปกติ: http://127.0.0.1:4782 . แหล่งข้อมูลเริ่มต้นอยู่ในโฟลเดอร์ผู้เรียนเท่านั้น ห้ามอ่าน memory หรือ session history นอกโฟลเดอร์โดยไม่มีคำขอและการเลือกเส้นทางจากผู้ใช้

ไม่ต้องติดตั้ง npm เพื่อเปิดแอป แต่ต้องมี Node.js 22 ขึ้นไป การตรวจ API สำเร็จยืนยัน server และข้อมูลเท่านั้น ตรวจ browser จริงก่อนอ้างว่า Cinema, growth replay หรือการแสดงผลผ่านการทดสอบ
