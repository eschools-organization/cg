import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function inspect() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const classes = await db.collection("class").find({}).toArray();
  const classesAlt = await db.collection("classes").find({}).toArray();
  const subjects = await db.collection("subjects").find({}).toArray();
  const teachers = await db.collection("teachers").find({}).toArray();

  console.log("--- CLASSES (class) --- count:", classes.length);
  classes.forEach(c => {
    console.log(`Class ID: ${c._id}, classname: ${c.classname}`);
    console.log(`  subjects count: ${c.subjects?.length || 0}`);
    console.log(`  subjects sample:`, JSON.stringify(c.subjects || []));
    console.log(`  calendar structure:`, Array.isArray(c.calendar) ? `${c.calendar.length} days` : typeof c.calendar);
    if (c.calendar && c.calendar.length > 0) {
      console.log(`  calendar day 0 sample:`, JSON.stringify(c.calendar[0]));
    }
  });

  console.log("--- CLASSES (classes) --- count:", classesAlt.length);
  classesAlt.forEach(c => {
    console.log(`Class ID: ${c._id}, classname: ${c.classname}`);
  });

  console.log("--- SUBJECTS --- count:", subjects.length);
  subjects.forEach(s => {
    console.log(`Subject ID: ${s._id}, name: ${s.name}`);
  });

  console.log("--- TEACHERS --- count:", teachers.length);
  teachers.forEach(t => {
    console.log(`Teacher ID: ${t._id}, user_ID: ${t.user_ID}, name: ${t.name} ${t.surname}, classes: ${JSON.stringify(t.classes)}`);
    if (t.calendar) {
      console.log(`  calendar: ${t.calendar.length} days`);
    }
  });

  await client.close();
}

inspect().catch(console.error);
