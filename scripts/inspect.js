const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function inspect() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const classes = await db.collection("class").find({}).toArray();
  const subjects = await db.collection("subjects").find({}).toArray();
  const teachers = await db.collection("teachers").find({}).toArray();

  console.log("=== CLASSES ===");
  classes.forEach(c => {
    console.log(`Class: ${c.classname} (ID: ${c._id})`);
    console.log(`  Subjects in class: ${c.subjects ? c.subjects.length : 0}`);
    if (c.subjects) {
      c.subjects.forEach(s => console.log(`    subjId: ${s.subject_id}, teacherId: ${s.teacher_id}, hours: ${s.hours_per_week}`));
    }
    console.log(`  Calendar: ${c.calendar ? c.calendar.length : 0} days`);
    if (c.calendar) {
      c.calendar.forEach((day, dIdx) => {
        const desc = day.map(slot => slot ? `${slot.subject_id}/${slot.teacher_id}` : 'empty').join(', ');
        console.log(`    Day ${dIdx}: ${desc}`);
      });
    }
  });

  console.log("\n=== SUBJECTS ===");
  subjects.forEach(s => {
    console.log(`Subject: ${s.name} (ID: ${s._id})`);
  });

  console.log("\n=== TEACHERS ===");
  teachers.forEach(t => {
    console.log(`Teacher: ${t.name} ${t.surname} (ID: ${t._id}, user_ID: ${t.user_ID}), classes: ${JSON.stringify(t.classes)}`);
  });

  await client.close();
}

inspect().catch(console.error);
