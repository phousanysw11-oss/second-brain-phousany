# ใช้กับ Codex และ Sites

เริ่มจาก `workspace-from-todos` เพื่อจัดรายการงานและสร้าง workspace ในเครื่อง เพิ่ม `sites-building` → `sites-hosting` เฉพาะเมื่อผู้เรียนขอเผยแพร่และบัญชีมี Sites ที่ใช้งานได้

## ใช้ skill ที่มากับแพ็กเกจนี้

เปิดโฟลเดอร์ Second Brain นี้ใน Codex และอ่าน `.agents/skills/workspace-from-todos/SKILL.md` ได้ทันที ไม่ต้องติดตั้ง skill ซ้ำและไม่มีคำสั่ง `node ./install.mjs` สำหรับแพ็กเกจเต็มนี้

การสร้าง workspace ใหม่ใช้ helper ที่แนบมาจริงจากรากโปรเจกต์:

```sh
node .agents/skills/workspace-from-todos/scripts/create-workspace.mjs ./my-workspace
```

ปลายทางต้องยังไม่มีอยู่ ต้องมี Node.js สำหรับ helper แต่ไม่ต้องติดตั้ง package เพิ่ม หากยังไม่มี Node ให้ใช้รายการงาน/brief ในแชตต่อและระบุว่า local app ยังไม่ได้สร้าง การติดตั้ง runtime เป็นขอบเขตแยก

การเห็นไฟล์ skill ไม่ยืนยันว่าเมนูหรือ Sites ใช้งานได้ เปิดโปรเจกต์ใน session ใหม่เมื่อเมนูยังไม่ refresh หรือให้ assistant อ่านไฟล์ตรงได้ ตรวจความสามารถจริงก่อนอ้างว่ามี Sites/hosting

## เริ่มใช้งาน

ใน Codex CLI/IDE ใช้ `/skills` เลือก skill หรือพิมพ์ `$workspace-from-todos` ส่วนแอป desktop ให้เลือกชื่อ skill จากเมนู Skills/ช่อง mention ที่แอปแสดง; เอกสาร ChatGPT ปัจจุบันใช้ `@` เป็นตัวเลือก skill จึงไม่ควรถือว่าเครื่องหมายเดียวกันใช้ได้ทุกหน้าจอ ดู [วิธีเรียก skill](https://learn.chatgpt.com/docs/build-skills)

ตัวอย่างสำหรับ Codex CLI/IDE:

```text
$workspace-from-todos สร้าง workspace ส่วนตัวจากรายการงานด้านล่าง
ให้ใช้ในเครื่องก่อน มีปุ่มไทย/English และรักษาข้อความงานเดิม
ถามเฉพาะข้อมูลที่จำเป็นต่อการจัดงาน

[วางรายการงานของตัวเอง]
```

AI จะใช้ template ที่แนบมาและ helper ของ skill ผู้เรียนไม่ต้องเขียนเว็บใหม่เอง หากต้องการสร้าง starter เปล่าด้วยมือ ให้เปิด terminal ที่โฟลเดอร์โปรเจกต์แล้วรัน:

```sh
node ./.agents/skills/workspace-from-todos/scripts/create-workspace.mjs ./my-workspace
cd ./my-workspace
npm run check
npm start
```

`my-workspace` ต้องยังไม่มีอยู่ เปิด URL ที่ server แสดงและใช้ URL เดิมในการกลับมาทำงาน หยุด server ด้วย `Ctrl+C` เมื่อเลิกใช้ คำสั่ง `npm run build` เตรียม `dist/` ซึ่งมีเฉพาะ `index.html`, `styles.css`, `app.js`

## เผยแพร่ผ่าน Sites เมื่อพร้อม

Sites เป็นความสามารถแยกจาก skill นี้ เอกสารปัจจุบันให้จัดการ Sites ผ่านแอป desktop หรือ ChatGPT web; CLI/IDE ใช้แก้และตรวจโปรเจกต์ในเครื่องได้ แต่ไม่มีหน้าจัดการ Sites แยกของตัวเอง ดู [เอกสาร Sites](https://learn.chatgpt.com/docs/sites)

เมื่อผู้เรียนขอเผยแพร่ ให้ AI ทำตามลำดับนี้:

1. ตรวจรายการ skill และเครื่องมือที่มีใน session ค้นหา Sites ผ่านการค้นหาเครื่องมือของสภาพแวดล้อม และอ่าน `sites-building` กับ `sites-hosting` ฉบับที่ติดตั้งจริง การเห็นไฟล์คู่มือนี้ไม่ใช่หลักฐานว่าเชื่อมต่อแล้ว
2. ใช้ workspace ที่สร้างไว้ ตรวจการสลับภาษา การแก้งาน การโหลดกลับ และการสำรอง/นำเข้า ก่อนเผยแพร่
3. สร้าง `dist/` ด้วย `npm run build` ให้เป็น public output ของ static site และใช้ `static.directory: "dist"` ตาม schema ของ Sites ฉบับที่ติดตั้ง ให้ lifecycle ปัจจุบันจัดการ `.openai/hosting.json`, การลงทะเบียน, source, version, deployment และ URL โดยไม่คัดลอกค่าเชื่อมต่อจากเครื่องผู้สอน
4. ใช้กลุ่มผู้เข้าถึงที่ผู้เรียนระบุ และทำตามขั้นตอนอนุมัติของเครื่องมือจริง รายงานว่าเผยแพร่สำเร็จพร้อม URL ที่ระบบคืนให้เฉพาะเมื่อ deployment สำเร็จ

ถ้าไม่พบ Sites, skill ของ Sites, การเชื่อมต่อ หรือสิทธิ์ ให้ส่ง workspace ที่ใช้ในเครื่องได้พร้อมระบุสิ่งที่ขาดอย่างตรงจุด ห้ามแต่ง URL หรือบอกว่าเผยแพร่แล้ว และอย่าติดตั้งบริการอื่นแทนเอง

## ข้อมูลงานและการย้ายเครื่อง

เก็บ JSON ที่มีงาน/โน้ตจริงไว้นอกโฟลเดอร์เว็บทั้งโฟลเดอร์ เช่น `../workspace-data/tasks.json` ไม่ใส่ไว้ใน source, template หรือ `dist/` และไม่ commit/upload ไฟล์นั้น นำเข้าผ่านปุ่มในเบราว์เซอร์หลังเปิดเว็บ

starter เก็บงานใน browser storage ของ URL และ browser profile นั้น การเปลี่ยนเครื่อง เบราว์เซอร์ หรือ URL ต้อง export แล้ว import เอง การล้างข้อมูลเบราว์เซอร์อาจลบงาน จึงควรมีไฟล์สำรอง การเผยแพร่เว็บไม่เพิ่ม cloud sync หรือระบบเตือนเบื้องหลัง ข้อความที่ส่งให้ AI ยังเป็นส่วนหนึ่งของแชตที่ใช้สร้างงาน

ตรวจแหล่งข้อมูล: **2026-09-16** — OpenAI Build skills และ Sites ตามลิงก์ข้างต้น; ตรวจวิธี static output เทียบกับ `sites-building`/`sites-hosting` ที่ติดตั้ง รุ่น **0.1.66** คู่มือนี้ไม่ได้รวมไฟล์ upstream เหล่านั้น ให้ใช้ฉบับที่ติดตั้งในเครื่องผู้เรียนเมื่อทำงานจริง
