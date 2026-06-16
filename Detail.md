# Project : AI-Assisted SDLC Workflow Automation Platform

## ความต้องการ (requirement)

จากการได้ฟังถึงระบบการทำงานคร่าวนั้น จะเห็นว่าระบบการทำงานเป็นดังนี้

**start**   ->  รับ requirement จาก client ผ่านทาง Confluence 
                                    |
                                    V
                ทำการวิเคราะห์ requirement และกระจจายออกมาเป็น 
                sub-task เพื่อจ่ายงาน ส่งไปเพื่อให้ตรวจทาน และทำการ approve
                                    |
                                _notification_
                                    v
                        ตรวจทานและทำการ approve งานที่ได้รับมา
                                    |
                                _notification_
                                    v
                            แต่ละแผนกได้รับงาน

ถือเป็นการจบเรื่องการ Assign โดยงานที่ Assign ไปทั้งหมดนั้นจะแสดงผ่าน **JIRA** จากนั้นอาจจะมีการทำงานแบบ real-time ที่หากมีการเปลี่ยนแปลงของ status นั้นจะมีการแจ้งงเตือนไปยัง งานที่ต้องทำถัดไป