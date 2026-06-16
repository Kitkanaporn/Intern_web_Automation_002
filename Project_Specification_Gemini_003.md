# Project Specification: AI-Assisted SDLC Workflow Automation Platform
**Model Reference:** Gemini 003 (Official Mockup)

## 1. ภาพรวมและวัตถุประสงค์ (Project Overview & Objectives)
ระบบนี้ถูกพัฒนาขึ้นเพื่อเพิ่มประสิทธิภาพในการบริหารจัดการวงจรการพัฒนาซอฟต์แวร์ (SDLC) ภายในองค์กร TSD/SET โดยการนำ AI มาช่วยในการวิเคราะห์ความต้องการ (Requirement Analysis) และลดขั้นตอนการสร้าง Task ใน Jira ด้วยมือ โดยมีวัตถุประสงค์หลักดังนี้:
*   **Automation:** ลดความผิดพลาดและเวลาที่ใช้ในการแตก Sub-tasks จากความต้องการที่ซับซ้อน
*   **Standardization:** สร้างมาตรฐานการกระจายงานให้เป็นไปตามแนวทางของ TSD (BA -> Dev -> QA -> Ops)
*   **Collaboration:** เพิ่มการสื่อสารที่ชัดเจนระหว่างผู้ปฏิบัติงาน (Staff) และผู้มีอำนาจตัดสินใจ (Approver)

---

## 2. บทบาทผู้ใช้งาน (User Roles)
ระบบรองรับการทำงานแยกตามบทบาท (Role-based Access Control) เพื่อความโปร่งใสในกระบวนการทำงาน:

| บทบาท | คำอธิบาย | ความสามารถในระบบ |
| :--- | :--- | :--- |
| **Staff (กัญญา น.)** | ผู้รับผิดชอบโครงการ/เจ้าหน้าที่ | กรอก Requirement, ใช้ AI วิเคราะห์งาน, แก้ไขแผนงาน, ส่งขออนุมัติ |
| **Approver (สมชาย พ.)** | หัวหน้างาน/ผู้มีอำนาจอนุมัติ | สร้างงานใหม่ได้เอง, ตรวจสอบรายละเอียดงานเชิงลึก, อนุมัติ/ปฏิเสธ/ขอแก้ไข พร้อมระบุเหตุผล |

---

## 3. ฟีเจอร์หลักของระบบ (Core Features)

### 3.1 ระบบรับข้อมูลอัจฉริยะ (Requirement Intake)
*   **Dual-Channel:** รองรับการใส่ข้อมูลทั้งแบบพิมพ์ข้อความโดยตรง และการอัปโหลดไฟล์เอกสาร (PDF, Word, Excel)
*   **AI Pre-processing:** ระบบจะแสดงสถานะการอ่านและวิเคราะห์ข้อมูลแบบ Real-time เพื่อให้ผู้ใช้ทราบว่า AI กำลังประมวลผลส่วนใด

### 3.2 AI Advisory Sidebar & Plan Builder
*   **Module-based Suggestion:** AI แนะนำโครงสร้างงานแยกเป็น Main Task และ Sub-tasks ตามมาตรฐาน SDLC
*   **Selectable Tasks:** ผู้ใช้ไม่จำเป็นต้องเชื่อ AI ทั้งหมด แต่สามารถเลือกเฉพาะ Task ที่ต้องการด้วยปุ่ม "+" หรือ "Add All"
*   **Manual Override:** ทุกฟิลด์ในตารางแผนงาน (ชื่อโครงการ, แผนก, ผู้รับผิดชอบ, ความสำคัญ, วันกำหนดส่ง) สามารถแก้ไขได้ด้วยมือทั้งหมด

### 3.3 ระบบอนุมัติและการตรวจสอบ (Detailed Approval Queue)
*   **Block-style Review:** แสดงแผนงานแยกเป็นบล็อกชัดเจนตาม Main Task เพื่อให้ง่ายต่อการตรวจทาน
*   **Full Detail Visibility:** ผู้ตรวจสอบสามารถเห็นรายละเอียดทุกอย่าง (Dept, Assignee, Priority, Due Date) ของงานย่อยทั้งหมด
*   **Feedback Loop:** รองรับการใส่ "เหตุผล" (Comment) เมื่อมีการปฏิเสธ (Reject) หรือขอให้แก้ไข (Request Changes)

### 3.4 ระบบแจ้งเตือน (Cross-role Notification)
*   **Real-time Alerts:** แจ้งเตือนทันทีเมื่อมีความเคลื่อนไหว เช่น "มีงานใหม่รออนุมัติ" หรือ "แผนงานของคุณถูกอนุมัติแล้ว"
*   **Persistence:** ระบบบันทึกประวัติการแจ้งเตือนไว้เพื่อให้ติดตามย้อนหลังได้

---

## 4. ขั้นตอนการทำงาน (System Workflow)

1.  **Start:** ผู้ใช้ (Staff หรือ Approver) เข้าสู่ระบบและระบุความต้องการผ่านหน้า New Request
2.  **Analyze:** กด "Save & Analyze" เพื่อให้ AI ช่วยแตกรายการงานย่อย
3.  **Refine:** ผู้ใช้ออกแบบแผนงานสุดท้ายโดยการเลือกคำแนะนำจาก AI หรือเพิ่มงานเองแบบ Manual
4.  **Submit:** ส่งแผนงานเข้าสู่ "Approval Queue" (ระบบจะแจ้งเตือน Approver ทันที)
5.  **Review:** Approver ตรวจสอบรายละเอียดงานทั้งหมดในหน้า Approval Queue
6.  **Action:**
    *   ถ้า **Approve:** ระบบจะจำลองการสร้าง 12 Jira Tasks และแจ้งเตือนผลสำเร็จไปยัง Staff
    *   ถ้า **Reject/Request Changes:** ระบบจะส่งแจ้งเตือนกลับไปยัง Staff พร้อมเหตุผลที่ระบุไว้
7.  **Complete:** งานที่ได้รับการอนุมัติจะถูกสร้างเป็น Ticket ในระบบ Jira พร้อมตั้งค่า Dependency ระหว่าง Phase อัตโนมัติ

---

## 5. เทคโนโลยีและการแสดงผล (Technical UI Standards)
*   **UI Framework:** HTML5/Vanilla CSS (เน้นความคล่องตัวและโหลดเร็ว)
*   **Visual Style:** TSD Internal Palette (SET Blue), Block-based layout สำหรับความชัดเจนของข้อมูล
*   **Persistence:** ใช้ `localStorage` ในการบันทึกสถานะงานและการแจ้งเตือน เพื่อจำลองการทำงานจริงในรูปแบบ Mockup

---
*จัดทำโดย Gemini CLI เพื่อใช้เป็นเอกสารประกอบการพัฒนาโปรเจค SDLC Workflow Automation*
