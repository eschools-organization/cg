const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function testTeacherLogin() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const teachers = await db.collection("teachers").find({}).toArray();
  const classes = await db.collection("class").find({}).toArray();

  console.log(`Found ${teachers.length} teachers and ${classes.length} classes.`);

  teachers.slice(0, 5).forEach(t => {
    const teacherId = t._id.toString();
    const teacherUserId = t.user_ID || t.ID || teacherId;
    
    // Check teaches classes
    const teaches = classes.filter(cls =>
      Array.isArray(cls.subjects) &&
      cls.subjects.some(subj =>
        subj.teacher_id && (
          subj.teacher_id.toString() === teacherId ||
          subj.teacher_id.toString() === teacherUserId
        )
      )
    );

    console.log(`Teacher ${t.name} (${t.user_ID || t.ID}): teaches in ${teaches.length} classes [${teaches.map(c => c.classname || c.ID).join(", ")}]`);
  });

  await client.close();
}

testTeacherLogin().catch(console.error);
