const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function check() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const teachers = await db.collection("teachers").find({}).toArray();
  console.log("Teachers gradeEntryStartDate sample:");
  teachers.forEach(t => {
    console.log(`${t.name} ${t.surname}: gradeEntryStartDate = ${t.gradeEntryStartDate}`);
  });

  await client.close();
}

check().catch(console.error);
