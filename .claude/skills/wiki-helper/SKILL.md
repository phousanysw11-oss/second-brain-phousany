---
name: wiki-helper
description: "Ingest authorized sources or answer questions using a learner LLM Wiki with provenance."
---

# wiki-helper

อ่าน llm-wiki/AGENTS.md และ wiki/index.md
Query อ่านบทความและ raw แล้วตอบพร้อมแหล่ง ไม่เขียนไฟล์
Ingest ตามคำสั่ง: เก็บ raw ใหม่พร้อมที่มา/วันที่ ไม่ทับของเดิม ค้นบทความเดิม สรุปและเชื่อมเรื่อง อัปเดต index/log
เก็บข้อขัดแย้งอย่างชัดเจน ตัวเลขที่ไม่มีแหล่งไม่สร้างขึ้นเอง
จบแล้วให้ rebuild 3D Brain เมื่อผู้ใช้ต้องการดูแผนที่ใหม่
