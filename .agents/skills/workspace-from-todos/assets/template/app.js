'use strict';

(() => {
  const STORAGE_KEY = 'work-second-brain.v1';
  const MAX_BYTES = 8 * 1024 * 1024;
  const LANG = {
    th: {
      documentTitle:'พื้นที่ทำงาน · Work & Second Brain', skip:'ข้ามไปเนื้อหา', navigation:'เมนูหลัก', workspace:'พื้นที่ของคุณ',
      today:'วันนี้', all:'งานทั้งหมด', week:'สัปดาห์', month:'เดือน', projects:'โปรเจกต์', notes:'บันทึก',
      browserLocal:'เก็บในเบราว์เซอร์นี้', localDetail:'ไม่ซิงก์ข้ามอุปกรณ์ สำรองข้อมูลไว้เป็นระยะ', dataBackup:'ข้อมูลและสำรองข้อมูล', backup:'สำรองข้อมูล',
      search:'ค้นหางานและบันทึก', searchPlaceholder:'ค้นหางานและบันทึก…', addTask:'เพิ่มงาน', addNote:'เพิ่มบันทึก',
      darkTheme:'ใช้ธีมมืด', lightTheme:'ใช้ธีมสว่าง', footer:'พื้นที่ทำงานส่วนตัว · การแจ้งเตือนแสดงเฉพาะเมื่อเปิดหน้านี้',
      todaySubtitle:'เลือกสิ่งสำคัญ แล้วลงมือทีละงาน', allSubtitle:'งานทุกชิ้นอยู่ที่นี่ พร้อมกลับมาจัดการได้เสมอ',
      weekSubtitle:'ดูงานตามวันที่กำหนดไว้ วันที่ว่างไม่ได้หมายความว่าคุณไม่มีงาน', monthSubtitle:'เห็นภาพรวมของเดือน เลือกวันเพื่อดูงาน',
      projectsSubtitle:'ดูความคืบหน้าจากจำนวนงานที่เสร็จในแต่ละโปรเจกต์', notesSubtitle:'เก็บความคิด สิ่งที่เรียนรู้ และเชื่อมกับงานที่เกี่ยวข้อง',
      welcomeTitle:'เริ่มจากรายการงานของคุณ', welcomeBody:'วางรายการที่ใช้อยู่แล้ว แต่ละบรรทัดจะกลายเป็นหนึ่งงาน คุณจะได้ตรวจรายการก่อนเพิ่ม แล้วค่อยเลือกสิ่งที่จะทำวันนี้',
      pasteList:'วางรายการงาน', blankTask:'หรือเพิ่มงานแรก', exampleHelp:'อยากลองก่อน? ใช้ข้อมูลตัวอย่างสมมติได้', loadExample:'เพิ่มตัวอย่างสมมติ',
      focusTitle:'โฟกัสของวันนี้', focusHelp:'คุณเลือกเองได้ไม่เกิน 3 งาน', focusCount:'{count} / 3 งาน',
      focusEmpty:'ยังไม่ได้เลือกงานโฟกัส กดรูปดาวข้างงานที่อยากทำวันนี้', chooseFocus:'เลือกจากงานทั้งหมด',
      suggestions:'ก้าวถัดไปที่แนะนำ', suggestionsHelp:'เรียงด้วยวันที่และระดับความสำคัญที่คุณกำหนด', noSuggestions:'ไม่มีงานค้างให้แนะนำ เพิ่มงานเมื่อพร้อม',
      suggestedDisclosure:'เป็นคำแนะนำตามกติกาในหน้านี้ ไม่ใช่ผลจาก AI คุณเป็นคนเลือกโฟกัสเอง',
      dueNotice:'เลยกำหนด {overdue} งาน · กำหนดวันนี้ {today} งาน', dueNoticeDetail:'อ้างอิงวันที่ในงาน แสดงเมื่อเปิดหน้านี้เท่านั้น',
      waitingNotice:'รอติดตาม {count} งาน', waitingDetail:'งานสถานะ “รอ” ที่กำหนดวันนี้หรือก่อนหน้า', viewTasks:'ดูงาน',
      openTasks:'งานที่ยังไม่เสร็จ', completedTasks:'งานที่เสร็จแล้ว', totalTasks:'งานทั้งหมด', overdue:'เลยกำหนด', dueToday:'กำหนดวันนี้',
      active:'ยังไม่เสร็จ', everything:'ทั้งหมด', todo:'ยังไม่เริ่ม', doing:'กำลังทำ', waiting:'รอ', done:'เสร็จแล้ว',
      high:'สูง', medium:'ปานกลาง', low:'ต่ำ', unset:'ยังไม่กำหนด', title:'ชื่องาน', titlePlaceholder:'งานที่คุณต้องการทำ',
      project:'โปรเจกต์', projectPlaceholder:'เช่น เตรียมงานนำเสนอ', owner:'ผู้รับผิดชอบ', ownerPlaceholder:'เว้นว่างได้',
      nextAction:'ขั้นตอนถัดไป', nextPlaceholder:'สิ่งเล็ก ๆ ที่ลงมือทำต่อได้', date:'วันที่กำหนด / ติดตาม', priority:'ความสำคัญ', status:'สถานะ',
      taskNote:'รายละเอียด / บันทึก', taskNotePlaceholder:'บริบท ลิงก์ หรือสิ่งที่ควรจำ', dateHelp:'เว้นว่างได้ ระบบไม่กำหนดวันแทนคุณ',
      cancel:'ยกเลิก', save:'บันทึก', close:'ปิด', editTask:'แก้ไขงาน', taskSaved:'บันทึกงานแล้ว', taskCompleted:'ทำเครื่องหมายว่าเสร็จแล้ว', taskReopened:'เปิดงานอีกครั้งแล้ว',
      complete:'ทำเครื่องหมายว่าเสร็จ', reopen:'เปิดงานอีกครั้ง', focus:'เลือกเป็นงานโฟกัส', unfocus:'นำออกจากโฟกัส', focusLimit:'เลือกงานโฟกัสได้ไม่เกิน 3 งาน นำงานเดิมออกก่อน',
      focusDone:'เลือกโฟกัสได้เฉพาะงานที่ยังไม่เริ่มหรือกำลังทำ', focusAdded:'เพิ่มในโฟกัสแล้ว', focusRemoved:'นำออกจากโฟกัสแล้ว',
      sourceText:'ข้อความต้นฉบับที่นำเข้า', fieldRequired:'กรุณาใส่ชื่องาน', fieldTooLong:'ข้อความยาวเกินกำหนด กรุณาย่อหรือแบ่งเป็นหลายงาน',
      invalidDate:'กรุณาใส่วันที่จริงในรูปแบบ YYYY-MM-DD หรือเว้นว่าง', invalidChoice:'ค่าที่เลือกไม่ถูกต้อง กรุณาตรวจอีกครั้ง',
      noTasks:'ยังไม่มีงานในมุมมองนี้', noFilterTasks:'ไม่พบงานตามตัวกรองนี้', clearFilter:'แสดงงานทั้งหมด', noProject:'ยังไม่มีโปรเจกต์', noOwner:'ยังไม่ระบุผู้รับผิดชอบ',
      unscheduled:'ยังไม่กำหนดวัน', unscheduledHelp:'งานเหล่านี้ยังไม่อยู่บนปฏิทิน', noUnscheduled:'ทุกงานมีวันที่แล้ว',
      previousWeek:'สัปดาห์ก่อน', nextWeek:'สัปดาห์ถัดไป', thisWeek:'สัปดาห์นี้', previousMonth:'เดือนก่อน', nextMonth:'เดือนถัดไป', thisMonth:'เดือนนี้',
      noDayTasks:'ไม่มีงานที่กำหนดไว้', countTasks:'{count} งาน', countMore:'อีก {count} งาน', selectedDay:'งานวันที่ {date}',
      projectProgress:'เสร็จ {done} จาก {total} งาน', percentage:'{count}% เสร็จแล้ว', projectOpen:'ยังเหลือ {count} งาน', noProjects:'เมื่อคุณระบุโปรเจกต์ในงาน จะเห็นความคืบหน้าที่นี่',
      allProjects:'โปรเจกต์ทั้งหมด', progressExplanation:'เปอร์เซ็นต์นี้นับจำนวนงาน ไม่ได้ถ่วงน้ำหนักเวลา ความยาก หรือมูลค่า',
      noteTitle:'ชื่อบันทึก', noteTitlePlaceholder:'ความคิดหรือสิ่งที่อยากเก็บไว้', noteBody:'เนื้อหา', noteBodyPlaceholder:'เขียนสิ่งที่เรียนรู้ บริบท หรือไอเดีย…',
      linkedTask:'เชื่อมกับงาน', noLink:'ไม่เชื่อมกับงาน', editNote:'แก้ไขบันทึก', noteSaved:'บันทึกแล้ว', noteRequired:'กรุณาใส่ชื่อบันทึก',
      noNotes:'บันทึกสิ่งที่อยากกลับมาอ่าน แล้วเชื่อมกับงานที่เกี่ยวข้องได้', updated:'แก้ไข {date}', openLinked:'เปิดงานที่เชื่อมไว้: {title}',
      linkedNotes:'บันทึกที่เชื่อมกับงานนี้', noLinkedNotes:'ยังไม่มีบันทึกที่เชื่อมไว้',
      listTitle:'เปลี่ยนรายการเป็นงาน', listSubtitle:'หนึ่งบรรทัดต่อหนึ่งงาน ตรวจสอบก่อนเพิ่มทุกครั้ง', listLabel:'รายการงานของคุณ',
      listPlaceholder:'- อ่านเอกสารที่ค้างไว้\n- ร่างโครงงานนำเสนอ\n- [ ] นัดคุยเรื่องโปรเจกต์',
      listHelp:'ตัดเฉพาะหัวข้อย่อยหรือเครื่องหมายรายการออก เก็บข้อความต้นฉบับไว้ [x] หมายถึงเสร็จแล้ว ไม่เดาวัน ผู้รับผิดชอบ หรือความสำคัญ',
      preview:'ตรวจรายการ', listEmpty:'กรุณาวางงานอย่างน้อยหนึ่งบรรทัด', listPreview:'พร้อมเพิ่ม {count} งาน', applyList:'เพิ่ม {count} งาน',
      listPreserve:'งานเดิมยังอยู่ครบ รายการนี้จะเพิ่มเป็นงานใหม่ แม้ข้อความจะซ้ำกัน', listChanged:'รายการเปลี่ยนแล้ว กรุณาตรวจรายการใหม่ก่อนเพิ่ม',
      importedTasks:'เพิ่ม {count} งานแล้ว', exampleAdded:'เพิ่มข้อมูลตัวอย่างสมมติแล้ว', exampleLabel:'ข้อมูลตัวอย่างสมมติ ไม่ใช่งานจริงของคุณ',
      backupTitle:'ข้อมูลของคุณ', backupSubtitle:'ข้อมูลอยู่ในเบราว์เซอร์บนอุปกรณ์นี้เท่านั้น', exportTitle:'เก็บสำเนาไว้กับคุณ',
      exportHelp:'ดาวน์โหลดไฟล์ JSON ที่มีงาน บันทึก โฟกัส และการตั้งค่า แล้วนำไปเก็บในที่ปลอดภัย', exportJson:'ส่งออก JSON',
      importTitle:'นำเข้าสำเนาข้อมูล', importHelp:'ตรวจไฟล์และแสดงผลที่จะเกิดขึ้นก่อนเพิ่มข้อมูล งานและบันทึกเดิมจะคงอยู่', chooseFile:'เลือกไฟล์ JSON',
      privacyTitle:'ขอบเขตของพื้นที่นี้', privacyBody:'ไม่มีบัญชีผู้ใช้ เซิร์ฟเวอร์ หรือการซิงก์ ล้างข้อมูลเว็บไซต์หรือเปลี่ยนเบราว์เซอร์อาจทำให้เข้าถึงข้อมูลเดิมไม่ได้ หน้านี้ไม่ส่งการเตือนเมื่อปิดอยู่',
      backupPreview:'ตรวจข้อมูลก่อนนำเข้า', backupPreviewHelp:'จับคู่ด้วย ID ของแต่ละงานและบันทึก ไม่ได้จับคู่ด้วยชื่อ',
      newTasks:'งานใหม่ที่จะเพิ่ม', newNotes:'บันทึกใหม่ที่จะเพิ่ม', conflicts:'ID ซ้ำที่มีข้อมูลต่างกัน', unchanged:'ID ซ้ำที่ข้อมูลเหมือนเดิม',
      mergePolicy:'เมื่อ ID ซ้ำ จะเก็บข้อมูลเดิมในเบราว์เซอร์ งานและบันทึกอื่นยังอยู่ครบ การตั้งค่าภาษาและธีมปัจจุบันยังเหมือนเดิม โฟกัสเดิมมาก่อนและรับเพิ่มได้รวมไม่เกิน 3 งาน',
      confirmImport:'ยืนยันเพิ่มข้อมูล', backupImported:'นำเข้าข้อมูลแล้ว', backupExported:'สร้างไฟล์สำรองแล้ว', invalidJson:'อ่านไฟล์ JSON ไม่ได้ กรุณาเลือกไฟล์สำรองที่ถูกต้อง',
      invalidBackup:'รูปแบบข้อมูลไม่ถูกต้องหรือเป็นเวอร์ชันที่ไม่รองรับ', invalidRecord:'ข้อมูลบางรายการไม่ถูกต้อง กรุณาตรวจวันที่ ความยาวข้อความ และตัวเลือก',
      duplicateIds:'มี ID ซ้ำภายในไฟล์ กรุณาใช้ไฟล์ที่มี ID ไม่ซ้ำกัน', invalidFocus:'รายการโฟกัสต้องไม่เกิน 3 งานและอ้างถึงงานสถานะยังไม่เริ่มหรือกำลังทำ',
      fileTooLarge:'ไฟล์หรือข้อมูลใหญ่เกินขีดจำกัด 8 MB', tooManyRecords:'จำนวนรายการเกินขีดจำกัด (งาน 10,000 / บันทึก 5,000)',
      cannotReadFile:'อ่านไฟล์ไม่ได้ กรุณาลองเลือกไฟล์อีกครั้ง', cannotExport:'สร้างไฟล์ดาวน์โหลดไม่ได้ ข้อมูลยังอยู่ในหน้านี้ กรุณาลองใหม่',
      corruptStorage:'ข้อมูลเดิมในเบราว์เซอร์อ่านไม่ได้ จึงยังไม่เขียนทับ ข้อมูลที่แก้ในหน้านี้จะยังไม่ถูกบันทึกลงเครื่อง',
      storageFailed:'บันทึกลงเบราว์เซอร์ไม่สำเร็จ ข้อมูลล่าสุดยังอยู่ในหน้านี้ กรุณาส่งออกสำเนาก่อนปิดหรือรีโหลด',
      downloadOriginal:'ดาวน์โหลดข้อมูลเดิม', recoverStorage:'เริ่มข้อมูลในเครื่องใหม่', retrySave:'ลองบันทึกอีกครั้ง',
      recoveryTitle:'ยืนยันเริ่มข้อมูลในเครื่องใหม่', recoveryBody:'การยืนยันจะเขียนข้อมูลที่อยู่ในหน้านี้ทับช่องเก็บข้อมูลเดิมที่อ่านไม่ได้ แนะนำให้ดาวน์โหลดข้อมูลเดิมก่อน คุณยังนำเข้าไฟล์สำรองภายหลังได้',
      confirmRecovery:'ยืนยันเขียนข้อมูลชุดนี้', recovered:'บันทึกข้อมูลชุดนี้ลงเบราว์เซอร์แล้ว', retrySuccess:'บันทึกลงเบราว์เซอร์สำเร็จ',
      searchResults:'ผลการค้นหา', searchFor:'ค้นหา “{query}”', noSearch:'ไม่พบงานหรือบันทึกที่ตรงกัน ลองใช้คำอื่น', tasksFound:'งาน · {count}', notesFound:'บันทึก · {count}',
      dueOn:'กำหนด {date}', reasonOverdue:'เลยวันที่ที่คุณกำหนด', reasonToday:'ถึงวันที่ที่คุณกำหนดวันนี้', reasonDate:'วันที่ที่กำหนด: {date}',
      reasonPriority:'ความสำคัญ: {priority}', reasonUnscheduled:'ยังไม่มีวันที่หรือความสำคัญ ลองกำหนดขั้นตอนถัดไป',
      suggestionStep:'ก้าวถัดไป: {action}', defineNext:'ระบุขั้นตอนแรกของงานนี้', followUp:'ติดตามความคืบหน้าของงานนี้',
      taskAria:'{action}: {title}', progressAria:'{project}: เสร็จ {done} จาก {total} งาน', calendarAria:'{date}, {count} งาน',
      appReady:'พร้อมใช้งาน', originalDownloaded:'ดาวน์โหลดข้อมูลเดิมแล้ว', savedLocally:'บันทึกในเบราว์เซอร์นี้แล้ว',
      importFocus:'โฟกัสหลังนำเข้า', noDate:'ไม่กำหนดวัน', invalidLink:'บันทึกอ้างถึงงานที่ไม่มีอยู่ในไฟล์',
    },
    en: {
      documentTitle:'Workspace · Work & Second Brain', skip:'Skip to content', navigation:'Main navigation', workspace:'YOUR WORKSPACE',
      today:'Today', all:'All tasks', week:'Week', month:'Month', projects:'Projects', notes:'Notes',
      browserLocal:'Saved in this browser', localDetail:'No device sync. Back up your work regularly.', dataBackup:'Data & backups', backup:'Back up',
      search:'Search tasks and notes', searchPlaceholder:'Search tasks and notes…', addTask:'Add task', addNote:'Add note',
      darkTheme:'Use dark theme', lightTheme:'Use light theme', footer:'Your personal workspace · Notices appear only while this page is open',
      todaySubtitle:'Choose what matters. Take it one task at a time.', allSubtitle:'A home for every task, ready when you are.',
      weekSubtitle:'Tasks on their assigned dates. An empty day does not mean you have no work.', monthSubtitle:'See the month ahead. Select a day to see its tasks.',
      projectsSubtitle:'Progress based on completed tasks in each project.', notesSubtitle:'Keep thoughts, lessons, and context close to the work.',
      welcomeTitle:'Start with your own to-do list', welcomeBody:'Paste the list you already have. Each line becomes a task. Review it before adding, then choose what to focus on today.',
      pasteList:'Paste a to-do list', blankTask:'Or add your first task', exampleHelp:'Want to explore first? Try fictional sample data.', loadExample:'Add fictional examples',
      focusTitle:'Your focus today', focusHelp:'Choose up to 3 tasks yourself', focusCount:'{count} / 3 tasks',
      focusEmpty:'No focus tasks yet. Use the star beside a task to choose it for today.', chooseFocus:'Choose from all tasks',
      suggestions:'Suggested next actions', suggestionsHelp:'Ordered by the dates and priorities you set', noSuggestions:'No open tasks to suggest. Add one when you are ready.',
      suggestedDisclosure:'These are simple on-page rules, not AI results. You choose your own focus.',
      dueNotice:'{overdue} overdue · {today} due today', dueNoticeDetail:'Based on task dates. Shown only while this page is open.',
      waitingNotice:'{count} tasks to follow up', waitingDetail:'Waiting tasks dated today or earlier', viewTasks:'View tasks',
      openTasks:'Open tasks', completedTasks:'Completed tasks', totalTasks:'Total tasks', overdue:'Overdue', dueToday:'Due today',
      active:'Open', everything:'All', todo:'To do', doing:'Doing', waiting:'Waiting', done:'Done',
      high:'High', medium:'Medium', low:'Low', unset:'Not set', title:'Task title', titlePlaceholder:'What do you want to get done?',
      project:'Project', projectPlaceholder:'e.g. Prepare a presentation', owner:'Owner', ownerPlaceholder:'Optional',
      nextAction:'Next action', nextPlaceholder:'A small, concrete step you can take', date:'Due / follow-up date', priority:'Priority', status:'Status',
      taskNote:'Details / note', taskNotePlaceholder:'Context, links, or things to remember', dateHelp:'Optional. No date is assigned for you.',
      cancel:'Cancel', save:'Save', close:'Close', editTask:'Edit task', taskSaved:'Task saved', taskCompleted:'Task marked complete', taskReopened:'Task reopened',
      complete:'Mark complete', reopen:'Reopen task', focus:'Choose as a focus task', unfocus:'Remove from focus', focusLimit:'Choose up to 3 focus tasks. Remove an existing one first.',
      focusDone:'Focus is available for to-do and doing tasks only.', focusAdded:'Added to your focus', focusRemoved:'Removed from your focus',
      sourceText:'Original imported text', fieldRequired:'Please enter a task title.', fieldTooLong:'This text is too long. Shorten it or split it into several tasks.',
      invalidDate:'Enter a real date in YYYY-MM-DD format, or leave it empty.', invalidChoice:'One of the selected values is invalid. Please check again.',
      noTasks:'No tasks in this view yet.', noFilterTasks:'No tasks match this filter.', clearFilter:'Show all tasks', noProject:'No project yet', noOwner:'No owner assigned',
      unscheduled:'Unscheduled', unscheduledHelp:'These tasks do not appear on the calendar yet.', noUnscheduled:'Every task has a date.',
      previousWeek:'Previous week', nextWeek:'Next week', thisWeek:'This week', previousMonth:'Previous month', nextMonth:'Next month', thisMonth:'This month',
      noDayTasks:'No tasks scheduled', countTasks:'{count} tasks', countMore:'{count} more', selectedDay:'Tasks for {date}',
      projectProgress:'{done} of {total} tasks done', percentage:'{count}% complete', projectOpen:'{count} still open', noProjects:'Add a project name to a task to see its progress here.',
      allProjects:'All projects', progressExplanation:'Percentages count tasks equally. They do not measure time, difficulty, or value.',
      noteTitle:'Note title', noteTitlePlaceholder:'An idea or something to keep', noteBody:'Content', noteBodyPlaceholder:'Capture a lesson, some context, or an idea…',
      linkedTask:'Linked task', noLink:'No linked task', editNote:'Edit note', noteSaved:'Note saved', noteRequired:'Please enter a note title.',
      noNotes:'Keep something you want to revisit. You can link a note to a related task.', updated:'Updated {date}', openLinked:'Open linked task: {title}',
      linkedNotes:'Notes linked to this task', noLinkedNotes:'No linked notes yet.',
      listTitle:'Turn your list into tasks', listSubtitle:'One task per line. Review before adding.', listLabel:'Your to-do list',
      listPlaceholder:'- Read the documents\n- Draft the presentation outline\n- [ ] Arrange a project conversation',
      listHelp:'Only list markers are removed. Original text is kept. [x] means done. Dates, owners, and priorities are never guessed.',
      preview:'Preview tasks', listEmpty:'Paste at least one task line.', listPreview:'Ready to add {count} tasks', applyList:'Add {count} tasks',
      listPreserve:'Existing tasks stay as they are. These will be new tasks, even when their text is repeated.', listChanged:'Your list changed. Preview it again before adding.',
      importedTasks:'Added {count} tasks', exampleAdded:'Fictional example data added', exampleLabel:'Fictional examples, not your real work',
      backupTitle:'Your data', backupSubtitle:'Your work stays in this browser on this device.', exportTitle:'Keep a copy with you',
      exportHelp:'Download a JSON file with your tasks, notes, focus, and settings. Keep it somewhere safe.', exportJson:'Export JSON',
      importTitle:'Import a backup', importHelp:'Check the file and preview changes before adding. Your existing tasks and notes stay intact.', chooseFile:'Choose JSON file',
      privacyTitle:'How this workspace works', privacyBody:'There is no account, server, or sync. Clearing site data or changing browsers can remove access to your work. This page cannot send reminders while closed.',
      backupPreview:'Review your backup', backupPreviewHelp:'Records are matched by their IDs, not by their titles.',
      newTasks:'New tasks to add', newNotes:'New notes to add', conflicts:'Matching IDs with different data', unchanged:'Matching IDs with identical data',
      mergePolicy:'For matching IDs, the existing browser record wins. Other tasks and notes stay intact. Your current language and theme stay the same. Existing focus comes first; imported focus can fill remaining slots, up to 3.',
      confirmImport:'Confirm and add', backupImported:'Backup imported', backupExported:'Backup file created', invalidJson:'This is not readable JSON. Choose a valid backup file.',
      invalidBackup:'This backup has an invalid format or an unsupported version.', invalidRecord:'Some records are invalid. Check dates, text lengths, and allowed choices.',
      duplicateIds:'The file contains duplicate IDs. Use a backup with unique IDs.', invalidFocus:'Focus must contain up to 3 unique, existing to-do or doing task IDs.',
      fileTooLarge:'The file or data exceeds the 8 MB limit.', tooManyRecords:'Too many records (maximum 10,000 tasks / 5,000 notes).',
      cannotReadFile:'The file could not be read. Please select it again.', cannotExport:'The download could not be created. Your data is still on this page. Please try again.',
      corruptStorage:'Existing browser data could not be read, so it has not been overwritten. Changes on this page are not being saved to this device.',
      storageFailed:'Saving to this browser failed. Your latest work is still on this page. Export a backup before closing or reloading.',
      downloadOriginal:'Download original data', recoverStorage:'Start browser storage afresh', retrySave:'Retry saving',
      recoveryTitle:'Confirm a fresh browser save', recoveryBody:'Confirming replaces the unreadable storage entry with the data currently on this page. Download the original data first if you want to keep it. You can import a backup later.',
      confirmRecovery:'Confirm and save this data', recovered:'This data is now saved in your browser', retrySuccess:'Saved to this browser successfully',
      searchResults:'Search results', searchFor:'Searching for “{query}”', noSearch:'No matching tasks or notes. Try a different search.', tasksFound:'Tasks · {count}', notesFound:'Notes · {count}',
      dueOn:'Due {date}', reasonOverdue:'Past the date you set', reasonToday:'The date you set is today', reasonDate:'Assigned date: {date}',
      reasonPriority:'Priority: {priority}', reasonUnscheduled:'No date or priority yet. Try defining a next action.',
      suggestionStep:'Next: {action}', defineNext:'Define the first step for this task', followUp:'Follow up on this task',
      taskAria:'{action}: {title}', progressAria:'{project}: {done} of {total} tasks done', calendarAria:'{date}, {count} tasks',
      appReady:'Ready to use', originalDownloaded:'Original data downloaded', savedLocally:'Saved in this browser',
      importFocus:'Focus after import', noDate:'No date', invalidLink:'A note refers to a task that is missing from the file.',
    },
  };
  const icons = {
    today:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
    all:'<path d="m4 6 1 1 2-2m3 1h10M4 12h3m3 0h10M4 18h3m3 0h10"/>',
    week:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18M7 14h3m4 0h3M7 17h3"/>',
    month:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18M7 14h1m3 0h1m3 0h1M7 17h1m3 0h1m3 0h1"/>',
    projects:'<path d="M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    notes:'<path d="M5 3h11l3 3v15H5Z"/><path d="M15 3v4h4M8 11h8m-8 4h6"/>',
    star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
    check:'<path d="m5 12 4 4L19 6"/>', edit:'<path d="m4 16 11-11 4 4L8 20H4Zm9-9 4 4"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>', left:'<path d="m14 5-7 7 7 7"/>', right:'<path d="m10 5 7 7-7 7"/>',
    moon:'<path d="M20 14a8.5 8.5 0 0 1-10-10A8.5 8.5 0 1 0 20 14Z"/>',
    user:'<circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    import:'<path d="M5 4h14v16H5Z"/><path d="M8 9h8m-8 4h5m-5 4h8"/>',
  };
  const $ = (s, root = document) => root.querySelector(s);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.notes}</svg>`;
  const freshState = () => ({version:1, settings:{language:'th',theme:'light'}, tasks:[], notes:[], focusIds:[]});
  const uid = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  const isoToday = () => dateKey(new Date());
  const dateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const fromKey = key => { const [y,m,d] = key.split('-').map(Number); return new Date(y,m-1,d,12); };
  const validDate = value => value === '' || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number(value.slice(0,4)) >= 1000 && dateKey(fromKey(value)) === value);
  const clone = data => JSON.parse(JSON.stringify(data));
  const byteSize = value => new TextEncoder().encode(typeof value === 'string' ? value : JSON.stringify(value)).length;
  const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const validString = (value,max,required=false) => typeof value === 'string' && value.length <= max && (!required || !!value.trim());
  const validId = value => validString(value,160,true) && !/[\u0000-\u001f]/.test(value);
  const validStamp = value => typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(value) && Number.isFinite(Date.parse(value));
  const taskValid = item => isObject(item) && validId(item.id) && validString(item.title,500,true) && validString(item.project,200) && validString(item.owner,200) && validString(item.nextAction,4000) && validDate(item.date) && ['', 'high','medium','low'].includes(item.priority) && ['todo','doing','waiting','done'].includes(item.status) && validString(item.note,50000) && validString(item.sourceText,10000) && validStamp(item.createdAt) && validStamp(item.updatedAt);
  const noteValid = item => isObject(item) && validId(item.id) && validString(item.title,500,true) && validString(item.body,100000) && validString(item.taskId,160) && validStamp(item.createdAt) && validStamp(item.updatedAt);

  /** Pure validator. Returns {ok:true,data} or {ok:false,error:<translation key>}. */
  function validateBackup(input) {
    let data = input;
    try {
      if (byteSize(input) > MAX_BYTES) return {ok:false,error:'fileTooLarge'};
      if (typeof input === 'string') { try { data = JSON.parse(input); } catch { return {ok:false,error:'invalidJson'}; } }
      if (!isObject(data) || data.version !== 1 || !isObject(data.settings) || !['th','en'].includes(data.settings.language) || !['light','dark'].includes(data.settings.theme) || !Array.isArray(data.tasks) || !Array.isArray(data.notes) || !Array.isArray(data.focusIds)) return {ok:false,error:'invalidBackup'};
      if (data.tasks.length > 10000 || data.notes.length > 5000) return {ok:false,error:'tooManyRecords'};
      if (!data.tasks.every(taskValid) || !data.notes.every(noteValid)) return {ok:false,error:'invalidRecord'};
      const taskIds = new Set(data.tasks.map(x=>x.id)), noteIds = new Set(data.notes.map(x=>x.id));
      if (taskIds.size !== data.tasks.length || noteIds.size !== data.notes.length) return {ok:false,error:'duplicateIds'};
      if (data.notes.some(x=>x.taskId && !taskIds.has(x.taskId))) return {ok:false,error:'invalidLink'};
      if (data.focusIds.length > 3 || new Set(data.focusIds).size !== data.focusIds.length || data.focusIds.some(id=>!validId(id) || !data.tasks.some(task=>task.id===id && ['todo','doing'].includes(task.status)))) return {ok:false,error:'invalidFocus'};
      return {ok:true,data:clone(data)};
    } catch { return {ok:false,error:'invalidBackup'}; }
  }

  /** Pure existing-wins merge. Validates both states. Never mutates either input. */
  function mergeBackup(existing, imported) {
    const a = validateBackup(existing), b = validateBackup(imported);
    if (!a.ok) return a;
    if (!b.ok) return b;
    const result = clone(a.data), counts = {newTasks:0,newNotes:0,conflicts:0,unchanged:0};
    for (const key of ['tasks','notes']) {
      const records = new Map(result[key].map(item=>[item.id,item]));
      for (const item of b.data[key]) {
        if (!records.has(item.id)) { result[key].push(clone(item)); counts[key==='tasks'?'newTasks':'newNotes']++; }
        else if (JSON.stringify(records.get(item.id)) === JSON.stringify(item)) counts.unchanged++;
        else counts.conflicts++;
      }
    }
    const openIds = new Set(result.tasks.filter(item=>['todo','doing'].includes(item.status)).map(item=>item.id));
    result.focusIds = [...new Set([...result.focusIds,...b.data.focusIds])].filter(id=>openIds.has(id)).slice(0,3);
    const checked = validateBackup(result);
    return checked.ok ? {ok:true,data:result,counts} : checked;
  }

  /** Pure line parser. Source lines are retained; no dates, owners, or priorities inferred. */
  function parseTaskList(raw) {
    if (typeof raw !== 'string') return {ok:false,error:'listEmpty'};
    if (byteSize(raw)>MAX_BYTES) return {ok:false,error:'fileTooLarge'};
    const items = [];
    for (const sourceText of raw.split(/\r?\n/)) {
      if (!sourceText.trim()) continue;
      let title = sourceText.trim();
      title = title.replace(/^(?:[-*•▪◦]\s+|\d+[.)]\s+)/,'');
      const checkbox = title.match(/^\[([ xX])\]\s*/);
      const status = checkbox && checkbox[1].toLowerCase() === 'x' ? 'done' : 'todo';
      if (checkbox) title = title.slice(checkbox[0].length);
      title = title.trim() || sourceText.trim();
      if (title.length>500 || sourceText.length>10000) return {ok:false,error:'fieldTooLong'};
      items.push({title,status,sourceText});
      if (items.length>10000) return {ok:false,error:'tooManyRecords'};
    }
    return items.length ? {ok:true,items} : {ok:false,error:'listEmpty'};
  }

  let state = freshState(), storageBlocked = false, storageError = '', originalRaw = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = validateBackup(raw);
      if (parsed.ok) state = parsed.data;
      else { storageBlocked = true; storageError = 'corruptStorage'; originalRaw = raw; }
    }
  } catch { storageBlocked = true; storageError = 'storageFailed'; }
  let view = ['today','all','week','month','projects','notes'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'today';
  let searchQuery = '', filter = 'active', projectFilter = null, weekAnchor = new Date(), monthAnchor = new Date(), selectedDay = isoToday();
  let listRaw = '', listPreview = null, listError = '', backupPreview = null, backupError = '', taskFormError = '', noteFormError = '';
  let toastTimer = null, toastState = null;
  const t = (key, vars={}) => (LANG[state.settings.language][key] || LANG.en[key] || key).replace(/\{(\w+)\}/g,(_,name)=>String(vars[name] ?? ''));
  const fmtDate = (key, options={day:'numeric',month:'short'}) => new Intl.DateTimeFormat(state.settings.language==='th'?'th-TH':'en-GB',options).format(typeof key==='string'?fromKey(key):key);
  const fmtNumber = value => new Intl.NumberFormat(state.settings.language==='th'?'th-TH':'en-GB').format(value);
  const taskById = id => state.tasks.find(task=>task.id===id);
  const newTask = (title='', other={}) => { const now = new Date().toISOString(); return {id:uid(),title,project:'',owner:'',nextAction:'',date:'',priority:'',status:'todo',note:'',sourceText:'',createdAt:now,updatedAt:now,...other}; };

  function saveState() {
    if (storageBlocked) { renderStorage(); return false; }
    const check = validateBackup(state);
    if (!check.ok) { storageError = 'storageFailed'; renderStorage(); return false; }
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); storageError=''; renderStorage(); return true; }
    catch { storageError='storageFailed'; renderStorage(); return false; }
  }
  function commit(next, success, vars={}) {
    const check = validateBackup(next);
    if (!check.ok) { showToast(check.error); return false; }
    state = check.data;
    const saved=saveState(); render();
    showToast(saved ? success : storageError || 'storageFailed', saved?vars:{});
    return true;
  }
  function showToast(key, vars={}) {
    toastState={key,vars}; $('#toast').textContent=t(key,vars); $('#toast').classList.add('visible');
    renderModalFeedback();
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>{ $('#toast').classList.remove('visible'); document.querySelectorAll('.dialog-feedback').forEach(el=>el.remove()); toastState=null; },6000);
  }
  function renderModalFeedback() {
    const dialog=[...document.querySelectorAll('dialog[open]')].at(-1);
    if(!dialog||!toastState)return;
    let feedback=$('.dialog-feedback',dialog);
    if(!feedback){feedback=document.createElement('p');feedback.className='dialog-feedback dialog-warning';feedback.setAttribute('role','status');const footer=$('.dialog-footer',dialog),body=$('.dialog-body',dialog);if(footer)footer.before(feedback);else body?.append(feedback);}
    feedback.textContent=t(toastState.key,toastState.vars);
  }
  function renderStorage() {
    $('#storage-banner').innerHTML = storageError ? `<div class="storage-message"><p>${esc(t(storageError))}</p><div class="header-actions">${originalRaw!==null?`<button class="text-button" data-action="download-original">${esc(t('downloadOriginal'))}</button><button class="text-button" data-action="open-recovery">${esc(t('recoverStorage'))}</button>`:`<button class="text-button" data-action="retry-save">${esc(t('retrySave'))}</button>`}<button class="text-button" data-action="export">${esc(t('exportJson'))}</button></div></div>` : '';
  }
  function renderShell() {
    document.documentElement.lang=state.settings.language; document.body.dataset.theme=state.settings.theme; document.title=t('documentTitle');
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder);});
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>{el.setAttribute('aria-label',t(el.dataset.i18nAria));});
    $('#language-toggle').textContent=state.settings.language==='th'?'EN':'ไทย';
    $('#language-toggle').setAttribute('aria-label',state.settings.language==='th'?'Switch interface to English':'เปลี่ยนภาษาหน้าจอเป็นไทย');
    $('#language-toggle').title=$('#language-toggle').getAttribute('aria-label');
    $('#theme-toggle').innerHTML=icon(state.settings.theme==='light'?'moon':'today');
    $('#theme-toggle').setAttribute('aria-label',t(state.settings.theme==='light'?'darkTheme':'lightTheme'));
    $('#theme-toggle').title=$('#theme-toggle').getAttribute('aria-label');
    $('#navigation').innerHTML=['today','all','week','month','projects','notes'].map(name=>`<button class="nav-button ${name===view&&!searchQuery?'active':''}" data-view="${name}" ${name===view&&!searchQuery?'aria-current="page"':''}>${icon(name)}<span>${esc(t(name))}</span>${name==='all'?`<span class="nav-count">${fmtNumber(state.tasks.filter(task=>task.status!=='done').length)}</span>`:name==='notes'?`<span class="nav-count">${fmtNumber(state.notes.length)}</span>`:''}</button>`).join('');
    if (toastState) $('#toast').textContent=t(toastState.key,toastState.vars);
    renderStorage();
  }
  function pageHeader(title, subtitle, actions='', eyebrow='') {
    return `<div class="page-header"><div>${eyebrow?`<p class="eyebrow">${esc(eyebrow)}</p>`:''}<h1>${esc(title)}</h1><p class="page-subtitle">${esc(subtitle)}</p></div>${actions?`<div class="header-actions">${actions}</div>`:''}</div>`;
  }
  const btn = (action,label,style='') => `<button class="button ${style}" data-action="${action}">${esc(t(label))}</button>`;
  const empty = (message,action='',label='') => `<div class="empty-panel"><p>${esc(t(message))}</p>${action?btn(action,label):''}</div>`;
  const sortTasks = tasks => [...tasks].sort((a,b)=>(a.status==='done')-(b.status==='done') || (a.date||'9999').localeCompare(b.date||'9999') || ({high:0,medium:1,low:2,'':3}[a.priority]-{high:0,medium:1,low:2,'':3}[b.priority]) || a.createdAt.localeCompare(b.createdAt));
  function taskRows(tasks, suggestions=false) {
    if (!tasks.length) return empty('noTasks');
    return `<div class="task-list">${tasks.map(task=>taskRow(task,suggestions)).join('')}</div>`;
  }
  function taskRow(task,suggestion=false) {
    const done=task.status==='done', focus=state.focusIds.includes(task.id), late=!done && task.date && task.date<isoToday();
    const action=done?'reopen':'complete';
    const reasons=[];
    if (task.date) reasons.push(t(task.date<isoToday()?'reasonOverdue':task.date===isoToday()?'reasonToday':'reasonDate',{date:fmtDate(task.date)}));
    if (task.priority) reasons.push(t('reasonPriority',{priority:t(task.priority)}));
    if (!reasons.length) reasons.push(t('reasonUnscheduled'));
    const next=task.nextAction || (task.status==='waiting'?t('followUp'):t('defineNext'));
    return `<article class="task-row ${done?'is-done':''}" data-task-id="${esc(task.id)}"><button class="task-check ${done?'done':''}" data-action="toggle-complete" data-id="${esc(task.id)}" aria-label="${esc(t('taskAria',{action:t(action),title:task.title}))}" title="${esc(t(action))}">${icon('check')}</button><div class="task-content"><button class="task-title" data-action="edit-task" data-id="${esc(task.id)}">${esc(task.title)}</button><div class="task-meta">${task.project?`<span>${icon('projects')}${esc(task.project)}</span>`:''}${task.owner?`<span>${icon('user')}${esc(task.owner)}</span>`:''}<span>${esc(t(task.status))}</span>${task.date?`<span class="${late?'overdue':''}">${icon('clock')}${esc(late?t('overdue')+' · '+fmtDate(task.date):fmtDate(task.date))}</span>`:`<span>${esc(t('unscheduled'))}</span>`}${task.priority?`<span class="priority-${task.priority}"><i class="priority-dot" aria-hidden="true"></i>${esc(t(task.priority))}</span>`:''}</div>${suggestion?`<p class="task-next"><strong>${esc(t('suggestionStep',{action:next}))}</strong></p><p class="reason">${esc(reasons.join(' · '))}</p>`:task.nextAction?`<p class="task-next">${esc(t('suggestionStep',{action:task.nextAction}))}</p>`:''}</div><div class="task-tools">${!done && task.status!=='waiting'?`<button class="icon-button ${focus?'is-focus':''}" data-action="toggle-focus" data-id="${esc(task.id)}" aria-pressed="${focus}" aria-label="${esc(t('taskAria',{action:t(focus?'unfocus':'focus'),title:task.title}))}" title="${esc(t(focus?'unfocus':'focus'))}">${icon('star')}</button>`:''}<button class="icon-button" data-action="edit-task" data-id="${esc(task.id)}" aria-label="${esc(t('taskAria',{action:t('editTask'),title:task.title}))}" title="${esc(t('editTask'))}">${icon('edit')}</button></div></article>`;
  }
  function welcome() {
    return `<section class="welcome"><div class="welcome-top"><div class="welcome-symbol">${icon('import')}</div><h2>${esc(t('welcomeTitle'))}</h2><p>${esc(t('welcomeBody'))}</p><div class="header-actions">${btn('open-list','pasteList','primary')}${btn('add-task','blankTask')}</div></div><div class="welcome-foot"><span>${esc(t('exampleHelp'))}</span><button class="text-button" data-action="load-example">${esc(t('loadExample'))}</button></div></section>`;
  }
  function renderToday() {
    const open=state.tasks.filter(task=>task.status!=='done'), today=isoToday(), due=open.filter(task=>task.date===today), late=open.filter(task=>task.date && task.date<today), waiting=open.filter(task=>task.status==='waiting' && task.date && task.date<=today);
    let html=pageHeader(t('today'),t('todaySubtitle'),state.tasks.length?btn('open-list','pasteList'):'',fmtDate(new Date(),{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
    if (!state.tasks.length) return html+welcome();
    if (late.length || due.length) html+=`<div class="notice">${icon('clock')}<div><strong>${esc(t('dueNotice',{overdue:fmtNumber(late.length),today:fmtNumber(due.length)}))}</strong><p>${esc(t('dueNoticeDetail'))}</p></div></div>`;
    const focus=state.focusIds.map(taskById).filter(Boolean);
    html+=`<section><div class="section-heading"><div><h2>${esc(t('focusTitle'))}</h2><p>${esc(t('focusHelp'))}</p></div><span class="pill">${esc(t('focusCount',{count:fmtNumber(focus.length)}))}</span></div>${focus.length?taskRows(focus):empty('focusEmpty','go-all','chooseFocus')}</section>`;
    const suggestions=sortTasks(open.filter(task=>task.status!=='waiting'&&!state.focusIds.includes(task.id))).slice(0,3);
    html+=`<section class="section"><div class="section-heading"><div><h2>${esc(t('suggestions'))}</h2><p>${esc(t('suggestionsHelp'))}</p></div></div>${suggestions.length?taskRows(suggestions,true):empty('noSuggestions')}<p class="inline-help">${esc(t('suggestedDisclosure'))}</p></section>`;
    if (waiting.length) html+=`<section class="section"><div class="section-heading"><div><h2>${esc(t('waitingNotice',{count:fmtNumber(waiting.length)}))}</h2><p>${esc(t('waitingDetail'))}</p></div></div>${taskRows(sortTasks(waiting))}</section>`;
    return html;
  }
  function renderAll() {
    const open=state.tasks.filter(task=>task.status!=='done').length;
    let html=pageHeader(t('all'),t('allSubtitle'),btn('open-list','pasteList'));
    if (!state.tasks.length) return html+welcome();
    html+=`<div class="stats-row">${[['openTasks',open],['completedTasks',state.tasks.length-open],['totalTasks',state.tasks.length]].map(([key,value])=>`<div class="stat"><div class="stat-number">${fmtNumber(value)}</div><p class="stat-label">${esc(t(key))}</p></div>`).join('')}</div>`;
    html+=`<div class="filters" aria-label="${esc(t('status'))}">${['active','everything','todo','doing','waiting','done','overdue'].map(name=>`<button class="filter-button ${filter===name?'active':''}" data-filter="${name}" aria-pressed="${filter===name}">${esc(t(name))}</button>`).join('')}</div>`;
    const tasks=state.tasks.filter(task=>filter==='everything' || (filter==='active'?task.status!=='done':filter==='overdue'?task.status!=='done'&&task.date&&task.date<isoToday():task.status===filter));
    return html+(tasks.length?taskRows(sortTasks(tasks)):empty('noFilterTasks','clear-filter','clearFilter'));
  }
  function unscheduledSection() {
    const tasks=state.tasks.filter(task=>!task.date);
    return `<section class="section" id="unscheduled"><div class="section-heading"><div><h2>${esc(t('unscheduled'))} <span class="pill">${fmtNumber(tasks.length)}</span></h2><p>${esc(t('unscheduledHelp'))}</p></div></div>${tasks.length?taskRows(sortTasks(tasks)):empty('noUnscheduled')}</section>`;
  }
  function periodControls(period) {
    const cap=period==='week'?'Week':'Month';
    return `<button class="icon-button" data-action="previous-${period}" aria-label="${esc(t('previous'+cap))}" title="${esc(t('previous'+cap))}">${icon('left')}</button>${btn('this-'+period,'this'+cap,'small')}<button class="icon-button" data-action="next-${period}" aria-label="${esc(t('next'+cap))}" title="${esc(t('next'+cap))}">${icon('right')}</button>`;
  }
  function weekStart(date) { const start=new Date(date); start.setHours(12,0,0,0); start.setDate(start.getDate()-((start.getDay()+6)%7)); return start; }
  function renderWeek() {
    const start=weekStart(weekAnchor), end=new Date(start); end.setDate(end.getDate()+6);
    let html=pageHeader(t('week'),t('weekSubtitle'),periodControls('week'),`${fmtDate(start,{day:'numeric',month:'short'})} – ${fmtDate(end,{day:'numeric',month:'short',year:'numeric'})}`);
    html+='<div class="week-list">';
    for(let i=0;i<7;i++) { const day=new Date(start); day.setDate(day.getDate()+i); const key=dateKey(day), tasks=state.tasks.filter(task=>task.date===key); html+=`<section class="day-group"><h2 class="day-heading ${key===isoToday()?'today':''}">${esc(fmtDate(day,{weekday:'short'}))}<strong>${esc(fmtDate(day,{day:'numeric'}))}</strong>${key===isoToday()?esc(t('today')):''}</h2>${tasks.length?taskRows(sortTasks(tasks)):`<div class="day-empty">${esc(t('noDayTasks'))}</div>`}</section>`; }
    return html+'</div>'+unscheduledSection();
  }
  function renderMonth() {
    const first=new Date(monthAnchor.getFullYear(),monthAnchor.getMonth(),1,12), start=weekStart(first);
    let html=pageHeader(t('month'),t('monthSubtitle'),periodControls('month'),fmtDate(first,{month:'long',year:'numeric'}));
    html+='<div class="calendar"><div class="calendar-weekdays">';
    for(let i=0;i<7;i++) { const day=new Date(start); day.setDate(day.getDate()+i); html+=`<div>${esc(fmtDate(day,{weekday:'short'}))}</div>`; }
    html+='</div><div class="calendar-grid">';
    const last=new Date(first.getFullYear(),first.getMonth()+1,0,12), cells=Math.ceil((((first.getDay()+6)%7)+last.getDate())/7)*7;
    for(let i=0;i<cells;i++) { const day=new Date(start); day.setDate(day.getDate()+i); const key=dateKey(day), tasks=state.tasks.filter(task=>task.date===key); html+=`<button class="calendar-cell ${day.getMonth()!==first.getMonth()?'outside':''} ${key===isoToday()?'is-today':''} ${selectedDay===key?'selected':''}" data-day="${key}" aria-pressed="${selectedDay===key}" aria-label="${esc(t('calendarAria',{date:fmtDate(day,{day:'numeric',month:'long',year:'numeric'}),count:fmtNumber(tasks.length)}))}"><span class="calendar-day">${esc(fmtDate(day,{day:'numeric'}))}</span>${tasks.slice(0,2).map(task=>`<span class="calendar-task">${esc(task.title)}</span>`).join('')}${tasks.length?`<span class="calendar-count">${esc(t('countTasks',{count:fmtNumber(tasks.length)}))}</span>`:''}</button>`; }
    html+='</div></div>';
    const selected=state.tasks.filter(task=>task.date===selectedDay);
    html+=`<section class="section"><div class="section-heading"><h2>${esc(t('selectedDay',{date:fmtDate(selectedDay,{day:'numeric',month:'long',year:'numeric'})}))}</h2></div>${selected.length?taskRows(sortTasks(selected)):empty('noDayTasks')}</section>`;
    return html+unscheduledSection();
  }
  function renderProjects() {
    let html=pageHeader(t('projects'),t('projectsSubtitle'));
    if (!state.tasks.length) return html+empty('noProjects','add-task','addTask');
    const projects=[...new Set(state.tasks.map(task=>task.project))].sort((a,b)=>a.localeCompare(b,state.settings.language));
    if (projectFilter!==null) {
      const tasks=state.tasks.filter(task=>task.project===projectFilter);
      return html+`<div class="section-heading"><h2>${esc(projectFilter||t('noProject'))}</h2><button class="text-button" data-action="all-projects">${esc(t('allProjects'))}</button></div>`+taskRows(sortTasks(tasks));
    }
    html+='<div class="project-grid">';
    projects.forEach((name,index)=>{ const tasks=state.tasks.filter(task=>task.project===name), done=tasks.filter(task=>task.status==='done').length, percent=Math.round(done/tasks.length*100); html+=`<button class="project-card" data-project-index="${index}"><h2>${esc(name||t('noProject'))}</h2><p class="project-count">${esc(t('projectProgress',{done:fmtNumber(done),total:fmtNumber(tasks.length)}))}</p><div class="progress-track" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(t('progressAria',{project:name||t('noProject'),done,total:tasks.length}))}"><div class="progress-fill" style="width:${percent}%"></div></div><div class="project-footer"><span>${esc(t('percentage',{count:fmtNumber(percent)}))}</span><span>${esc(t('projectOpen',{count:fmtNumber(tasks.length-done)}))}</span></div></button>`; });
    return html+'</div>'+`<p class="inline-help">${esc(t('progressExplanation'))}</p>`;
  }
  function notesCards(notes) {
    return `<div class="notes-grid">${notes.map(note=>{const linked=taskById(note.taskId);return `<article class="note-card"><h2>${esc(note.title)}</h2><p>${esc(note.body)}</p>${linked?`<button class="text-button note-link" data-action="edit-task" data-id="${esc(linked.id)}" aria-label="${esc(t('openLinked',{title:linked.title}))}">↗ ${esc(linked.title)}</button>`:''}<div class="note-footer"><span>${esc(t('updated',{date:fmtDate(new Date(note.updatedAt),{day:'numeric',month:'short',year:'numeric'})}))}</span><button class="text-button" data-action="edit-note" data-id="${esc(note.id)}">${esc(t('editNote'))}</button></div></article>`;}).join('')}</div>`;
  }
  function renderNotes() { return pageHeader(t('notes'),t('notesSubtitle'),btn('add-note','addNote'))+(state.notes.length?notesCards([...state.notes].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))):empty('noNotes','add-note','addNote')); }
  function renderSearch() {
    const needle=searchQuery.toLocaleLowerCase();
    const tasks=state.tasks.filter(task=>[task.title,task.project,task.owner,task.nextAction,task.note,task.sourceText].some(text=>text.toLocaleLowerCase().includes(needle)));
    const notes=state.notes.filter(note=>[note.title,note.body,taskById(note.taskId)?.title||''].some(text=>text.toLocaleLowerCase().includes(needle)));
    let html=pageHeader(t('searchResults'),t('searchFor',{query:searchQuery}));
    if(!tasks.length&&!notes.length) return html+empty('noSearch');
    if(tasks.length) html+=`<section><div class="section-heading"><h2>${esc(t('tasksFound',{count:fmtNumber(tasks.length)}))}</h2></div>${taskRows(sortTasks(tasks))}</section>`;
    if(notes.length) html+=`<section class="section"><div class="section-heading"><h2>${esc(t('notesFound',{count:fmtNumber(notes.length)}))}</h2></div>${notesCards(notes)}</section>`;
    return html;
  }
  function render() { renderShell(); $('#main').innerHTML=searchQuery?renderSearch():({today:renderToday,all:renderAll,week:renderWeek,month:renderMonth,projects:renderProjects,notes:renderNotes}[view])(); }

  function dialogHeader(id,title,subtitle='') { return `<div class="dialog-header"><div><h2 id="${id}">${esc(t(title))}</h2>${subtitle?`<p>${esc(t(subtitle))}</p>`:''}</div><div class="toolbar-actions"><button type="button" class="utility-button" data-action="switch-language" aria-label="${state.settings.language==='th'?'Switch interface to English':'เปลี่ยนภาษาหน้าจอเป็นไทย'}">${state.settings.language==='th'?'EN':'ไทย'}</button><button type="button" class="icon-button" data-action="close-dialog" aria-label="${esc(t('close'))}">${icon('close')}</button></div></div>`; }
  function showDialog(id) { const dialog=$(id); if(!dialog.open) dialog.showModal(); }
  function closeDialog(dialog) { if(dialog?.open) dialog.close(); }
  function field(name,label,value='',placeholder='',type='text',max=500,full=false) { return `<label class="field ${full?'full':''}"><span>${esc(t(label))}</span><input name="${name}" id="task-${name}" type="${type}" value="${esc(value)}" ${placeholder?`placeholder="${esc(t(placeholder))}"`:''} ${type==='text'?`maxlength="${max}"`:''}></label>`; }
  function options(values,selected) { return values.map(value=>`<option value="${value}" ${value===selected?'selected':''}>${esc(t(value||'unset'))}</option>`).join(''); }
  function readTaskDraft() { const form=$('#task-form'); if(!form)return null; return {id:form.dataset.id,...Object.fromEntries(new FormData(form))}; }
  function renderTaskForm(task) {
    const exists=!!taskById(task.id), linked=state.notes.filter(note=>note.taskId===task.id);
    $('#task-dialog').innerHTML=dialogHeader('task-dialog-title',exists?'editTask':'addTask')+`<form class="dialog-body" id="task-form" data-id="${esc(task.id)}" novalidate><div class="form-grid">${field('title','title',task.title,'titlePlaceholder','text',500,true)}${field('project','project',task.project,'projectPlaceholder','text',200)}${field('owner','owner',task.owner,'ownerPlaceholder','text',200)}${field('nextAction','nextAction',task.nextAction,'nextPlaceholder','text',4000,true)}<label class="field"><span>${esc(t('date'))}</span><input type="date" name="date" id="task-date" value="${esc(task.date)}" min="1000-01-01" max="9999-12-31"><span class="field-hint">${esc(t('dateHelp'))}</span></label><label class="field"><span>${esc(t('priority'))}</span><select name="priority" id="task-priority">${options(['','high','medium','low'],task.priority)}</select></label><label class="field full"><span>${esc(t('status'))}</span><select name="status" id="task-status">${options(['todo','doing','waiting','done'],task.status)}</select></label><label class="field full"><span>${esc(t('taskNote'))}</span><textarea name="note" id="task-note" rows="3" maxlength="50000" placeholder="${esc(t('taskNotePlaceholder'))}">${esc(task.note)}</textarea></label></div>${task.sourceText?`<details class="source-details"><summary>${esc(t('sourceText'))}</summary><pre>${esc(task.sourceText)}</pre></details>`:''}${exists?`<div class="source-details"><p>${esc(t('linkedNotes'))}</p>${linked.length?linked.map(note=>`<button type="button" class="text-button note-link" data-action="edit-note" data-id="${esc(note.id)}">${esc(note.title)}</button>`).join(''):`<p>${esc(t('noLinkedNotes'))}</p>`}<button type="button" class="text-button" data-action="add-linked-note" data-id="${esc(task.id)}">+ ${esc(t('addNote'))}</button></div>`:''}<p class="form-error" id="task-error" role="alert">${taskFormError?esc(t(taskFormError)):''}</p><div class="dialog-footer">${exists?`<button type="button" class="button" data-action="form-complete" data-id="${esc(task.id)}">${esc(t(task.status==='done'?'reopen':'complete'))}</button><span class="spacer"></span>`:''}<button type="button" class="button" data-action="close-dialog">${esc(t('cancel'))}</button><button type="submit" class="button primary" id="save-task">${esc(t('save'))}</button></div></form>`;
  }
  function openTask(id='') { taskFormError=''; const task=taskById(id)||newTask(); renderTaskForm(task); showDialog('#task-dialog'); $('#task-title').focus(); }
  function saveTaskForm(statusOverride) {
    const draft=readTaskDraft(), original=taskById(draft.id)||newTask('',{id:draft.id});
    const task={...original,...draft,title:draft.title.trim(),project:draft.project.trim(),owner:draft.owner.trim(),updatedAt:new Date().toISOString()};
    if(statusOverride)task.status=statusOverride;
    let error=!task.title?'fieldRequired':!validDate(task.date)||$('#task-date').validity.badInput?'invalidDate':!taskValid(task)?'invalidRecord':'';
    if(error){taskFormError=error;$('#task-error').textContent=t(error);if(!task.title)$('#task-title').focus();return false;}
    const next=clone(state), index=next.tasks.findIndex(item=>item.id===task.id);
    if(index<0)next.tasks.push(task);else next.tasks[index]=task;
    if(!['todo','doing'].includes(task.status))next.focusIds=next.focusIds.filter(id=>id!==task.id);
    if(commit(next,'taskSaved')){closeDialog($('#task-dialog'));return true;}return false;
  }
  function renderNoteForm(note) {
    $('#note-dialog').innerHTML=dialogHeader('note-dialog-title',state.notes.some(item=>item.id===note.id)?'editNote':'addNote')+`<form class="dialog-body" id="note-form" data-id="${esc(note.id)}" novalidate><div class="form-grid"><label class="field full"><span>${esc(t('noteTitle'))}</span><input name="title" id="note-title" maxlength="500" value="${esc(note.title)}" placeholder="${esc(t('noteTitlePlaceholder'))}"></label><label class="field full"><span>${esc(t('noteBody'))}</span><textarea name="body" id="note-body" maxlength="100000" rows="7" placeholder="${esc(t('noteBodyPlaceholder'))}">${esc(note.body)}</textarea></label><label class="field full"><span>${esc(t('linkedTask'))}</span><select name="taskId" id="note-task"><option value="">${esc(t('noLink'))}</option>${state.tasks.map(task=>`<option value="${esc(task.id)}" ${task.id===note.taskId?'selected':''}>${esc(task.title)}</option>`).join('')}</select></label></div><p class="form-error" id="note-error" role="alert">${noteFormError?esc(t(noteFormError)):''}</p><div class="dialog-footer"><button type="button" class="button" data-action="close-dialog">${esc(t('cancel'))}</button><button type="submit" class="button primary" id="save-note">${esc(t('save'))}</button></div></form>`;
  }
  function openNote(id='',taskId='') { noteFormError='';const now=new Date().toISOString();renderNoteForm(state.notes.find(note=>note.id===id)||{id:uid(),title:'',body:'',taskId,createdAt:now,updatedAt:now});showDialog('#note-dialog');$('#note-title').focus(); }
  function saveNoteForm() {
    const form=$('#note-form'), draft=Object.fromEntries(new FormData(form)), now=new Date().toISOString(), original=state.notes.find(note=>note.id===form.dataset.id);
    const note={id:form.dataset.id,...draft,title:draft.title.trim(),createdAt:original?.createdAt||now,updatedAt:now};
    const error=!note.title?'noteRequired':!noteValid(note)?'invalidRecord':note.taskId&&!taskById(note.taskId)?'invalidLink':'';
    if(error){noteFormError=error;$('#note-error').textContent=t(error);if(!note.title)$('#note-title').focus();return;}
    const next=clone(state), index=next.notes.findIndex(item=>item.id===note.id);if(index<0)next.notes.push(note);else next.notes[index]=note;
    if(commit(next,'noteSaved'))closeDialog($('#note-dialog'));
  }
  function renderListDialog() {
    $('#list-import-dialog').innerHTML=dialogHeader('list-dialog-title','listTitle','listSubtitle')+`<div class="dialog-body"><label class="field"><span>${esc(t('listLabel'))}</span><textarea id="todo-input" rows="8" placeholder="${esc(t('listPlaceholder'))}">${esc(listRaw)}</textarea><span class="field-hint">${esc(t('listHelp'))}</span></label><p class="form-error" id="list-error" role="alert">${listError?esc(t(listError)):''}</p><div id="list-preview">${listPreview?`<p class="preview-heading">${esc(t('listPreview',{count:fmtNumber(listPreview.items.length)}))}</p><ol class="preview-list">${listPreview.items.map(item=>`<li>${esc(item.title)} <span class="pill">${esc(t(item.status))}</span></li>`).join('')}</ol><p class="preview-caption">${esc(t('listPreserve'))}</p>`:''}</div><div class="dialog-footer"><button class="button" data-action="close-dialog">${esc(t('cancel'))}</button><button class="button ${listPreview?'':'primary'}" data-action="preview-list" id="preview-list">${esc(t('preview'))}</button>${listPreview?`<button class="button primary" data-action="apply-list" id="apply-list-import">${esc(t('applyList',{count:fmtNumber(listPreview.items.length)}))}</button>`:''}</div></div>`;
  }
  function previewList() {listRaw=$('#todo-input').value;const parsed=parseTaskList(listRaw);listError=parsed.ok?'':parsed.error;listPreview=parsed.ok?{...parsed,raw:listRaw}:null;renderListDialog();if(listPreview)$('#apply-list-import').focus();else $('#todo-input').focus();}
  function applyList() {
    if(!listPreview||$('#todo-input').value!==listPreview.raw){listError='listChanged';listPreview=null;listRaw=$('#todo-input').value;renderListDialog();return;}
    const next=clone(state);next.tasks.push(...listPreview.items.map(item=>newTask(item.title,{status:item.status,sourceText:item.sourceText})));
    if(commit(next,'importedTasks',{count:fmtNumber(listPreview.items.length)})){closeDialog($('#list-import-dialog'));listRaw='';listPreview=null;listError='';}
  }
  function renderDataDialog() {
    $('#data-dialog').innerHTML=dialogHeader('data-dialog-title','backupTitle','backupSubtitle')+`<div class="dialog-body"><section class="backup-section"><h3>${esc(t('exportTitle'))}</h3><p>${esc(t('exportHelp'))}</p>${btn('export','exportJson','primary')}</section><section class="backup-section"><h3>${esc(t('importTitle'))}</h3><p>${esc(t('importHelp'))}</p><button class="button" data-action="choose-backup-file">${esc(t('chooseFile'))}</button><input id="backup-file" type="file" accept=".json,application/json" hidden><p class="form-error" id="backup-error" role="alert">${backupError?esc(t(backupError)):''}</p></section><section class="backup-section"><h3>${esc(t('privacyTitle'))}</h3><p>${esc(t('privacyBody'))}</p></section></div>`;
  }
  async function readBackupFile(file) {
    if(!file)return;
    const fail=key=>{backupError=key;const target=$('#backup-error');if(target)target.textContent=t(key);};
    if(file.size>MAX_BYTES){fail('fileTooLarge');return;}
    let raw;try{raw=await file.text();}catch{fail('cannotReadFile');return;}
    const check=validateBackup(raw);if(!check.ok){fail(check.error);return;}
    const merged=mergeBackup(state,check.data);if(!merged.ok){fail(merged.error);return;}
    backupPreview={imported:check.data,merged};backupError='';renderBackupPreview();showDialog('#backup-import-dialog');
  }
  function renderBackupPreview() {
    if(!backupPreview)return;
    const counts=backupPreview.merged.counts;
    $('#backup-import-dialog').innerHTML=dialogHeader('backup-dialog-title','backupPreview','backupPreviewHelp')+`<div class="dialog-body"><table class="summary-table"><tbody>${['newTasks','newNotes','conflicts','unchanged'].map(key=>`<tr><td>${esc(t(key))}</td><td>${fmtNumber(counts[key])}</td></tr>`).join('')}<tr><td>${esc(t('importFocus'))}</td><td>${fmtNumber(backupPreview.merged.data.focusIds.length)} / 3</td></tr></tbody></table><p class="dialog-warning">${esc(t('mergePolicy'))}</p><div class="dialog-footer"><button class="button" data-action="close-dialog">${esc(t('cancel'))}</button><button class="button primary" data-action="confirm-backup" id="confirm-backup-import">${esc(t('confirmImport'))}</button></div></div>`;
  }
  function confirmBackup() {
    if(!backupPreview)return;
    const merged=mergeBackup(state,backupPreview.imported);
    if(!merged.ok){showToast(merged.error);return;}
    if(commit(merged.data,'backupImported')){closeDialog($('#backup-import-dialog'));closeDialog($('#data-dialog'));backupPreview=null;}
  }
  function downloadFile(text,name,type='application/json') {
    try {const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);return true;}catch{showToast('cannotExport');return false;}
  }
  function exportBackup() {if(downloadFile(JSON.stringify(state,null,2),`workspace-backup-${isoToday()}.json`))showToast('backupExported');}
  function renderRecovery() {$('#recovery-dialog').innerHTML=dialogHeader('recovery-dialog-title','recoveryTitle')+`<div class="dialog-body"><p class="dialog-warning">${esc(t('recoveryBody'))}</p><div class="button-row">${btn('download-original','downloadOriginal')}</div><div class="dialog-footer"><button class="button" data-action="close-dialog">${esc(t('cancel'))}</button><button class="button primary" data-action="confirm-recovery">${esc(t('confirmRecovery'))}</button></div></div>`;}
  function switchLanguage() {
    const taskDraft=$('#task-dialog').open?readTaskDraft():null, taskOriginal=taskDraft?(taskById(taskDraft.id)||newTask('',{id:taskDraft.id})):null;
    const noteForm=$('#note-dialog').open?$('#note-form'):null, noteDraft=noteForm?{...(state.notes.find(note=>note.id===noteForm.dataset.id)||{}),id:noteForm.dataset.id,...Object.fromEntries(new FormData(noteForm))}:null;
    if($('#list-import-dialog').open)listRaw=$('#todo-input').value;
    state.settings.language=state.settings.language==='th'?'en':'th';saveState();render();
    if(taskDraft)renderTaskForm({...taskOriginal,...taskDraft});if(noteDraft)renderNoteForm(noteDraft);
    if($('#list-import-dialog').open)renderListDialog();if($('#data-dialog').open)renderDataDialog();if($('#backup-import-dialog').open)renderBackupPreview();if($('#recovery-dialog').open)renderRecovery();
    renderModalFeedback();
    [...document.querySelectorAll('dialog[open]')].at(-1)?.querySelector('[data-action="switch-language"]')?.focus();
  }
  function goTo(nextView) {view=nextView;searchQuery='';$('#global-search').value='';projectFilter=null;history.replaceState(null,'',`#${view}`);render();window.scrollTo({top:0,behavior:'instant'});}
  function toggleComplete(id) {const next=clone(state),task=next.tasks.find(item=>item.id===id);if(!task)return;task.status=task.status==='done'?'todo':'done';task.updatedAt=new Date().toISOString();if(task.status==='done')next.focusIds=next.focusIds.filter(item=>item!==id);commit(next,task.status==='done'?'taskCompleted':'taskReopened');}
  function toggleFocus(id) {const task=taskById(id);if(!task)return;if(!['todo','doing'].includes(task.status)){showToast('focusDone');return;}const next=clone(state),on=next.focusIds.includes(id);if(on)next.focusIds=next.focusIds.filter(item=>item!==id);else if(next.focusIds.length<3)next.focusIds.push(id);else{showToast('focusLimit');return;}commit(next,on?'focusRemoved':'focusAdded');}
  function loadExample() {
    const next=clone(state), tasks=[newTask('Write a short project brief',{project:'Sample project',nextAction:'List the questions the project should answer',note:'Fictional example for exploring the workspace.'}),newTask('Review the draft outline',{project:'Sample project',status:'waiting'}),newTask('Create a project folder',{project:'Sample project',status:'done'})];
    next.tasks.push(...tasks);const now=new Date().toISOString();next.notes.push({id:uid(),title:'Sample project notes',body:'Fictional example: capture decisions and useful context here.',taskId:tasks[0].id,createdAt:now,updatedAt:now});commit(next,'exampleAdded');
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.view){goTo(button.dataset.view);return;}
    if(button.dataset.filter){filter=button.dataset.filter;render();return;}
    if(button.dataset.day){selectedDay=button.dataset.day;render();return;}
    if(button.dataset.projectIndex!==undefined){projectFilter=[...new Set(state.tasks.map(task=>task.project))].sort((a,b)=>a.localeCompare(b,state.settings.language))[Number(button.dataset.projectIndex)];render();return;}
    const action=button.dataset.action,id=button.dataset.id;
    switch(action){
      case 'switch-language':switchLanguage();break;
      case 'close-dialog':closeDialog(button.closest('dialog'));break;
      case 'add-task':openTask();break;
      case 'edit-task':openTask(id);break;
      case 'toggle-complete':toggleComplete(id);break;
      case 'toggle-focus':toggleFocus(id);break;
      case 'form-complete':saveTaskForm($('#task-status').value==='done'?'todo':'done');break;
      case 'add-note':openNote();break;
      case 'edit-note':openNote(id);break;
      case 'add-linked-note':openNote('',id);break;
      case 'open-list':listError='';renderListDialog();showDialog('#list-import-dialog');$('#todo-input').focus();break;
      case 'preview-list':previewList();break;
      case 'apply-list':applyList();break;
      case 'load-example':loadExample();break;
      case 'go-all':goTo('all');break;
      case 'clear-filter':filter='everything';render();break;
      case 'all-projects':projectFilter=null;render();break;
      case 'previous-week':weekAnchor.setDate(weekAnchor.getDate()-7);render();break;
      case 'next-week':weekAnchor.setDate(weekAnchor.getDate()+7);render();break;
      case 'this-week':weekAnchor=new Date();render();break;
      case 'previous-month':monthAnchor=new Date(monthAnchor.getFullYear(),monthAnchor.getMonth()-1,1,12);selectedDay=dateKey(monthAnchor);render();break;
      case 'next-month':monthAnchor=new Date(monthAnchor.getFullYear(),monthAnchor.getMonth()+1,1,12);selectedDay=dateKey(monthAnchor);render();break;
      case 'this-month':monthAnchor=new Date();selectedDay=isoToday();render();break;
      case 'open-data':backupError='';renderDataDialog();showDialog('#data-dialog');break;
      case 'choose-backup-file':$('#backup-file').click();break;
      case 'export':exportBackup();break;
      case 'confirm-backup':confirmBackup();break;
      case 'download-original':if(originalRaw!==null&&downloadFile(originalRaw,`workspace-original-${isoToday()}.txt`,'text/plain'))showToast('originalDownloaded');break;
      case 'open-recovery':renderRecovery();showDialog('#recovery-dialog');break;
      case 'confirm-recovery':{storageBlocked=false;if(saveState()){originalRaw=null;closeDialog($('#recovery-dialog'));showToast('recovered');}else{storageBlocked=true;storageError='corruptStorage';renderStorage();}break;}
      case 'retry-save':{if(originalRaw===null)storageBlocked=false;if(saveState())showToast('retrySuccess');break;}
    }
  });
  $('#language-toggle').addEventListener('click',switchLanguage);
  $('#theme-toggle').addEventListener('click',()=>{state.settings.theme=state.settings.theme==='light'?'dark':'light';saveState();renderShell();});
  $('#add-task').addEventListener('click',()=>openTask());
  $('#global-search').addEventListener('input',event=>{searchQuery=event.target.value.trim();render();});
  document.addEventListener('input',event=>{if(event.target.id==='todo-input'){listRaw=event.target.value;if(listPreview&&listRaw!==listPreview.raw){listPreview=null;$('#list-preview').innerHTML='';$('#apply-list-import')?.remove();listError='listChanged';$('#list-error').textContent=t(listError);}}});
  document.addEventListener('change',event=>{if(event.target.id==='backup-file')void readBackupFile(event.target.files?.[0]);});
  document.addEventListener('submit',event=>{if(event.target.id==='task-form'){event.preventDefault();saveTaskForm();}if(event.target.id==='note-form'){event.preventDefault();saveNoteForm();}});
  window.addEventListener('hashchange',()=>{const target=location.hash.slice(1);if(['today','all','week','month','projects','notes'].includes(target))goTo(target);});
  let previousDay=isoToday();setInterval(()=>{const day=isoToday();if(day!==previousDay){previousDay=day;render();}},60000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){previousDay=isoToday();render();}});
  // Public, side-effect-free helpers for verification; getState returns a defensive copy.
  window.WorkspaceApp=Object.freeze({storageKey:STORAGE_KEY,getState:()=>clone(state),validateBackup,mergeBackup,parseTaskList,validDate});
  render();
})();

