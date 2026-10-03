const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function fixSubjects() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const subjects = await db.collection("subjects").find({}).toArray();

  for (const s of subjects) {
    const sName = s.subject_name || s.name || "";
    if (sName) {
      await db.collection("subjects").updateOne(
        { _id: s._id },
        {
          $set: {
            name: sName,
            subject_name: sName
          }
        }
      );
    }
  }

  console.log(`✅ Ensured both 'name' and 'subject_name' fields exist on all ${subjects.length} subjects in MongoDB.`);
  await client.close();
}

fixSubjects().catch(console.error);
