const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  console.log("=== SUBJECTS ===");
  const subjects = await db.collection("subjects").find({}).toArray();
  subjects.forEach(s => console.log(`${s._id} | ${s.name}`));

  console.log("\n=== TEACHERS ===");
  const teachers = await db.collection("teachers").find({}).toArray();
  teachers.forEach(t => console.log(`${t._id} | ${t.name} | user_ID: ${t.user_ID}`));

  console.log("\n=== CLASSES ===");
  const classes = await db.collection("class").find({}).toArray();
  classes.forEach(c => console.log(`${c._id} | ID: ${c.ID} | classname: ${c.classname}`));

  await client.close();
}

run().catch(console.error);
