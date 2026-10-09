const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const classes = await db.collection("class").find({}).toArray();

  for (const c of classes) {
    if (!c.calendar || !Array.isArray(c.calendar)) continue;

    // Create a map from subject_id (string) -> teacher_id (ObjectId/string) for this class
    const subToTeacherMap = new Map();
    if (Array.isArray(c.subjects)) {
      c.subjects.forEach(s => {
        if (s.subject_id && s.teacher_id) {
          subToTeacherMap.set(s.subject_id.toString(), s.teacher_id);
        }
      });
    }

    c.calendar.forEach((day, dIdx) => {
      if (!Array.isArray(day)) return;
      day.forEach((slot, sIdx) => {
        if (!slot) return;
        console.log(`Class ${c.classname || c.ID}, Day ${dIdx+1}, Slot ${sIdx+1}:`, JSON.stringify(slot));
      });
    });
  }

  await client.close();
}

run().catch(console.error);
