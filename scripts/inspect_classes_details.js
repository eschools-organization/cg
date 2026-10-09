const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function inspect() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  console.log("=== CLASSES 1ა, 2ა, 3ა, 6ა, 7ა ===");
  const classes = await db.collection("class").find({
    classname: { $in: ["1ა", "2ა", "3ა", "6ა", "7ა"] }
  }).toArray();

  classes.forEach(c => {
    console.log(`\nCLASS: ${c.classname} (_id: ${c._id})`);
    console.log("Subjects count:", c.subjects ? c.subjects.length : 0);
    console.log("Sample subjects:", JSON.stringify(c.subjects?.slice(0, 3), null, 2));
  });

  await client.close();
}

inspect().catch(console.error);
