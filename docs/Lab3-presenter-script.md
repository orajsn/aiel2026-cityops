# Lab 3 · Agent Memory: what to say on stage

Exported 2026-11-09 from the script manager (the current text, including colleagues' edits). 18 pages in show order, Thai first, then English. Read it as speech: whole sentences, key words in **bold**. A line `▶ Next` means press Next, and the text after it goes with what appears.

## 0 · Open Lab 3  (`3.0g`)

### ไทย

Lab 3 ใช้สภาพแวดล้อมเดียวกับ Lab 2 ครับ ถ้าปิดไปแล้ว ให้เปิดใหม่ด้วยลิงก์บนหน้าจอ หรือสแกน QR ได้เลย

### English

Lab 3 runs in the same environment as Lab 2. If you closed it, open it again with this address. It is the one called "AI Labs 1 and 2" on LiveLabs.

---

## 1 · Back at the bridge  (`3.0`)

### ไทย

**กลับมาที่ Harbor Bridge** กันอีกครั้งครับ เพราะปัญหายังไม่หายไปไหน สนิมที่เสายังอยู่ตรงนี้เหมือนเดิม

คราวนี้จะมีผู้ตรวจสอบสองคนมาดูจุดเดียวกันนี้ คนละวัน **Mercer** ไปก่อน แล้ว **Vance** ตามมาทีหลัง

และคำถามของ Lab นี้มีข้อเดียวครับ ตอน Vance มาถึง เขาต้องเริ่มต้นจากศูนย์ หรือจะรู้ทันทีว่า Mercer เจออะไรไว้แล้ว แล้ว AI agent จะส่งต่อเรื่องนี้ให้เขาได้อย่างไร

### English

**We are back at Harbor Bridge**, because the problem has not gone away: the rust is still there.

Two inspectors will look at it, on different days. **Mercer** comes first, **Vance** comes next.

And this lab has one question: when Vance arrives, does he start from zero, or does he already know what Mercer found, and how does the AI agent pass that on?

---

## 2 · Why the first one forgot  (`3.2f`) · 4 clicks

### ไทย

ก่อนอื่นเราต้องตอบให้ได้ก่อนครับ ว่าทำไม **AI agent ตัวแรก** ถึงไม่มีอะไรให้ Vance เลย เรามาย้อนกลับไปดู **วันที่ 1** ที่ Mercer มาที่สะพานนี้กัน

*▶ Next*

Mercer เริ่มเล่าให้ AI agent ฟังว่า เธอเจอ **การกัดกร่อน** ที่แผ่นรองรับของสะพาน

*▶ Next*

**หน้าตัดเหล็กหายไปประมาณ 25 เปอร์เซ็นต์** ครับ

*▶ Next*

และเธอแนะนำให้ซ่อมภายใน **60 วัน** ทุกบรรทัดที่เธอพูด AI agent จะจดลงใน **visit notebook** ซึ่งก็คือสมุดเล่มเดียวกับที่เราเห็นกันเมื่อตอนบ่าย สมุดเล่มนี้คือ **short-term memory** ครับ มันเก็บแค่รอยจดของการเยี่ยมครั้งนี้เท่านั้น

*▶ Next*

แล้วพอการเยี่ยมจบ แชตก็ปิดลง Mercer กลับบ้านไป สมุดก็ถูกล้างจนหมด **สิ่งที่เธอเล่าไว้ไม่เหลืออยู่เลย** และนี่แหละครับ คือเหตุผลที่ AI agent ตัวแรกไม่มีอะไรให้ Vance

### English

First we have to answer this: why did the **first AI agent** have nothing for Vance? Let us go back to **Day 1**, when Mercer came to the bridge.

*▶ Next*

Mercer starts telling the AI agent that she found **corrosion** on the bearing assemblies.

*▶ Next*

**About 25 percent of the section is gone.**

*▶ Next*

And she advises a repair within **60 days**. Every line she says, the AI agent writes in its **visit notebook**, the same notebook we saw this afternoon. That notebook is **short-term memory**: it only holds the scribbles of this visit.

*▶ Next*

Then the visit ends. The chat closes, Mercer goes home, and the notebook is wiped. **Nothing she said is left.** And that is exactly why the first AI agent had nothing to give Vance.

---

## 3 · Same question, two answers  (`3.1h`) · 3 clicks

### ไทย

เช้าวันถัดมา **Vance** มาถึงจุดเดิม ท่ามกลางสนิมเดียวกันนี้ เขาถาม AI agent ว่า ที่ตรงนี้เกิดอะไรขึ้นมาก่อนหรือเปล่า ผมจะให้ดูสองคำตอบ จาก **language model ตัวเดียวกัน** คำถามเดียวกันเป๊ะ

*▶ Next*

คำตอบแรก มาจาก AI agent ที่ **ไม่มี memory** มันไม่มีอะไรจะบอกเลยครับ ทุกแชตเริ่มจากศูนย์ มันทำได้แค่ถามกลับว่า คุณเห็นอะไร

*▶ Next*

ส่วนคำตอบที่สอง มาจาก AI agent ที่ **มี memory** แต่ผมขอซ่อนไว้ก่อนสักครู่ ลองเดาดูนะครับ ว่ามันต่างกันตรงไหน

*▶ Next*

ลองเปิดดูครับ มันตอบว่า Mercer บันทึกไว้เมื่อวาน เจอ **การกัดกร่อน** หน้าตัดหายไปประมาณ **25 เปอร์เซ็นต์** เกรด C ควรซ่อมภายใน **60 วัน** โมเดลเดียวกัน คำถามเดียวกัน **ต่างกันที่ memory อย่างเดียว** เท่านั้นครับ

### English

The next day **Vance** arrives at the same spot, in front of the same rust, and asks the AI agent whether anything happened here before. I will show you two answers, from the **same language model**, to the exact same question.

*▶ Next*

The first answer comes from an AI agent with **no memory**. It has nothing to say. Every chat starts from zero, so all it can do is ask back: what do you see?

*▶ Next*

The second answer comes from an AI agent **with memory**, but let me keep it hidden for a moment. Guess what is different.

*▶ Next*

Let us open it. It says: Mercer logged this yesterday, **corrosion**, about **25 percent** section loss, grade C, repair within **60 days**. Same model, same question, **only the memory differs**.

---

## 4 · Where it goes instead  (`3.3h`) · 2 clicks

### ไทย

ทีนี้ ถ้าอยากให้บันทึกของ Mercer รอดจากการปิดแชต มันต้องไปอยู่ในที่ที่ไม่ถูกล้าง นี่คือบันทึกของ Mercer ครับ

*▶ Next*

เราเก็บมันลงใน **bridge logbook** สมุดบันทึกของสะพาน ซึ่งก็เป็นสมุดเล่มเดียวกับที่เราเห็นตอนบ่ายเช่นกัน สมุดเล่มนี้คือ **long-term memory** ครับ เก็บไว้ถาวร และเวลาจะหา ก็หาได้ทั้ง **จากชื่อ** และ **จากความหมาย**

*▶ Next*

แล้วสมุดเล่มนี้อยู่ที่ไหนจริง ๆ ครับ มันอยู่ใน **Oracle Autonomous AI Database 26ai** นั่นเอง

### English

Now, if Mercer's notes are to survive the end of the chat, they have to go somewhere that is not wiped. Here are Mercer's notes.

*▶ Next*

We keep them in the **bridge logbook**, the same logbook we saw this afternoon. This is **long-term memory**: it is kept for good, and when we look for something we can find it **by name** or **by meaning**.

*▶ Next*

And where does this logbook actually live? In **Oracle Autonomous AI Database 26ai**.

---

## 5 · One report, three cards  (`3.3i`) · 3 clicks

### ไทย

รายงานฉบับเดียวของ Mercer จริง ๆ แล้วมีความรู้อยู่ **สามแบบ** ปนกันอยู่ครับ ลองดูทีละแบบ

*▶ Next*

แบบแรกคือ **สิ่งที่เกิดขึ้น** เหมือนทริปเมื่อฤดูร้อนที่แล้วที่เรานึกออกว่าเกิดอะไรขึ้น เมื่อ Vance ถามว่า เกิดอะไรขึ้นที่นี่ มันก็ดึงการ์ดใบนี้กลับมา

*▶ Next*

แบบที่สองคือ **สิ่งที่เป็นจริง** เหมือนความรู้ที่เราเรียนมาตอนเด็ก เช่น หน้าตัดหายไปประมาณ 25 เปอร์เซ็นต์ Vance ถามว่า แย่แค่ไหน ก็ได้การ์ดใบนี้

*▶ Next*

และแบบที่สามคือ **วิธีที่เราทำงาน** เหมือนการปั่นจักรยานที่เราทำได้เองโดยไม่ต้องคิด เช่น กำจัดสนิมที่หลุดก่อนทาไพรเมอร์ Vance ถามว่า ต้องทำอะไร ก็ได้การ์ดใบนี้ ดังนั้น **Vance ไม่ได้เริ่มจากศูนย์** เขาเริ่มพร้อมประวัติทั้งหมดครับ

### English

One report from Mercer actually holds **three kinds** of knowledge mixed together. Let us take them one at a time.

*▶ Next*

The first is **what happened**, like last summer's trip, where we can recall what happened. When Vance asks what happened here, this card comes back.

*▶ Next*

The second is **what is true**, like what we learned at school. For example, about 25 percent of the section is gone. Vance asks how bad it is, and this card comes back.

*▶ Next*

And the third is **how we work**, like riding a bike, which we do without thinking. For example, remove the loose rust before the primer. Vance asks what to do, and this card comes back. So **Vance does not start from zero**. He starts with the whole history.

---

## 6 · From the logbook to the glass  (`3.3p`) · 3 clicks

### ไทย

แต่ยังมีปัญหาอีกข้อครับ บันทึกทั้งหมดอยู่ในสมุดก็จริง แต่ **language model อ่านสมุดทั้งเล่มไม่ได้** มันอ่านได้เฉพาะสิ่งที่อยู่ในแก้วใบนี้ ในรอบนี้เท่านั้น

*▶ Next*

ลองหย่อนการ์ดใบแรกลงไปในแก้วดูครับ

*▶ Next*

ใบที่สอง

*▶ Next*

และใบที่สาม สิ่งที่เราเทลงไปในแต่ละรอบ คือ **สิ่งเดียวที่โมเดลได้เห็น** ดังนั้นการเลือกว่าจะเทอะไรลงไป จึงสำคัญมากครับ

### English

But there is one more problem. All the notes are in the logbook, yet the **language model cannot read the whole logbook**. It can only read what is in this glass, in this turn.

*▶ Next*

Let us drop the first card into the glass.

*▶ Next*

The second.

*▶ Next*

And the third. What we pour in on every turn is **the only thing the model gets to see**, so choosing what to pour in matters a great deal.

---

## 7 · The glass  (`3.3a`)

### ไทย

language model อ่านได้เฉพาะสิ่งที่อยู่ใน “แก้ว” ในรอบนี้เท่านั้น

เราเป็นคนเติมแก้วนี้เองทุกรอบ เริ่มจาก system prompt คำสั่งของนักพัฒนา รายการเครื่องมือ บันทึกที่ดึงมา แชตที่ผ่านมา และสุดท้ายคือคำถามของ Vance

แก้วมีขนาดคงที่ และสิ่งที่อยู่นอกแก้ว โมเดลมองไม่เห็นเลย ไม่ว่าจะเป็นแชตที่ปิดของ Mercer ฐานข้อมูล หรือเมื่อวาน

### English

The language model reads only what is in the glass, this turn. We fill it ourselves on every turn: the system prompt, the instructions, the tool list, the notes we retrieved, the chat so far and Vance’s question. It is a fixed size, and nothing outside it is seen: not Mercer’s closed chat, not the database, not yesterday.

---

## 8 · Four things go wrong  (`3.3b`) · 3 clicks

### ไทย

เวลาเติมแก้ว มีสี่อย่างที่ผิดพลาดได้ เราจะดูทีละอย่าง กด Next เพื่อเปิดแก้วถัดไป

อย่างแรกคือ ปริมาณ ผลลัพธ์จากเครื่องมือกองเข้ามาในแก้วทั้งหมด พอถึงรอบที่ 15 ก็ล้น เรียกเครื่องมืออีกครั้งเดียว ระบบก็พัง

อย่างที่สองคือ ความเกี่ยวข้อง ผลค้นหาสามสิบรายการเบียดกันเข้ามา มากกว่าที่แก้วจุได้ แล้วล้นข้างแก้ว ผลตรวจของ Mercer ซึ่งเป็นชิ้นสีเขียว teal หล่นออกไปด้วย เพราะข้อมูลส่วนใหญ่ที่เข้ามา Vance ไม่ได้ขอเลย

อย่างที่สามคือ ความถูกต้อง เพื่อประหยัดที่ ระบบสรุปบันทึก การสรุปบีบผลตรวจของ Mercer เหลือแค่ “มีสนิมที่เสา” ตัวเลข 25 เปอร์เซ็นต์หลุดหายไป และรายละเอียดที่สำคัญที่สุดก็หายไปด้วย

อย่างที่สี่คือ จังหวะเวลา เป็นข้อที่เข้าใจยากที่สุด ผลตรวจของ Mercer ถูกโหลดเข้ามาตั้งแต่รอบที่ 1 จากนั้นแต่ละรอบก็กองทับเข้ามา พอถึงรอบที่ 15 ตอนที่ Vance ถามจริง ๆ มันถูกดันออกไปแล้ว เหลือที่ว่างตรงที่ควรมีผลตรวจ ข้อมูลถูกต้อง แต่มาผิดจังหวะ: ถูกโหลดครั้งเดียวตอนเริ่ม และไม่มีใครดึงมาใหม่ตอนที่เขาถาม

### English

Filling it, four things go wrong. Volume: every tool result piles in, and by turn 15 it overflows. Relevance: thirty search results crowd in, and Mercer’s finding spills out. Accuracy: a summary squeezes her finding down to rust on the pier, and the 25 percent falls out. Timing: her finding came in at turn 1, and by turn 15, when Vance asks, it is gone.

---

## 9 · Now the code  (`3.5h`) · 4 clicks

### ไทย

ก่อนที่เราจะลงมือรัน ผมอยากให้ดูแผนที่นี้ก่อนครับ นี่คือทุกอย่างที่เราจะเดินผ่านใน notebook ด้านล่างคือฐานข้อมูล **Oracle Autonomous AI Database 26ai** ที่เก็บทุกอย่างไว้ที่เดียว และเราจะสังเกตสามเรื่องครับ

*▶ Next*

เรื่องแรกคือ **เก็บอะไรไว้** เราเก็บเป็นบันทึกชิ้นเล็ก ๆ และผลตรวจที่ผู้ตรวจสอบลงนามแล้ว อยู่ที่ Part 3 และ Part 4 ดูเลข 1 บนแผนที่ครับ ที่ `CITY_MEMORY` และ `CITY_INSPECTION_FINDING`

*▶ Next*

เรื่องที่สองคือ **ดึงอะไรเข้ามา** เฉพาะสิ่งที่คำถามนี้ต้องการเท่านั้น คือ prompt อยู่ที่ Part 6 เลข 2 บนแผนที่

*▶ Next*

และเรื่องที่สามคือ **ทำอะไรในทุกรอบ** อ่าน คิด ลงมือ และบันทึก คือ `call_copilot` ใน Part 6 และสองวันที่เราจะเล่า เลข 3

*▶ Next*

ส่วน Part 1 กับ Part 2 คือฐานข้อมูลและ embedder ที่อยู่เบื้องล่างครับ ทีนี้ เรามาเปิด notebook แล้วเดินตามแผนที่นี้กันเลย

### English

Before we start running, look at this map. It is everything we will walk through in the notebook. At the bottom is **Oracle Autonomous AI Database 26ai**, holding everything in one place, and there are three things to watch.

*▶ Next*

The first is **what to keep**. We keep small records, and the finding the inspector has signed. That is Part 3 and Part 4, number 1 on the map, at `CITY_MEMORY` and `CITY_INSPECTION_FINDING`.

*▶ Next*

The second is **what to bring in**: only what this question needs. That is the prompt, in Part 6, number 2 on the map.

*▶ Next*

And the third is **what to do on every turn**: read, think, act and save. That is `call_copilot` in Part 6, and the two days we will tell, number 3.

*▶ Next*

Parts 1 and 2, the database and the embedder, sit underneath. So now let us open the notebook and walk this map.

---

## 10 · Open the lab to code  (`3.5g`)

### ไทย

เอาล่ะครับ นั่นคือเรื่องราวทั้งหมด ต่อไปเราจะรันมันจริง ๆ ขอให้ทุกท่านเปิด **สภาพแวดล้อมของ lab** ซึ่งเป็นอันเดียวกับ Lab 2 ด้วยลิงก์หรือ QR บนหน้าจอ บน LiveLabs จะชื่อว่า **AI Labs 1 and 2** ครับ

พอเปิดแล้ว เราจะเปิด notebook ตัวนี้ด้วยกัน แล้วดูแต่ละส่วนทำงานทีละขั้น

### English

All right, that was the whole story. Now we run it for real. Please open your **lab environment**, the same one as Lab 2, with the address or the code on the screen. On LiveLabs it is called **AI Labs 1 and 2**.

Once it is open, we will open the notebook together and watch each part work, one step at a time.

---

## 11 · The code, on one map  (`3.6m`) · 21 stops, one script each

Every click is its own page (11, 11a, 11b ...), with its own script in the script manager (`3.6m`, `3.6m.1` ...). Thai first, then English.

### 11 · The code, on one map  (`3.6m`) · stop 0

#### ไทย

ตัวละครของเรามีสองคนครับ คุณ Mercer ช่างตรวจที่ไปตรวจ Harbor Bridge ก่อน กับคุณ Vance ช่างคนใหม่ที่ไปสะพานเดียวกันหลายสัปดาห์ต่อมา สองคนนี้ไม่เคยเจอกัน ไม่เคยคุยกัน โจทย์คือทำยังไงให้สิ่งที่ Mercer รู้ ไปถึงมือ Vance เอง
**สำนักงานของเรามีห้องเก็บเอกสารห้องเดียวครับ คือ Oracle AI Database ทะเบียนเมือง รายงานที่เซ็นแล้ว และความจำของที่ปรึกษา อยู่ในห้องเดียวกันหมด และสำนักงานนี้ยกทั้งหลังไปตั้งบน OCI ได้ ระหว่างทางผมจะชี้ให้ดูว่าห้องไหนตรงกับบริการอะไร**

**เรามาดู workflow ของ lab นี้กัน นิดนึงครับ**
แถวบนคือเคาน์เตอร์หน้าสำนักงาน ช่างเดินเข้ามาถาม call_agent เป็นคนรับเรื่อง เดินไปหยิบเอกสารที่เกี่ยวข้องมาใส่แฟ้ม คือ The prompt ส่งแฟ้มให้ที่ปรึกษาอ่าน แล้วส่งคำตอบกลับให้ช่าง

กรอบใหญ่ด้านล่างคือห้องเก็บเอกสารครับ มีประตูบานเดียว ข้างในมีทะเบียนเมือง ตู้ต้นฉบับรายงาน โต๊ะเสมียนที่คัดสิ่งสำคัญ ตู้บัตรรายการ และตู้รายงานที่เซ็นแล้ว
แถบเลขด้านล่างคือเส้นทางทัวร์สำนักงานวันนี้ เริ่มจาก 0 ไปจนถึง Day N ระหว่างทางใครหลง กลับมาดูแผนผังนี้ได้ตลอดครับ

#### English

This one map is everything in today’s notebook. One turn of the AI agent runs along the top, and everything it remembers sits in one database underneath. We will walk it in the order the code runs.

### 11a · 0 · First, open the notebook.  (`3.6m.1`) · stop 1

#### ไทย

//**Part0**
เมื่อทุกคนเปิดหน้า LiveLabs ของ workshop แล้วกดลิงก์เปิด JupyterLab และ ทำการ login ด้วย password ที่กำหนด ครับ
----
แถบซ้ายคือชั้นหนังสือของสำนักงานครับ ดับเบิลคลิก notebooks แล้วเข้า agent_memory จากนั้นดับเบิลคลิก notebook_complete_ollama.ipynb
//[ชี้ไฟล์ notebook_student_ollama.ipynb]
บนชั้นเดียวกันมีคู่มืออีกเล่มครับ notebook_student_ollama.ipynb เล่มนั้นเว้นช่องว่างไว้หกจุดให้พนักงานเติมเอง วันนี้เราใช้เล่ม complete ที่เติมครบแล้ว ใครอยากท้าทายตัวเอง กลับบ้านไปลองเล่ม student ได้
--

#### English

First, open the notebook. In the file list on the left, open the agent_memory folder and double-click notebook_complete_ollama.ipynb.

### 11b · 0 · This is where the code is.  (`3.6m.2`) · stop 2

#### ไทย

คู่มือแบ่งเป็นหน้าเล็ก ๆ เรียกว่า cell มีสองแบบ
//[ชี้ข้อความคำอธิบาย]
แบบแรกเป็นคำอธิบาย อ่านอย่างเดียว บอกว่าถัดไปจะทำอะไร
//[ชี้ code cell ที่มีเลขบรรทัด]
แบบที่สองคือคำสั่งงาน กล่องสีเทาที่มีเลขบรรทัด กดแล้วงานเกิดขึ้นจริง ตัวอักษรสีเขียวเอียงที่ขึ้นต้นด้วย # คือโน้ตที่คนเขียนคู่มือทิ้งไว้ให้อ่าน ไม่มีผลกับงาน
ด้านซ้ายของหน้าคำสั่งงานมีช่องเช็กสถานะครับ เหมือนตราประทับบนใบงาน
มุมขวาบนคือพนักงานที่ลงมือทำงานตามคู่มือ เรียกว่า kernel วงกลมโปร่งแปลว่าว่างอยู่ ถ้าวงกลมทึบแปลว่ากำลังทำงาน

#### English

This is where the code lives. Each box is a cell. Click inside one to select it, and the blue bar on its left shows which cell you are on.

### 11c · 0 · Run the cell.  (`3.6m.3`) · stop 3

#### ไทย

**การสั่งงาน**
1. คลิกที่หน้า แล้วกด Shift + Enter ทำหน้านี้แล้วพลิกไปหน้าถัดไปให้เลย วันนี้ใช้วิธีนี้เป็นหลัก
2. กดปุ่ม ▶ บนแถบเครื่องมือ ได้ผลเหมือนกัน
3. เมนู Run แล้ว Run All Cells ทำทั้งเล่มรวดเดียว วันนี้อย่าเพิ่งใช้นะครับ เราจะเดินไปด้วยกันทีละหน้า
**กฎสามข้อของสำนักงาน**
1. ทำตามลำดับหน้า ห้ามข้าม หน้าหลังใช้ของที่หน้าก่อนเตรียมไว้ เหมือนจะเข้าห้องเอกสารโดยยังไม่ได้เปิดประตู ก็เจอ error ทันที
2. เห็นดอกจันแล้วรอ หน้าที่ต้องถามที่ปรึกษาใช้เวลา 30 ถึง 60 วินาที กดซ้ำเท่ากับเคาะประตูห้องที่ปรึกษาซ้ำ ๆ เขาไม่ได้ตอบเร็วขึ้นครับ
3. ถ้าค้าง กด ■ เพื่อหยุด ถ้ายังแปลก ๆ ไปที่เมนู Kernel เลือก Restart Kernel แล้วเริ่มจากหน้าแรกใหม่

#### English

To run a cell, click Run, or press Shift and Enter. The cell runs, and the next one is selected for you. Run them in order and you will follow along with me.

### 11d · 1a · Oracle setup  (`3.6m.4`) · stop 4

#### ไทย

//**Part 1a: สำนักงานมีอะไรอยู่ที่ไหน**
สำนักงานนี้มีอะไร อยู่ที่ไหน" สไลด์นี้ตอบไว้ประโยคเดียว "One filing room, not five" 
ที่เก็บเอกสารห้องเดียว ไม่ใช่ห้า
ในหน้านี้มีที่อยู่สามอย่างครับ ห้องเอกสารอยู่ไหน คนปักหมุดแผนที่คือใคร และห้องที่ปรึกษาอยู่ตรงไหน
ห้องเก็บเอกสาร
//[ชี้บรรทัด 71–72 DB_USER กับ DB_DSN]
DB_DSN คือที่อยู่ของห้องเก็บเอกสารครับ อ่านเหมือนป้ายบอกทางในสำนักงานได้เลย

คนปักหมุดแผนที่
ในห้องเอกสารนี้มีคนทำงานพิเศษคนหนึ่งครับ เขาอ่านรายงานทุกฉบับแล้วปักหมุดลงบนแผนที่เมือง แต่ไม่ใช่แผนที่ถนน เป็นแผนที่ของความหมาย รายงานที่พูดเรื่องเดียวกันจะได้หมุดอยู่ย่านเดียวกัน
คนปักหมุดคนนี้ชื่อ ALL_MINILM_L12_V2 เป็นโมเดลแบบ ONNX 
คำคอมเมนต์บรรทัด 74 บอกว่า "preloaded into Oracle" เขานั่งทำงานอยู่ในห้องเอกสารอยู่แล้ว เราแค่เรียกชื่อ ไม่ต้องส่งรายงานออกไปให้ใครข้างนอก
**คนปักหมุดทำงานในห้องเอกสาร แปลว่ารายงานไม่เคยออกจากห้องเลยครับ ไม่มีค่าจ้างต่อฉบับ และใน Oracle AI Database 26ai ความสามารถ AI Vector Search รวมมาให้โดยไม่คิดเงินเพิ่ม ห้องเอกสารบน Autonomous AI Database ก็มีคนปักหมุดแบบเดียวกัน**

ที่ปรึกษา
สองบรรทัดนี้คือห้องของที่ปรึกษาอาวุโสครับ ห้องชื่อ ollama เลขที่ 11434 
ที่ปรึกษาชื่อ llama3.2 เป็นที่ปรึกษาตัวเล็กที่นั่งอยู่ในสำนักงานเดียวกัน
คอมเมนต์บรรทัด 78 บอกว่าที่ปรึกษาคนนี้ทำงานสองตำแหน่ง ช่วยเสมียนสรุปบัตรรายการ และตอบคำถามช่างที่เคาน์เตอร์
พอสำนักงานโตขึ้น จะจ้างที่ปรึกษาที่เก่งกว่านี้ก็แค่เปลี่ยนเลขห้องสองบรรทัดนี้ครับ บน OCI Generative AI มีที่ปรึกษาให้เลือก เช่น grok, gemma, และ OpenAI gpt-oss หรือจะ bring your own model ก็ได้

#### English

Part 1. Where does everything live? In **one filing room, not five**. These few settings name the database, the embedding model and the language model.

### 11e · 1b · Oracle setup  (`3.6m.5`) · stop 5

#### ไทย

// Part 1b: เปิดประตูห้องเอกสาร
รู้ที่อยู่แล้ว ทีนี้เดินไปเปิดประตูห้องเอกสารกันครับ
connect_to_oracle คือการเดินไปที่หน้าห้อง ยื่นบัตรพนักงาน ใส่รหัส แล้วเปิดประตูครับ บรรทัดเดียวจบ ไม่มีขั้นตอนพิเศษ
--
กด Shift + Enter แล้วควรเห็นป้ายสรุปออกมาครับ
ใครเห็น Connected แล้ว ยกมือให้ผมดูหน่อยครับ

**ลองนึกถึงสำนักงานที่เก็บทะเบียนไว้ตึกหนึ่ง แผนที่ไว้อีกตึก บัตรรายการไว้อีกตึกครับ สามประตู สามกุญแจ และสามที่ที่เอกสารอาจไม่ตรงกัน บริษัทที่ใช้ vector DB แยกกับฐานข้อมูลหลักเจอแบบนี้อยู่ทุกวัน
ที่นี่ประตูเดียวจบ และถ้าย้ายห้องเอกสารไปอยู่บน Autonomous AI Database งานแม่บ้านของห้องเก็บเอกสาร เช่น ซ่อมบำรุง สำเนาเอกสาร และล็อกตู้ ระบบทำให้เอง**

#### English

Now run the connection cell. **One connection** opens the database. If you see this line, you are in, and everything after this uses the same connection.

### 11f · 2a · The embedder  (`3.6m.6`) · stop 6

#### ไทย

**Part 2a: คนปักหมุดแผนที่ความหมาย**
ปัญหาแรกของห้องเอกสารครับ ช่างแต่ละคนเขียนไม่เหมือนกัน Mercer เขียนว่า "สนิมเกาะตลับลูกปืน Pier 2" ส่วน Vance เขียนว่า "เห็นคราบสนิมไหลใกล้ตอม่อฝั่งใต้" เรื่องเดียวกัน แต่คำไม่ตรงกันสักคำ ถ้าเสมียนค้นตามคำ หากันไม่เจอแน่นอน
[ชี้ประโยคบนสไลด์]
นี่คืองานของคนปักหมุดครับ สไลด์บอกไว้เลย ข้อความกลายเป็นตัวเลข 384 ตัว เหมือนที่อยู่บนแผนที่ความหมาย รายงานที่หมายถึงเรื่องเดียวกันจะไปอยู่ย่านเดียวกัน
ลองนึกแผนที่เมืองของเราครับ ย่านหนึ่งเป็นเรื่องสนิม อีกย่านเป็นเรื่องท่อรั่ว อีกย่านเป็นเรื่องไฟฟ้าดับ รายงานของ Mercer กับ Vance จะได้หมุดอยู่ย่านสนิมทั้งคู่ เพราะความหมายเดียวกัน แม้คำจะต่างกัน แค่แผนที่นี้มี 384 มิติ แทนที่จะมีแค่เหนือใต้ตะวันออกตะวันตก
[ชี้กล่อง Embedder บนแผนผัง]
บนแผนผังสำนักงาน คนปักหมุดนั่งที่กล่อง Embedder ครับ ลูกศรสองเส้นบอกว่าเขาปักหมุดให้ทั้งตู้บัตรรายการ และตู้รายงานที่เซ็นแล้ว
**บรรทัด 17 คือหัวใจครับ คำว่า database แปลว่าคนปักหมุดนั่งอยู่ในห้องเอกสาร ไม่ต้องส่งรายงานออกไปให้ใครข้างนอกปักหมุดให้**
• บรรทัด 21 ส่งรายงานให้คนปักหมุด ได้พิกัดกลับมา
• บรรทัด 22 เขียนพิกัดให้อยู่ในรูปแบบ float32 เพราะเสมียนอ่านได้แบบเดียว เขียนผิดแบบเสมียนไม่รับ
กด Shift+Enter
ด่านตรวจคือการทดสอบคนปักหมุดวันแรกครับ ยื่นรายงานสั้น ๆ ให้ฉบับหนึ่ง "corrosion on bearing assembly" ต้องได้หมุดกลับมาหนึ่งอัน พิกัด 384 หลักพอดี

#### English

Part 2. How do you search by meaning? The embedder turns text into **384 numbers**, like an address on a map of meaning. Reports that mean the same thing land close together.

### 11g · 2b · The memory SDK  (`3.6m.7`) · stop 7

#### ไทย

Part 2b: เสมียนประจำห้องเอกสาร
ห้องเอกสารมีแล้ว คนปักหมุดมีแล้ว คำถามต่อไปคือใครจะเป็นคนจดครับ
คำตอบคือเสมียนประจำห้อง คือ SDK oracleagentmemory เสมียนคนนี้ทำงานสองอย่างครับ เก็บต้นฉบับทุกคำที่ช่างพูด และเขียนบัตรรายการสรุปสิ่งที่สำคัญเก็บไว้

ส่วนบนของ cell บอกเสมียนว่าเวลาสรุปบัตรไม่ออก ให้ไปปรึกษาที่ปรึกษาห้องเดิมครับ 
บรรทัด 18 คือบรรทัดที่ผมชอบที่สุดในคู่มือครับ ถ้าไม่มีบรรทัดนี้ เสมียนจะแค่เก็บต้นฉบับเข้าตู้เฉย ๆ พอมีบรรทัดนี้ เขาจะอ่านทุกฉบับแล้วเขียนบัตรสรุปให้เอง เราไม่ต้องสอนเขาเขียนสักบรรทัด

กด Shift+Enter แล้วดูที่ output OracleAgentMemory ready. Tables under prefix CITY_*

#### English

Next, the memory SDK. It sits on that same connection and sets up its own tables, and the embedder we just met does the numbers for it.

### 11h · 3a · City assets  (`3.6m.8`) · stop 8

#### ไทย

** Part 3a: ขนกล่องเอกสารเก่าเข้าห้อง**
สำนักงานเราไม่ได้เริ่มจากศูนย์นะครับ ชั้นใต้ดินมีกล่องเอกสารเก่าอยู่สองกอง กองแรกเป็นบันทึกซ่อมบำรุง กองที่สองเป็นรายงานตรวจสภาพ cell นี้คือการยกสองกองนี้ขึ้นมาเปิดอ่าน แล้วทำทะเบียนทรัพย์สินของเมืองให้เรียบร้อย
โค้ดส่วนนี้ไล่อ่านทุกแผ่นในสองกอง แล้วดึงรหัสทรัพย์สินออกมา สะพาน ท่อ อุโมงค์ เจอรหัสไหนก็จดลงทะเบียน รหัสซ้ำก็จดครั้งเดียว
ทะเบียนนี้คือตู้ CITY_ASSET ครับ ตู้แรกในห้องเอกสาร เป็นตาราง Oracle ธรรมดา ไม่มีอะไรพิเศษ
[กด Shift+Enter แล้วชี้ output]
308 บันทึกซ่อม 60 รายงานตรวจ รวมกันแล้วเมืองเรามีทรัพย์สิน 26 ชิ้น ตรงกับที่ผมเล่าตอนเปิดเรื่องครับ ทะเบียน 26 แถวนี้จะเป็นกระดูกสันหลังของทุกอย่างที่เหลือ

#### English

Part 3. Before any memory, the AI agent needs to know what exists. This code reads two data files and finds **26 city assets**, and Harbor Bridge is one of them.

### 11i · 3b · What happens to a new message?  (`3.6m.9`) · stop 9

#### ไทย

***Part 3b: แฟ้มงานส่วนตัว และเสมียนเขียนบัตร**
ทีนี้มาถึงชีวิตประจำวันของสำนักงานครับ ช่างคนหนึ่งเดินกลับจากหน้างานแล้วพูดว่า "วันนี้เจออะไรมา" คำพูดนั้นต้องไปอยู่ที่ไหน
คำตอบคือแฟ้มงานส่วนตัวครับ ช่างหนึ่งคนกับสะพานหนึ่งตัวมีแฟ้มหนึ่งเล่ม Mercer กับ Pier 2 เป็นแฟ้มหนึ่ง Vance กับ Pier 2 เป็นอีกแฟ้ม ในโค้ดเรียกแฟ้มนี้ว่า thread

Part 3b1: รายงานใหม่หนึ่งฉบับ เดินทางไปไหนบ้าง
[เปิดสไลด์ 3b · What happens to a new message?]
ทีนี้มาถึงชีวิตประจำวันของสำนักงานครับ ช่างคนหนึ่งเดินกลับจากหน้างานแล้วเล่าว่า "วันนี้เจออะไรมา" คำถามคือคำพูดประโยคนั้นเดินทางไปไหนบ้างในห้องเอกสาร สไลด์นี้ตอบไว้ในภาพเดียวครับ
ก่อนอื่นแนะนำแฟ้มงานส่วนตัวก่อน ช่างหนึ่งคนกับสะพานหนึ่งตัวมีแฟ้มหนึ่งเล่ม Mercer กับ Pier 2 เป็นแฟ้มหนึ่ง Vance กับ Pier 2 เป็นอีกแฟ้ม ในโค้ดเรียกแฟ้มนี้ว่า thread
ทางแรก: เก็บต้นฉบับทุกคำ
[ชี้กล่อง New message แล้วลากตามลูกศรไปที่ CITY_MESSAGE verbatim]
พอเรียก thread.add_messages(...) สิ่งแรกที่เสมียนทำคือเย็บต้นฉบับเข้าแฟ้มครับ ทุกคำตามที่ช่างพูด ไม่ตัด ไม่สรุป เก็บในตู้ CITY_MESSAGE คำว่า verbatim บนภาพแปลว่าคำต่อคำ ถ้าวันหลังมีข้อโต้แย้งว่า "ช่างพูดจริงหรือเปล่า" เปิดต้นฉบับดูได้เสมอ
ทางที่สอง: เสมียนนั่งเขียนบัตรรายการ
[ชี้ลูกศรเส้นที่สองที่วิ่งไปกล่องหกเหลี่ยม Extractor LLM]
ข้อความเดียวกันถูกส่งไปที่โต๊ะเสมียนด้วยครับ กล่องหกเหลี่ยมนี้คือเสมียนของเรา บนภาพเขียนว่า the SDK's own model คือเสมียนมีที่ปรึกษาประจำโต๊ะช่วยอ่าน ใน lab นี้ก็คือ llama3.2 ตัวที่เราใส่ไว้ตอน 2b นั่นเอง
แต่เสมียนไม่ได้อ่านข้อความใหม่โดด ๆ นะครับ บนโต๊ะเขามีของอีกสองอย่างวางอยู่
[ชี้กล่อง Running thread summary และเส้นประ advisory]
อย่างแรกคือแผ่นสรุปที่แปะหน้าแฟ้ม แฟ้มนี้คุยเรื่องอะไรมาแล้วบ้าง เส้นประเขียนว่า advisory แปลว่าเสมียนแค่ชำเลืองดูให้รู้บริบท ไม่ได้ลอกมาเขียนบัตร เหมือนรู้ว่า "อ๋อ แฟ้มนี้กำลังพูดเรื่องสนิมลูกปืน" จะได้ตีความประโยคใหม่ถูก
[ชี้กระบอก Past memories และเส้นประ dedup / update]
อย่างที่สองคือบัตรเก่าที่อยู่ในตู้แล้วครับ ก่อนเขียนบัตรใหม่ เสมียนเปิดตู้ดูก่อนว่ามีใบที่พูดเรื่องเดียวกันอยู่หรือยัง ถ้ามีแล้วก็ไม่เขียนซ้ำ ถ้าข้อมูลเปลี่ยน เช่นเมื่อเดือนก่อนสนิมกิน 15% วันนี้เป็น 25% ก็แก้บัตรใบเดิมแทน นี่คือคำว่า dedup / update บนภาพ ตู้บัตรจึงไม่บวมด้วยบัตรซ้ำ ๆ
ผลลัพธ์: บัตรเล็ก ๆ 2 ถึง 8 ใบ
[ชี้กล่อง 2-8 atomic typed records แล้วลากไป CITY_MEMORY]
อ่านครบสามอย่างแล้ว เสมียนเขียนบัตรออกมา 2 ถึง 8 ใบต่อข้อความครับ คำว่า atomic แปลว่าบัตรหนึ่งใบเขียนเรื่องเดียว ไม่ยัดหลายเรื่องรวมกัน ค้นทีหลังจะได้หยิบตรงใบ
บัตรมีสี่สี ตามที่เราตั้งไว้ในตารางตัวละคร
สีบัตร
ใช้กับ
ตัวอย่างจากรายงาน Mercer
fact
ข้อเท็จจริง
Pier 2 section loss ราว 25%
preference
ความชอบของช่างคนนั้น
วิธีทำงานที่ช่างชอบ
guideline
แนวปฏิบัติ
ข้อความใต้ Standing guidance
memory
เรื่องเล่าทั่วไป
สิ่งที่เกิดขึ้นวันนั้น
บัตรทุกใบเข้าตู้ CITY_MEMORY แล้วคนปักหมุดก็ปักหมุดให้ทุกใบบนแผนที่ความหมาย พรุ่งนี้ใครค้นเรื่องสนิมก็หาเจอ
[ชี้บรรทัด extract_memories=True บนสไลด์]
จำได้ไหมครับ บรรทัด extract_memories=True ใน 2b ที่ผมบอกว่าชอบที่สุด ทางที่สองทั้งเส้นนี้เกิดขึ้นเพราะบรรทัดนั้นบรรทัดเดียว เราไม่ได้เขียนโค้ดสั่งเสมียนอ่าน ไม่ได้เขียน prompt สั่งแยกสี ไม่ได้เขียนโค้ดเช็กบัตรซ้ำ SDK ทำให้หมด
หมายเหตุสำหรับผู้พูด: จำนวน 2 ถึง 8 ใบเป็นช่วงโดยประมาณ แล้วแต่ข้อความยาวสั้น อย่าสัญญาตัวเลขตายตัว
จังหวะขายของ
ดูภาพนี้อีกทีครับ ต้นฉบับ แผ่นสรุป บัตรเก่า บัตรใหม่ ทั้งหมดอยู่ในห้องเอกสารห้องเดียว ตอนเสมียนเช็กบัตรซ้ำ เขาไม่ต้องเดินข้ามไปอีกตึกเพื่อถาม vector DB แยก เพราะบัตรกับหมุดอยู่ในแถวเดียวกันของตาราง Oracle
[เปลี่ยนไปที่โค้ด]
เห็นภาพรวมแล้ว ทีนี้มาดูโค้ดที่ช่างใช้เดินมาส่งรายงานกันครับ

#### English

Now the heart of it. A new message is filed word for word in **CITY_MESSAGE**. Then the extractor reads it, together with the running thread summary and the past memories, and writes two to eight small typed records into **CITY_MEMORY**.

### 11j · 3b · Auto-extraction  (`3.6m.10`) · stop 10

#### ไทย

Part 3b2: ยื่นรายงานเข้าแฟ้มทำยังไง (TODO 2)
[เปิดสไลด์ 3b · How does a report get filed?]
ภาพเมื่อกี้ดูเหมือนงานเยอะใช่ไหมครับ เก็บต้นฉบับ อ่านแผ่นสรุป เช็กบัตรซ้ำ เขียนบัตรสี่สี แต่สไลด์นี้บอกว่าในโค้ดจริงใช้แค่สองบรรทัด เตรียมหน้ากระดาษ แล้วยื่นเข้าแฟ้ม ที่เหลือเสมียนทำเอง
[ชี้แผนผังด้านซ้าย กล่อง CITY_MESSAGE กับ Extractor ที่ไฮไลต์]
บนแผนผังสำนักงาน เราอยู่ตรงนี้ครับ ตู้ต้นฉบับกับโต๊ะเสมียน สองกล่องที่เพิ่งเห็นใน 3b1
ก่อนยื่น: สั่งให้มีแผ่นสรุปหน้าแฟ้ม
[ชี้บรรทัด 13–14]
ด้านบนของฟังก์ชันคือการหาแฟ้มของช่างคนนี้กับสะพานนี้ ถ้าไม่มีก็เปิดแฟ้มใหม่ และเขียนชื่อช่างเป็นเจ้าของบนสันแฟ้มด้วย user_id=inspector บรรทัดชื่อเจ้าของนี้จำไว้ให้ดี มันจะกลับมาเป็นพระเอกใน 3c กับ Part 5
สองบรรทัดที่เห็นอยู่คือคำสั่งเรื่องแผ่นสรุปครับ
บรรทัด
โค้ด
ในสำนักงาน
13
enable_context_summary=True
ให้มีแผ่นสรุปแปะหน้าแฟ้ม แผ่นที่เสมียนชำเลืองดูใน 3b1
14
context_summary_update_frequency=2
ทุก 2 ข้อความ เขียนแผ่นสรุปใหม่ครั้งหนึ่ง
ทำไมไม่เขียนใหม่ทุกข้อความ เพราะการเขียนแผ่นสรุปต้องถามที่ปรึกษาทุกครั้งครับ ถามทุกหน้าเสียเวลา สองหน้าครั้งกำลังพอดี
บรรทัดที่หนึ่ง: ประทับหัวกระดาษ
[ชี้บรรทัด 16 ที่ไฮไลต์]
content = f"[Asset: {asset_id}] [Inspector: {inspector}] {narrative}"
ก่อนยื่น เสมียนประทับตราหัวกระดาษสองอันครับ รหัสสะพาน และชื่อช่าง แล้วตามด้วยเนื้อเรื่องที่ช่างเล่า
ทำไมต้องประทับ เพราะช่างมักเล่าแบบไม่บอกชื่อสะพานครับ "เจอสนิมที่เสาต้นที่สอง" เสาต้นที่สองของสะพานไหน พอมีตราประทับหัวกระดาษ เสมียนก็เขียนบัตรได้ครบ และคนปักหมุดก็ปักหมุดได้ตรงย่านของสะพานนั้น
บรรทัดที่สอง: ยื่นเข้าแฟ้ม
[ชี้บรรทัด 17 ที่ไฮไลต์]
return await t.add_messages_async([Message(role="user", content=content)])
บรรทัดนี้คือการยื่นกระดาษใส่แฟ้ม t ครับ role="user" แปลว่าคนพูดคือช่าง ไม่ใช่ที่ปรึกษา
ประโยคสำคัญบนสไลด์คือประโยคนี้ครับ Saving the message is also what starts the extractor การยื่นกระดาษเข้าแฟ้มคือกริ่งเรียกเสมียนไปในตัว เราไม่ต้องเดินไปเคาะโต๊ะเสมียนอีกรอบ ทุกอย่างในภาพ 3b1 เกิดจากบรรทัด 17 บรรทัดเดียว
ด่านตรวจ: ทดสอบด้วยช่างทดสอบ
[ชี้บรรทัด 19–26]
ด่านตรวจหยิบบันทึกซ่อมใบแรกจากกองเอกสารเก่าใน 3a ครับ _logs[0] คอมเมนต์บอกว่าน่าจะเป็นการตรวจประจำที่ Harbor Bridge แล้วส่งให้ช่างทดสอบชื่อ smoke_inspector ยื่นเข้าแฟ้มทดสอบ smoke_thread ใช้ชื่อทดสอบก็เพื่อไม่ให้ปนกับแฟ้มของ Mercer กับ Vance
[ชี้บรรทัด 27]
assert เช็กว่าได้ใบรับกลับมาอย่างน้อยหนึ่งใบ ถ้าไม่ได้ แปลว่ากระดาษไม่เคยเข้าแฟ้ม จะขึ้นข้อความ TODO 2 incomplete ทันที
[กด Shift+Enter แล้วชี้แถบ YOU SHOULD SEE]

#### English

So how does a report get filed? Two lines do it: build the content string, then call add_messages_async. **Saving the message is also what starts the extractor.**

### 11k · 3b · Peek at the tables  (`3.6m.11`) · stop 11

#### ไทย

ลองเปิดตู้ทั้งสองใบดูครับ ฟังก์ชันเล็ก ๆ ชื่อ peek_sdk_tables พิมพ์แถวของ CITY_MESSAGE กับ CITY_MEMORY ออกมาสำหรับแฟ้มหนึ่งเล่ม ที่เห็นตรงนี้คือแฟ้มทดสอบ smoke_thread ข้อความหนึ่งแถวคือต้นฉบับคำต่อคำ และถัดลงมาคือบัตรความจำสองใบที่ extractor เขียนจากข้อความนั้น

#### English

Let us open both tables and look inside. A small helper called peek_sdk_tables prints the rows of CITY_MESSAGE and CITY_MEMORY for one thread. Here it is the test thread: one message, **word for word**, and below it the two memory cards the extractor wrote from it.

### 11l · 3b · Run four reports  (`3.6m.12`) · stop 12

#### ไทย

ทีนี้ลองกับรายงานหลายฉบับครับ โค้ดสุ่มรายงานมาสี่ฉบับ มีทั้งงานปกติ คำเตือน และงานวิกฤต แล้วยื่นทีละฉบับเข้าแฟ้ม inspect_demo ด้วย report_event ตัวเดิม ทุกฉบับถูกเก็บคำต่อคำ และ extractor อ่านแล้วเขียนบัตรให้เหมือนกัน

#### English

Now we try it on more reports. The code samples four reports, a mix of routine, warning and critical, and files each one into the inspect_demo thread with the **same report_event call**. Each is saved word for word, and the extractor writes its cards.

### 11m · 3c · Finding a memory  (`3.6m.13`) · stop 13

#### ไทย

ส่วน 3c ครับ ทำไมค้นแล้วได้ผลว่างเปล่า เพราะความจำเป็นของคนที่เขียนมันครับ ค้นโดยไม่ใส่ชื่อ ก็ไม่ได้อะไรเลย พอใส่ชื่อให้ถูก บัตรก็สว่างขึ้นมาทันที

#### English

Part 3c. Why did this search come back empty? Because **a memory belongs to whoever wrote it**. Search with no name and you get nothing. Give the right name, and the cards light up.

### 11n · 4a · The official record  (`3.6m.14`) · stop 14

#### ไทย

Part 4 ครับ ถ้า finding ไม่ใช่ความจำ แล้วมันคืออะไร ความจำคือสิ่งที่ AI agent สังเกตเห็น ส่วน finding คือสิ่งที่คนเซ็นรับรอง มันมีตารางของตัวเอง และคำอธิบายของมันก็ถูกแปลงเป็นตัวเลขเหมือนกัน

#### English

Part 4. What is a finding, if it is not a memory? A memory is what the AI agent noticed. **A finding is what a person signed.** It gets its own table, and its description becomes numbers too.

### 11o · 4b · Search with walls  (`3.6m.15`) · stop 15

#### ไทย

ทีนี้ค้นหา finding ครับ เราอยากได้ใบที่ใกล้ที่สุดในความหมาย แต่เฉพาะสะพานนี้เท่านั้น SQL คำสั่งเดียวทำได้ทั้งสองอย่าง คือใกล้ที่สุดในความหมาย ภายในกำแพงของทรัพย์สินนี้และหมวดนี้

#### English

Now we search the findings. We want the nearest in meaning, but only for this bridge. One SQL statement does both: the closest in meaning, **inside the walls** of this asset and this category.

### 11p · 5 · Who sees what  (`3.6m.16`) · stop 16

#### ไทย

Part 5 ครับ ทำไม Vance อ่านโน้ตส่วนตัวของ Mercer ไม่ได้ ใน notebook พิสูจน์ด้วยการค้นสองครั้ง Mercer บันทึกโน้ตส่วนตัวของเธอ แล้ว Vance ค้นในชื่อของเขา ได้ผลลัพธ์ศูนย์ ส่วนแนวปฏิบัติของทั้งเมืองที่ Mercer บันทึกไว้ Vance ค้นเจอ และคนที่บังคับกฎนี้คือฐานข้อมูล ไม่ใช่ AI agent

#### English

Part 5. Why can Vance not read Mercer’s private note? The notebook proves it with two searches. Mercer saves a personal note, and Vance searches under his own name: **nothing comes back**. Mercer also saves a city-wide guideline, and Vance finds it. And **the database enforces this**, not the AI agent.

### 11q · 6 · One whole turn  (`3.6m.17`) · stop 17

#### ไทย

Part 6 คือหนึ่งเทิร์นเต็ม ๆ ครับ AI agent อ่านอะไรจริง ๆ สองบรรทัดดึงมาให้ คือการ์ดบริบทของมัน กับ finding ที่คล้ายกัน แล้วทุกอย่างรวมเข้าใน prompt เดียว ถามแล้วบันทึก

#### English

Part 6 is one whole turn. What does the AI agent actually read? Two lines fetch it: its context card and the similar findings. Then it all goes into one prompt: ask, then save.

### 11r · Day 1a · Day 1, step 1: Mercer asks  (`3.6m.18`) · stop 18

#### ไทย

มาถึงเรื่องราวแล้วครับ วันที่ 1 Mercer เรียก call_copilot เพื่อขอความช่วยเหลือด้านการวินิจฉัย เธอพิมพ์สิ่งที่เห็นบน Harbor Bridge AI agent ค้นสิ่งที่รู้อยู่แล้วและคิดต่อ เทิร์นของเธอถูกบันทึก และ extractor เก็บสิ่งที่สำคัญไว้

#### English

Now the story, Day 1. Mercer calls call_copilot for diagnostic help. She types what she sees on Harbor Bridge. The AI agent searches what is already known and reasons about it. Her turn is saved, and the extractor keeps what matters.

### 11s · Day 1b · Day 1, step 2: Mercer records  (`3.6m.19`) · stop 19

#### ไทย

เมื่อ Mercer มั่นใจแล้ว เธอบันทึก finding ด้วยตัวเองผ่าน log_finding ครับ นี่เป็นเส้นทางแยกต่างหาก เป็นหนึ่งแถวในบันทึกทางการ

#### English

Once Mercer is sure, she signs the finding herself with log_finding. That is a separate path: **one row in the official record**.

### 11t · Day N · Later: Vance  (`3.6m.20`) · stop 20

#### ไทย

และต่อมาก็ถึงคิว Vance ครับ เขาเรียกแค่ call_copilot ส่วนแฟ้มของเขาว่างเปล่า แต่ความจำของทรัพย์สินและ finding ของ Mercer ขึ้นมาตามทางเดียวกัน ไม่ต้องมีคนส่งต่อ

#### English

And later, Vance. He only calls call_copilot. His own thread is empty, but the asset’s memory and Mercer’s finding come up the same road. **No human handoff.**

---

## 12 · With and without memory  (`3.15`)

### ไทย

ถามคำถามเดียวกันสองครั้ง ไม่มีความจำ: ไม่มีข้อมูลก่อนหน้า มีความจำ: ผลตรวจของ Mercer เกรด C 60 วัน

มันรู้ว่าเป็นสะพานเดียวกัน อ้างผลตรวจจริง ให้การดำเนินการที่เจาะจง และไม่เคยเห็นแชตส่วนตัวของใครเลย

โมเดลเดียวกัน คำถามเดียวกัน ต่างกันที่ความจำเท่านั้น

### English

Same question, asked twice. Without memory: no earlier information. With memory: Mercer’s finding, grade C, 60 days. It knows it is the same bridge, cites the real finding, gives a specific action, and never sees anyone’s private chats. Same model. Same question. Only the memory differs.

---

## 13 · The four failures, solved  (`3.15f`) · 4 clicks

### ไทย

กลับมาที่แก้วกันครับ จำสี่ปัญหาที่เราเห็นเมื่อกี้ได้ไหม ตอนนี้เรามี notebook ที่แก้ได้ทุกข้อแล้ว มาดูทีละข้อ

*▶ Next*

ปัญหาแรก **ปริมาณ** ที่ล้น extractor แก้ด้วยการเก็บเป็นบันทึกชิ้นเล็ก ๆ แทนที่จะกองทุกอย่างเข้ามา อยู่ที่ Part 3

*▶ Next*

ปัญหาที่สอง **ความเกี่ยวข้อง** การค้นหาที่มีกำแพง ทำให้เข้ามาเฉพาะผลตรวจของ Mercer ไม่มีขยะปนเข้ามา อยู่ที่ Part 4

*▶ Next*

ปัญหาที่สาม **ความถูกต้อง** ผลตรวจที่ลงนามแล้วเก็บ **25 เปอร์เซ็นต์** ไว้เป็นข้อเท็จจริงของมันเอง ไม่ถูกสรุปทิ้ง อยู่ที่ Part 4

*▶ Next*

และปัญหาสุดท้าย **จังหวะเวลา** เราดึงผลตรวจกลับมาใหม่ตอนที่ Vance ถามจริง ๆ อยู่ที่ Part 6 ครับ

### English

Back to the glass. Remember the four problems we saw earlier? Now we have a notebook that solves every one of them. Let us go through them.

*▶ Next*

The first problem, **volume**, the glass overflowing. The extractor solves it by keeping small records instead of piling everything in. That is Part 3.

*▶ Next*

The second, **relevance**. Search with walls means only Mercer's finding comes in, with no junk mixed in. That is Part 4.

*▶ Next*

The third, **accuracy**. The signed finding keeps the **25 percent** as a fact of its own, so it is not summarised away. Also Part 4.

*▶ Next*

And the last, **timing**. We fetch the finding again when Vance actually asks. That is Part 6.

---

## 14 · What you built  (`3.15c`)

### ไทย

และนี่คือแผนที่ความจำทั้งหมด: short-term และ long-term memory สามชนิด และความจำที่แบ่งกัน ส่วนใหญ่คุณสร้างวันนี้ด้วย oracleagentmemory ในฐานข้อมูลเดียว

เครื่องมือ workflow และ caching ปล่อยให้เป็นหน้าที่ของ agent framework ของคุณ

### English

And here is the full memory map. Short-term and long-term memory, the three kinds, and shared memory: most of it you built today with oracleagentmemory, in one database. Tools, workflows and caching are left to your agent framework.

---

## 15 · Where both labs meet  (`3.16`) · 3 clicks

### ไทย

และนี่คือจุดที่สอง Lab มาพบกันครับ ผมอยากให้เห็นว่า **ไม่มี Lab ไหนตัดสินใจได้เพียงลำพัง** เริ่มจากกฎของ Lab 2 อย่างเดียวก่อน กฎบอกว่าขีดจำกัดคือ 25 เปอร์เซ็นต์ แต่ถ้าไม่รู้ตัวเลขของสะพานนี้ ก็ตัดสินใจไม่ได้

*▶ Next*

ทีนี้ลองดูประวัติอย่างเดียว Mercer พบประมาณ 25 เปอร์เซ็นต์ แต่ถ้าไม่รู้ว่าขีดจำกัดคือเท่าไร ก็ตัดสินใจไม่ได้เช่นกัน

*▶ Next*

แต่พอเอามารวมกัน เกิน 25 เปอร์เซ็นต์ต้องตรวจสอบ และตัวเลขอยู่ที่ประมาณ 25 เปอร์เซ็นต์ AI agent จึง **ตัดสินใจได้**

*▶ Next*

และมันตัดสินใจร่วมกับ Vance สั่ง **ตรวจโครงสร้างทันที** ต้องมีทั้งสอง Lab ครับ

### English

And this is where both labs meet. I want you to see that **neither lab can decide alone**. Start with the rule from Lab 2 on its own. The rule says the limit is 25 percent. But without this bridge's number, it cannot decide.

*▶ Next*

Now look at the history on its own. Mercer found about 25 percent. But without knowing the limit, it cannot decide either.

*▶ Next*

But put them together: over 25 percent needs a review, and the number is about 25 percent. So the AI agent can **decide**.

*▶ Next*

And it decides together with Vance: order an **immediate structural review**. We need both labs.

---

## 16 · Lab 3 recap  (`3.17`)

### ไทย

นั่นคือ Lab 3: ความจำคือรากฐาน ไม่ใช่ฟีเจอร์ context window คือปัญหาของการคัดสรร และที่เก็บเดียวที่รวมทุกอย่างดีกว่าสี่บริการ มาดูภาพรวมของทั้งวัน

### English

That is Lab 3: memory is **the foundation**, not a feature; the context window is **a curation problem**; and **one converged store** beats four services. Now let us look at the whole day.

---

## 17 · Takeaways · all three labs  (`3.18`)

### ไทย

สามแล็บ สะพานเดียว ใน Lab 1 เราสร้างผู้ช่วย ใน Lab 2 มันกลายเป็น agent ใน Lab 3 มันเรียนรู้ที่จะจำ ใต้ทั้งสามแล็บคือ Oracle AI Database หนึ่งเดียว

### English

Three labs, one bridge. In Lab 1 we built **an assistant**, in Lab 2 it became **an agent**, in Lab 3 it learned to **remember**. Under all three, **one Oracle AI Database**.

---
