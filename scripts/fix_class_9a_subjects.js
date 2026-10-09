const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function fixClass9a() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const classesColl = db.collection("class");
  const cls9a = await classesColl.findOne({ $or: [{ classname: "9ა" }, { ID: "9ა" }] });

  if (!cls9a || !cls9a.calendar) {
    console.log("9ა class not found or has no calendar");
    await client.close();
    return;
  }

  // Derive unique subject-teacher pairs from its existing calendar
  const subToTeacherMap = new Map();
  cls9a.calendar.forEach(day => {
    if (!Array.isArray(day)) return;
    day.forEach(slot => {
      if (!slot) return;
      const subId = (slot.subject_id || slot.subject || "").toString();
      const teaId = (slot.teacher_id || slot.teacher || "").toString();
      if (subId && teaId && subId !== "null" && teaId !== "null") {
        if (!subToTeacherMap.has(subId)) {
          subToTeacherMap.set(subId, teaId);
        }
      }
    });
  });

  const subjectsList = [];
  subToTeacherMap.forEach((teaId, subId) => {
    subjectsList.push({
      subject_id: new ObjectId(subId),
      teacher_id: new ObjectId(teaId)
    });
  });

  console.log(`Setting ${subjectsList.length} subject-teacher pairs for 9ა...`);
  await classesColl.updateOne(
    { _id: cls9a._id },
    { $set: { subjects: subjectsList } }
  );

  await client.close();
}

fixClass9a().catch(console.error);
