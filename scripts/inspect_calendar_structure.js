const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const classes = await db.collection("class").find({}).toArray();

  let unassignedSlotsCount = 0;
  let totalSlotsCount = 0;

  for (const c of classes) {
    console.log(`\nClass: ${c.classname || c.ID} (_id: ${c._id})`);
    if (!c.calendar || !Array.isArray(c.calendar)) {
      console.log("  No calendar found.");
      continue;
    }

    let classUnassigned = 0;
    c.calendar.forEach((day, dIdx) => {
      if (!Array.isArray(day)) return;
      day.forEach((slot, sIdx) => {
        if (!slot) return;
        totalSlotsCount++;
        const subId = slot.subject_id || slot.subject;
        const teaId = slot.teacher_id || slot.teacher;
        if (!teaId || teaId.toString() === "" || teaId.toString() === "null") {
          classUnassigned++;
          unassignedSlotsCount++;
          console.log(`  Day ${dIdx+1}, Slot ${sIdx+1}: Subject ID ${subId}, Teacher ID: ${teaId}`);
        }
      });
    });

    if (classUnassigned === 0) {
      console.log("  All calendar slots have assigned teachers.");
    } else {
      console.log(`  -> ${classUnassigned} slots missing teacher!`);
    }
  }

  console.log(`\nTOTAL: ${unassignedSlotsCount} slots missing teacher out of ${totalSlotsCount} total slots.`);
  await client.close();
}

run().catch(console.error);
