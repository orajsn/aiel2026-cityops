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

## 11 · The code, on one map  (`3.6m`) · 18 clicks

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

นั่นคือ Lab 3: ความจำคือรากฐาน ไม่ใช่ฟีเจอร์ context window คือปัญหาของการคัดสรร และที่เก็บเดียวที่รวมทุกอย่างดีกว่าสี่บริการ ก่อนทำควิซ มาดูภาพรวมของทั้งวัน

### English

That is Lab 3: memory is **the foundation**, not a feature; the context window is **a curation problem**; and **one converged store** beats four services. Before the quiz, let us look at the whole day.

---

## 17 · Takeaways · all three labs  (`3.18`)

### ไทย

สามแล็บ สะพานเดียว ใน Lab 1 เราสร้างผู้ช่วย ใน Lab 2 มันกลายเป็น agent ใน Lab 3 มันเรียนรู้ที่จะจำ ใต้ทั้งสามแล็บคือ Oracle AI Database หนึ่งเดียว

ตอนนี้สแกนโค้ดเพื่อทำควิซ ห้านาที ผ่านที่ 80 เปอร์เซ็นต์ และได้รับ badge

### English

Three labs, one bridge. In Lab 1 we built **an assistant**, in Lab 2 it became **an agent**, in Lab 3 it learned to **remember**. Under all three, **one Oracle AI Database**. Now scan the code for the quiz: five minutes, 80 percent to pass, and a badge.

---
