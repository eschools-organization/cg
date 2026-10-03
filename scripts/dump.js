const { MongoClient } = require("mongodb");
const fs = require("fs");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function dump() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const classes = await db.collection("class").find({}).toArray();
  const subjects = await db.collection("subjects").find({}).toArray();
  const teachers = await db.collection("teachers").find({}).toArray();

  const data = {
    classes,
    subjects,
    teachers
  };

  fs.writeFileSync("db_dump.json", JSON.stringify(data, null, 2), "utf8");
  console.log("Dumped db_dump.json successfully.");
  await client.close();
}

dump().catch(console.error);
