const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function autoAssignTeachers() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log("Connected to MongoDB.");

  const classesColl = db.collection("class");
  const classes = await classesColl.find({}).toArray();

  let totalUpdatedSlots = 0;

  for (const c of classes) {
    if (!c.calendar || !Array.isArray(c.calendar)) continue;

    // Create a map from subject_id (string) -> teacher_id (ObjectId) for this class
    const subToTeacherMap = new Map();
    if (Array.isArray(c.subjects)) {
      c.subjects.forEach(s => {
        if (s.subject_id && s.teacher_id) {
          subToTeacherMap.set(s.subject_id.toString(), s.teacher_id);
        }
      });
    }

    let classModified = false;
    let classUpdatedSlots = 0;

    const newCalendar = c.calendar.map((day, dIdx) => {
      if (!Array.isArray(day)) return day;

      return day.map((slot, sIdx) => {
        if (!slot) return slot;

        // Check if subject_id is present
        const subIdStr = (slot.subject_id || slot.subject || "").toString().trim();
        if (!subIdStr || subIdStr === "null" || subIdStr === "undefined") {
          return slot; // Empty lesson slot
        }

        const currentTeaIdStr = (slot.teacher_id || slot.teacher || "").toString().trim();
        const expectedTeacherId = subToTeacherMap.get(subIdStr);

        if (expectedTeacherId) {
          const expectedTeaIdStr = expectedTeacherId.toString();

          // If missing teacher_id OR teacher_id does not match the class's assigned teacher for this subject
          if (!currentTeaIdStr || currentTeaIdStr === "null" || currentTeaIdStr === "undefined" || currentTeaIdStr !== expectedTeaIdStr) {
            console.log(`[Class ${c.classname || c.ID}] Day ${dIdx+1} Slot ${sIdx+1}: Subject ${subIdStr} updated teacher from '${currentTeaIdStr}' to '${expectedTeaIdStr}'`);
            classModified = true;
            classUpdatedSlots++;
            totalUpdatedSlots++;

            return {
              ...slot,
              subject_id: ObjectId.isValid(subIdStr) ? new ObjectId(subIdStr) : subIdStr,
              teacher_id: ObjectId.isValid(expectedTeaIdStr) ? new ObjectId(expectedTeaIdStr) : expectedTeaIdStr
            };
          }
        } else {
          console.warn(`[Class ${c.classname || c.ID}] Day ${dIdx+1} Slot ${sIdx+1}: Subject ${subIdStr} has no teacher mapping in class.subjects!`);
        }

        return slot;
      });
    });

    if (classModified) {
      await classesColl.updateOne(
        { _id: c._id },
        { $set: { calendar: newCalendar } }
      );
      console.log(`✅ Updated Class ${c.classname || c.ID}: fixed ${classUpdatedSlots} calendar slots.`);
    } else {
      console.log(`Class ${c.classname || c.ID}: All populated calendar slots already have correct teachers.`);
    }
  }

  console.log(`\n🎉 COMPLETED! Updated total ${totalUpdatedSlots} calendar slots with correct teachers.`);
  await client.close();
}

autoAssignTeachers().catch(console.error);
