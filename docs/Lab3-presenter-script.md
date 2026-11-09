# Lab 3 · Agent Memory: presenter script

Exported 2026-11-09 from the script manager (the current text, including colleagues' edits). 18 pages in show order, English then Thai. Key words are **bold**, names are `code`, and a line starting with **>** says what each Next shows.

## 0 · Open Lab 3  (`3.0g`)

### English

Lab 3 runs in the same environment as Lab 2. If you closed it, open it again with this address. It is the one called "AI Labs 1 and 2" on LiveLabs.

### ไทย

Lab 3 ใช้สภาพแวดล้อมเดียวกับ Lab 2 ครับ ถ้าปิดไปแล้ว ให้เปิดใหม่ด้วยลิงก์บนหน้าจอ หรือสแกน QR ได้เลย

---

## 1 · Back at the bridge  (`3.0`)

### English

We are back at Harbor Bridge, because the problem has not gone away: the rust is still there. Two inspectors will look at it on different days. Mercer comes first, Vance comes next. What should Vance know before he starts?

### ไทย

กลับมาที่ Harbor Bridge กันอีกครั้งครับ เพราะปัญหายังไม่หายไปไหน สนิมที่เสายังอยู่ตรงนี้เหมือนเดิม

คราวนี้มีผู้ตรวจสอบสองคนที่จะมาดูจุดเดียวกันนี้ คนละวัน Mercer ไปก่อน แล้ว Vance ตามมาทีหลัง

คำถามของ Lab นี้มีข้อเดียวครับ: ตอน Vance มาถึง เขาต้องเริ่มต้นจากศูนย์ หรือจะรู้ทันทีว่า Mercer เจออะไรไว้แล้ว และ AI agent จะเป็นคนส่งต่อเรื่องนี้ให้เขาได้อย่างไร

---

## 2 · Why the first one forgot  (`3.2f`) · builds in 4 clicks

### English

**Why did the first AI agent have nothing for Vance?** Go back to **Day 1**.

Mercer tells the AI agent: *corrosion on the bearing assemblies, about 25 percent section loss, repair within 60 days.*

> **Next ×3**: one message arrives at a time, and the AI agent writes each line in its notebook.

It writes everything in its **visit notebook**, the same notebook as this afternoon. That is **short-term memory**: only this visit's scribbles.

> **Next**: the chat closes.

Then the chat closes and Mercer goes home. **The visit is over, so the notebook is cleared.** Nothing she said is kept.

### ไทย

**ทำไม AI agent ตัวแรกถึงไม่มีอะไรให้ Vance เลย?** ลองย้อนไปดู **วันที่ 1** ครับ

Mercer เล่าให้ AI agent ฟัง: *เจอการกัดกร่อนที่แผ่นรองรับ หน้าตัดเหล็กหายไปประมาณ 25 เปอร์เซ็นต์ แนะนำให้ซ่อมภายใน 60 วัน*

> **Next ×3**: ข้อความเข้ามาทีละเรื่อง และ AI agent จดแต่ละบรรทัดลงสมุด

AI agent จดทุกอย่างลงใน **visit notebook** สมุดเล่มเดียวกับที่เราเห็นเมื่อบ่ายนี้ นี่คือ **short-term memory**: รอยจดของการเยี่ยมครั้งนี้เท่านั้น

> **Next**: แชตปิดลง

จากนั้นแชตปิดลง และ Mercer กลับบ้าน **การเยี่ยมจบแล้ว สมุดจึงถูกล้างออก** ไม่มีสิ่งที่เธอพูดเหลืออยู่เลย

---

## 3 · Same question, two answers  (`3.1h`) · builds in 3 clicks

### English

**Day 2. Same question, same language model, two answers.**

Vance is back at the rust and asks: *"What happened at this rust?"*

> **Next**: the answer **without memory**.

The AI agent has **nothing**. *Every chat starts from zero.*

> **Next**: the answer **with memory**, still locked.

It also answered, but we keep that answer hidden for a moment. **What is different?**

> **Next**: the lock opens.

With memory it answers with **Mercer's finding** from yesterday: **corrosion**, **about 25 percent section loss**, grade C, repair within **60 days**.

**Same model. Same question. Only the memory differs.**

### ไทย

**วันที่ 2 คำถามเดียวกัน language model ตัวเดียวกัน แต่ได้คำตอบสองแบบ**

Vance กลับมาที่สนิมและถามว่า *"ที่นี่เกิดอะไรขึ้น?"*

> **Next**: คำตอบ **แบบไม่มี memory**

AI agent **ไม่มีอะไรเลย** *ทุกแชตเริ่มจากศูนย์*

> **Next**: คำตอบ **แบบมี memory** ที่ยังถูกล็อกอยู่

มันก็ตอบเหมือนกัน แต่เรายังซ่อนคำตอบนี้ไว้ก่อน **ต่างกันตรงไหน?**

> **Next**: เปิดล็อก

เมื่อมี memory มันตอบด้วย **ผลตรวจของ Mercer** จากเมื่อวาน: **การกัดกร่อน** **หน้าตัดหายไปประมาณ 25 เปอร์เซ็นต์** ระดับ C ควรซ่อมภายใน **60 วัน**

**โมเดลเดียวกัน คำถามเดียวกัน ต่างกันที่ memory อย่างเดียวครับ**

---

## 4 · Where it goes instead  (`3.3h`) · builds in 2 clicks

### English

The notes need somewhere that **survives the chat**. That is **long-term memory**: the **bridge logbook**, the same logbook as this afternoon.

- **permanent**: it stays
- found **by name** or **by meaning**

> **Next**: Mercer's notes go into the logbook. **Next**: the database.

In our case the logbook lives in **Oracle Autonomous AI Database 26ai**.

### ไทย

บันทึกต้องอยู่ในที่ที่ **รอดจากการปิดแชต** นั่นคือ **long-term memory**: **bridge logbook** สมุดบันทึกของสะพาน เล่มเดียวกับที่เราเห็นเมื่อบ่ายนี้

- **เก็บถาวร**: อยู่ต่อไป
- ค้นหาได้ **จากชื่อ** หรือ **จากความหมาย**

> **Next**: บันทึกของ Mercer เข้าสมุด **Next**: ฐานข้อมูล

ในกรณีของเรา สมุดเล่มนี้อยู่ใน **Oracle Autonomous AI Database 26ai** ครับ

---

## 5 · One report, three cards  (`3.3i`) · builds in 3 clicks

### English

**One report** from Mercer becomes **three kinds of memory**:

1. **What happened** (*episodic*): like last summer's trip
2. **What is true** (*semantic*): like what you learned at school
3. **How we work** (*procedural*): like riding a bike

> **Next ×3**: one card each time, together with the question that pulls it back.

Day 2: Vance asks three questions: *"What happened here?"*, *"How bad is it?"*, *"What do we do?"* Each question pulls back its **own card**.

**So Vance starts with the whole history, not from zero.**

### ไทย

**รายงานหนึ่งฉบับ** ของ Mercer กลายเป็น **ความจำสามชนิด**:

1. **สิ่งที่เกิดขึ้น** (*episodic*): เหมือนทริปเมื่อฤดูร้อนที่แล้ว
2. **สิ่งที่เป็นจริง** (*semantic*): เหมือนที่เราเรียนมาตอนเด็ก
3. **วิธีที่เราทำงาน** (*procedural*): เหมือนการปั่นจักรยาน

> **Next ×3**: ครั้งละหนึ่งการ์ด พร้อมคำถามที่ดึงมันกลับมา

วันที่ 2 Vance ถามสามคำถาม: *"เกิดอะไรขึ้น?"* *"แย่แค่ไหน?"* *"เราต้องทำอะไร?"* แต่ละคำถามดึง **การ์ดของตัวเอง** กลับมา

**Vance จึงเริ่มต้นพร้อมประวัติทั้งหมด ไม่ใช่เริ่มจากศูนย์**

---

## 6 · From the logbook to the glass  (`3.3p`) · builds in 3 clicks

### English

The notes are in the logbook, but the language model **cannot read the entire logbook**.

It reads **only what is in the glass**, this turn.

> **Next ×3**: a card drops into the glass each time.

**So what we pour in, on every turn, is what matters.**

### ไทย

บันทึกอยู่ในสมุดแล้ว แต่ language model **อ่านสมุดทั้งเล่มไม่ได้**

มันอ่านได้ **เฉพาะสิ่งที่อยู่ในแก้ว** ในรอบนี้เท่านั้น

> **Next ×3**: หย่อนการ์ดลงแก้วทีละใบ

**สิ่งที่เราเทลงไปในแต่ละรอบ คือสิ่งที่สำคัญ**

---

## 7 · The glass  (`3.3a`)

### English

The language model reads only what is in the glass, this turn. We fill it ourselves on every turn: the system prompt, the instructions, the tool list, the notes we retrieved, the chat so far and Vance’s question. It is a fixed size, and nothing outside it is seen: not Mercer’s closed chat, not the database, not yesterday.

### ไทย

language model อ่านได้เฉพาะสิ่งที่อยู่ใน “แก้ว” ในรอบนี้เท่านั้น

เราเป็นคนเติมแก้วนี้เองทุกรอบ เริ่มจาก system prompt คำสั่งของนักพัฒนา รายการเครื่องมือ บันทึกที่ดึงมา แชตที่ผ่านมา และสุดท้ายคือคำถามของ Vance

แก้วมีขนาดคงที่ และสิ่งที่อยู่นอกแก้ว โมเดลมองไม่เห็นเลย ไม่ว่าจะเป็นแชตที่ปิดของ Mercer ฐานข้อมูล หรือเมื่อวาน

---

## 8 · Four things go wrong  (`3.3b`) · builds in 3 clicks

### English

Filling it, four things go wrong. Volume: every tool result piles in, and by turn 15 it overflows. Relevance: thirty search results crowd in, and Mercer’s finding spills out. Accuracy: a summary squeezes her finding down to rust on the pier, and the 25 percent falls out. Timing: her finding came in at turn 1, and by turn 15, when Vance asks, it is gone.

### ไทย

เวลาเติมแก้ว มีสี่อย่างที่ผิดพลาดได้ เราจะดูทีละอย่าง กด Next เพื่อเปิดแก้วถัดไป

อย่างแรกคือ ปริมาณ ผลลัพธ์จากเครื่องมือกองเข้ามาในแก้วทั้งหมด พอถึงรอบที่ 15 ก็ล้น เรียกเครื่องมืออีกครั้งเดียว ระบบก็พัง

อย่างที่สองคือ ความเกี่ยวข้อง ผลค้นหาสามสิบรายการเบียดกันเข้ามา มากกว่าที่แก้วจุได้ แล้วล้นข้างแก้ว ผลตรวจของ Mercer ซึ่งเป็นชิ้นสีเขียว teal หล่นออกไปด้วย เพราะข้อมูลส่วนใหญ่ที่เข้ามา Vance ไม่ได้ขอเลย

อย่างที่สามคือ ความถูกต้อง เพื่อประหยัดที่ ระบบสรุปบันทึก การสรุปบีบผลตรวจของ Mercer เหลือแค่ “มีสนิมที่เสา” ตัวเลข 25 เปอร์เซ็นต์หลุดหายไป และรายละเอียดที่สำคัญที่สุดก็หายไปด้วย

อย่างที่สี่คือ จังหวะเวลา เป็นข้อที่เข้าใจยากที่สุด ผลตรวจของ Mercer ถูกโหลดเข้ามาตั้งแต่รอบที่ 1 จากนั้นแต่ละรอบก็กองทับเข้ามา พอถึงรอบที่ 15 ตอนที่ Vance ถามจริง ๆ มันถูกดันออกไปแล้ว เหลือที่ว่างตรงที่ควรมีผลตรวจ ข้อมูลถูกต้อง แต่มาผิดจังหวะ: ถูกโหลดครั้งเดียวตอนเริ่ม และไม่มีใครดึงมาใหม่ตอนที่เขาถาม

---

## 9 · Now the code  (`3.5h`) · builds in 4 clicks

### English

**Three things to watch** as we run the notebook, marked on the map:

1. **What to keep**: small records and the signed finding. Parts 3 and 4, `CITY_MEMORY` and `CITY_INSPECTION_FINDING`
2. **What to bring in**: only what this question needs. Part 6, the prompt
3. **What to do every turn**: read, think, act, save. Part 6 and the two days, `call_copilot`

> **Next ×3**: one job at a time, marked on the map.

Parts 1 and 2, **the database and the embedder**, sit underneath.

**Now we open the notebook and walk this map.**

### ไทย

**มีสามเรื่องที่ต้องดู** ตอนเรารัน notebook โดยมีเครื่องหมายบนแผนที่:

1. **เก็บอะไรไว้**: บันทึกชิ้นเล็ก ๆ และผลตรวจที่ลงนามแล้ว Part 3 และ 4 คือ `CITY_MEMORY` และ `CITY_INSPECTION_FINDING`
2. **ดึงอะไรเข้ามา**: เฉพาะสิ่งที่คำถามนี้ต้องการ Part 6 คือ prompt
3. **ทำอะไรในทุกรอบ**: อ่าน คิด ลงมือ บันทึก Part 6 และสองวัน คือ `call_copilot`

> **Next ×3**: ทีละเรื่อง โดยมีเครื่องหมายบนแผนที่

Part 1 และ 2 คือ **ฐานข้อมูลและ embedder** ที่อยู่ข้างใต้

**ตอนนี้เราเปิด notebook แล้วเดินตามแผนที่นี้ครับ**

---

## 10 · Open the lab to code  (`3.5g`)

### English

**That was the story. Now we run it.**

1. Open your lab environment: the **same one as Lab 2**, with the address or the code on the screen
2. On LiveLabs it is called **AI Labs 1 and 2**
3. Then we open the notebook `notebook_complete_ollama.ipynb` and watch each part happen

### ไทย

**นั่นคือเรื่องราวทั้งหมดครับ ต่อไปเราจะรันมันจริง**

1. เปิดสภาพแวดล้อมของ lab: **อันเดียวกับ Lab 2** ด้วยลิงก์หรือ QR บนหน้าจอ
2. บน LiveLabs ชื่อว่า **AI Labs 1 and 2**
3. จากนั้นเราเปิด notebook `notebook_complete_ollama.ipynb` และดูแต่ละส่วนทำงาน

---

## 11 · The code, on one map  (`3.6m`) · builds in 18 clicks

### English

This one map is everything in today’s notebook. One turn of the AI agent runs along the top, and everything it remembers sits in one database underneath. We walk it in the order the code runs.

First, open the notebook. In the file list, open agent_memory and double-click notebook_complete_ollama.ipynb. Each box is a cell: click inside one to select it, then click Run or press Shift and Enter.

Parts 1 and 2. The AI agent needs one connection: the database, which holds its memory, the findings and the embedding model. Two models, two jobs: the embedding model finds what is similar, and it runs inside Oracle Database. The language model, on Ollama, extracts memories and writes the answers.

When an inspector reports, two things happen. The whole report is filed word for word in CITY_MESSAGE. And the extractor pulls out what is worth keeping as small memory cards in CITY_MEMORY: a fact, a guideline. One message gives three memories. The agent does not store what you said. It stores what it learned.

Now search those memories. With no user id, the search comes back empty: zero memories.

Give it the right key, user_id inspector_demo, and the memories light up. Records inherit the scope of the thread that wrote them.

Next to memory sits the system of record: fifteen official findings, each with a category, a severity, a grade, a recommendation and an embedding. Mercer logs one on purpose: corrosion, medium, grade C, repair within 60 days. Memory is what the agent learns. Findings are what the city records.

To find the right findings we search by meaning, and the five nearest light up. Then two walls: only Harbor Bridge, only corrosion. Broad five, asset five, category four. Vector similarity and relational filters in one SQL statement.

Three keys decide who sees what: the user, the agent and the thread. Mercer keeps a private note behind her own door: swap shifts Tuesday. Her guideline for Harbor Bridge goes in the shared hall. When Vance searches, he bounces off her door and finds the guideline in the hall: none of her private memories, one shared. This is a SQL WHERE clause, not a Python filter.

Here is one AI agent turn, step by step: open Vance’s own thread, read the bridge’s record, build the context card, find similar findings, search the shared memory, ask the language model, save both messages, and extract new memories.

And this is the context card it builds: a summary, the topics, the relevant information and the recent messages. This is the prompt the model actually receives.

Day 1. Mercer is at the rust: about 25 percent section loss at the bearing plate edges. Her advice: repair within 60 days. The AI agent logs it as a finding for Harbor Bridge.

Two things are saved. The official finding goes into the findings table: corrosion, medium, grade C, repair within 60 days. Her guideline goes to shared memory for Harbor Bridge. The chat itself stays private. This is what the next inspector inherits.

Day 2. Vance comes to the same rust and asks the same question as before: what happened at this pier? Before answering, the AI agent looks it up: a search over the findings finds Mercer’s, and shared memory holds her guideline. Her private chat is never searched.

This time the AI agent knows. Mercer logged corrosion here on Day 1: about 25 percent, grade C, repair within 60 days, with both sources. No human handoff. The finding and the memory carried it.

### ไทย

แผนที่นี้คือทุกอย่างใน notebook ของวันนี้ครับ ด้านบนคือการทำงานหนึ่งรอบของ AI agent ด้านล่างคือฐานข้อมูลเดียวที่เก็บทุกอย่างที่มันจำได้ เราจะเดินตามแผนที่นี้ทีละขั้น ตามลำดับที่โค้ดทำงานจริง

ก่อนอื่นเปิด notebook กันก่อนครับ ในรายการไฟล์ เปิดโฟลเดอร์ agent_memory แล้วดับเบิลคลิก notebook_complete_ollama.ipynb แต่ละกล่องคือหนึ่ง cell คลิกในกล่องเพื่อเลือก แล้วกดปุ่ม Run หรือกด Shift + Enter

ส่วนที่ 1 และ 2 AI agent ต้องการการเชื่อมต่อเดียวคือเข้าฐานข้อมูล ซึ่งเก็บทั้งความจำ ผลตรวจ และ embedding model

มีสองโมเดล สองหน้าที่ embedding model หาสิ่งที่คล้ายกัน และทำงานอยู่ภายใน Oracle Database ส่วน language model ซึ่งรันบน Ollama ทำหน้าที่สกัดความจำและเขียนคำตอบ

เมื่อผู้ตรวจสอบรายงาน จะเกิดสองอย่าง

รายงานทั้งฉบับถูกเก็บคำต่อคำใน CITY_MESSAGE

และตัวสกัด (extractor) ดึงสิ่งที่ควรเก็บออกมาเป็นการ์ดความจำเล็ก ๆ ใน CITY_MEMORY เช่น fact และ guideline ข้อความเดียวให้ความจำได้สามอัน

agent ไม่ได้เก็บสิ่งที่คุณพูด แต่เก็บสิ่งที่มันเรียนรู้

ตอนนี้ลองค้นความจำเหล่านั้น ถ้าไม่ใส่ user id ผลค้นจะว่างเปล่า ได้ศูนย์รายการ

พอใส่กุญแจที่ถูกต้อง คือ user_id เป็น inspector_demo ความจำก็ปรากฏขึ้น

เรคคอร์ดสืบทอด scope มาจากเธรดที่เขียนมัน

ข้าง ๆ ความจำมี system of record คือผลตรวจอย่างเป็นทางการสิบห้ารายการ แต่ละรายการมีหมวด ความรุนแรง เกรด ข้อเสนอแนะ และ embedding

Mercer บันทึกหนึ่งรายการโดยตั้งใจ: การกัดกร่อน ระดับปานกลาง เกรด C ซ่อมภายใน 60 วัน

ความจำคือสิ่งที่ agent เรียนรู้ ส่วนผลตรวจคือสิ่งที่เมืองบันทึกไว้

เพื่อหาผลตรวจที่ใช่ เราค้นด้วยความหมาย แล้วห้ารายการที่ใกล้ที่สุดก็สว่างขึ้น

จากนั้นใส่สองกำแพง: เฉพาะ Harbor Bridge และเฉพาะการกัดกร่อน กว้างห้ารายการ ตามสินทรัพย์ห้ารายการ ตามหมวดสี่รายการ

ความคล้ายเชิง vector และตัวกรองเชิงสัมพันธ์ ในคำสั่ง SQL เดียว

กุญแจสามดอกกำหนดว่าใครเห็นอะไร: ผู้ใช้ agent และเธรด

Mercer เก็บบันทึกส่วนตัวไว้หลังประตูของเธอ: สลับกะวันอังคาร ส่วนแนวทางของ Harbor Bridge วางไว้ในห้องโถงกลาง

เมื่อ Vance ค้น เขาชนประตูของเธอ แต่เจอแนวทางในห้องโถง: ไม่มีความจำส่วนตัวของเธอเลย มีหนึ่งรายการที่แบ่งกัน

นี่คือเงื่อนไข WHERE ใน SQL ไม่ใช่ตัวกรองใน Python

นี่คือหนึ่งรอบของ AI agent ทีละขั้น: เปิดเธรดของ Vance เอง อ่านเรคคอร์ดของสะพาน สร้าง context card หาผลตรวจที่คล้ายกัน ค้นความจำที่แบ่งกัน ถาม language model บันทึกทั้งสองข้อความ และสกัดความจำใหม่

และนี่คือ context card ที่มันสร้างขึ้น: สรุป หัวข้อ ข้อมูลที่เกี่ยวข้อง และข้อความล่าสุด นี่คือ prompt ที่โมเดลได้รับจริง ๆ

วันที่ 1 Mercer อยู่หน้างานตรงสนิม หน้าตัดหายไปประมาณ 25 เปอร์เซ็นต์ที่ขอบแผ่นรองรับ คำแนะนำของเธอคือซ่อมภายใน 60 วัน

AI agent บันทึกเป็นผลตรวจของ Harbor Bridge

มีสองอย่างที่ถูกบันทึก ผลตรวจอย่างเป็นทางการเข้าตารางผลตรวจ: การกัดกร่อน ระดับปานกลาง เกรด C ซ่อมภายใน 60 วัน

แนวทางของเธอไปอยู่ในความจำที่แบ่งกันของ Harbor Bridge ส่วนแชตยังเป็นส่วนตัว

นี่คือสิ่งที่ผู้ตรวจสอบคนถัดไปจะได้รับสืบทอด

วันที่ 2 Vance มาที่สนิมเดิมและถามคำถามเดิม: ที่เสานี้เกิดอะไรขึ้น

ก่อนตอบ AI agent ไปค้นก่อน: การค้นผลตรวจเจอของ Mercer และความจำที่แบ่งกันมีแนวทางของเธอ แชตส่วนตัวของเธอไม่เคยถูกค้น

คราวนี้ AI agent รู้แล้ว Mercer บันทึกการกัดกร่อนที่นี่ในวันที่ 1: ประมาณ 25 เปอร์เซ็นต์ เกรด C ซ่อมภายใน 60 วัน พร้อมแหล่งที่มาทั้งสอง

ไม่ต้องส่งต่อด้วยคน ผลตรวจและความจำส่งต่อให้เอง

---

## 12 · With and without memory  (`3.15`)

### English

Same question, asked twice. Without memory: no earlier information. With memory: Mercer’s finding, grade C, 60 days. It knows it is the same bridge, cites the real finding, gives a specific action, and never sees anyone’s private chats. Same model. Same question. Only the memory differs.

### ไทย

ถามคำถามเดียวกันสองครั้ง ไม่มีความจำ: ไม่มีข้อมูลก่อนหน้า มีความจำ: ผลตรวจของ Mercer เกรด C 60 วัน

มันรู้ว่าเป็นสะพานเดียวกัน อ้างผลตรวจจริง ให้การดำเนินการที่เจาะจง และไม่เคยเห็นแชตส่วนตัวของใครเลย

โมเดลเดียวกัน คำถามเดียวกัน ต่างกันที่ความจำเท่านั้น

---

## 13 · The four failures, solved  (`3.15f`) · builds in 4 clicks

### English

**Back to the glass.** Remember the four failures? Each one is now **solved by a Part of the notebook** we just ran.

> **Next ×4**: one glass at a time.

1. **Volume**: the extractor keeps *small records*. Part 3
2. **Relevance**: search with walls, so only *Mercer's finding* comes in. Part 4
3. **Accuracy**: the signed finding keeps the **25 percent** as a fact of its own. Part 4
4. **Timing**: her finding is **fetched again** when Vance asks. Part 6

### ไทย

**กลับมาที่แก้วครับ** จำสี่ปัญหาได้ไหม ตอนนี้แต่ละข้อ **ถูกแก้ด้วยส่วนหนึ่งของ notebook** ที่เราเพิ่งรัน

> **Next ×4**: ทีละแก้ว

1. **ปริมาณ**: extractor เก็บเป็น *บันทึกชิ้นเล็ก ๆ* Part 3
2. **ความเกี่ยวข้อง**: การค้นหาที่มีกำแพง เข้ามาเฉพาะ *ผลตรวจของ Mercer* Part 4
3. **ความถูกต้อง**: ผลตรวจที่ลงนามแล้วเก็บ **25 เปอร์เซ็นต์** ไว้เป็นข้อเท็จจริงของมันเอง Part 4
4. **จังหวะเวลา**: **ดึงผลตรวจกลับมาใหม่** ตอนที่ Vance ถาม Part 6

---

## 14 · What you built  (`3.15c`)

### English

And here is the full memory map. Short-term and long-term memory, the three kinds, and shared memory: most of it you built today with oracleagentmemory, in one database. Tools, workflows and caching are left to your agent framework.

### ไทย

และนี่คือแผนที่ความจำทั้งหมด: short-term และ long-term memory สามชนิด และความจำที่แบ่งกัน ส่วนใหญ่คุณสร้างวันนี้ด้วย oracleagentmemory ในฐานข้อมูลเดียว

เครื่องมือ workflow และ caching ปล่อยให้เป็นหน้าที่ของ agent framework ของคุณ

---

## 15 · Where both labs meet  (`3.16`) · builds in 3 clicks

### English

**And here both labs meet. Neither lab can make the call alone.**

The **rule alone**: *the limit is 25 percent*, but **what is this bridge's number?** It **cannot decide**.

> **Next**: the history alone.

The **history alone**: *Mercer found about 25 percent*, but **what is the limit?** It **cannot decide** either.

> **Next**: together.

**Together**: over 25 percent needs a review, and it is about 25 percent, so the AI agent can **decide**.

> **Next**: the call.

With Vance, it orders **an immediate structural review**. **Both labs are needed.**

### ไทย

**ตรงนี้คือจุดที่สอง Lab มาพบกัน และไม่มี Lab ไหนตัดสินใจได้เพียงลำพังครับ**

**กฎอย่างเดียว**: *ขีดจำกัดคือ 25 เปอร์เซ็นต์* แต่ **ตัวเลขของสะพานนี้คือเท่าไร?** ตัดสินใจไม่ได้

> **Next**: ประวัติอย่างเดียว

**ประวัติอย่างเดียว**: *Mercer พบประมาณ 25 เปอร์เซ็นต์* แต่ **ขีดจำกัดคือเท่าไร?** ก็ตัดสินใจไม่ได้เหมือนกัน

> **Next**: รวมกัน

**พอรวมกัน**: เกิน 25 เปอร์เซ็นต์ต้องตรวจสอบ และตัวเลขอยู่ที่ประมาณ 25 เปอร์เซ็นต์ AI agent จึง **ตัดสินใจได้**

> **Next**: การตัดสินใจ

ร่วมกับ Vance สั่ง **ตรวจโครงสร้างทันที** **ต้องมีทั้งสอง Lab ครับ**

---

## 16 · Lab 3 recap  (`3.17`)

### English

That is Lab 3: memory is **the foundation**, not a feature; the context window is **a curation problem**; and **one converged store** beats four services. Before the quiz, let us look at the whole day.

### ไทย

นั่นคือ Lab 3: ความจำคือรากฐาน ไม่ใช่ฟีเจอร์ context window คือปัญหาของการคัดสรร และที่เก็บเดียวที่รวมทุกอย่างดีกว่าสี่บริการ ก่อนทำควิซ มาดูภาพรวมของทั้งวัน

---

## 17 · Takeaways · all three labs  (`3.18`)

### English

Three labs, one bridge. In Lab 1 we built **an assistant**, in Lab 2 it became **an agent**, in Lab 3 it learned to **remember**. Under all three, **one Oracle AI Database**. Now scan the code for the quiz: five minutes, 80 percent to pass, and a badge.

### ไทย

สามแล็บ สะพานเดียว ใน Lab 1 เราสร้างผู้ช่วย ใน Lab 2 มันกลายเป็น agent ใน Lab 3 มันเรียนรู้ที่จะจำ ใต้ทั้งสามแล็บคือ Oracle AI Database หนึ่งเดียว

ตอนนี้สแกนโค้ดเพื่อทำควิซ ห้านาที ผ่านที่ 80 เปอร์เซ็นต์ และได้รับ badge

---
