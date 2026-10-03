const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function setGradeEntryDate() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const startDate = "2026-09-15";

  console.log(`Setting gradeEntryStartDate to "${startDate}" for all teachers...`);

  const result = await db.collection("teachers").updateMany(
    {},
    { $set: { gradeEntryStartDate: startDate } }
  );

  console.log(`✅ Updated ${result.modifiedCount} / ${result.matchedCount} teachers successfully.`);

  await client.close();
}

setGradeEntryDate().catch(console.error);
