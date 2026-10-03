const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

async function verify() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const classes = await db.collection("class").find({}).toArray();
  const subjects = await db.collection("subjects").find({}).toArray();
  const teachers = await db.collection("teachers").find({}).toArray();

  const subMap = {};
  subjects.forEach(s => subMap[s._id.toString()] = s.name || s.subject_name);

  const teaMap = {};
  teachers.forEach(t => teaMap[t._id.toString()] = `${t.name} ${t.surname}`);

  const days = ["ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი"];

  // Sort classes by grade order
  const order = ["1ა", "2ა", "3ა", "4ა", "5ა", "6ა", "7ა", "8ა", "9ა", "10ა", "11-12ა"];
  classes.sort((a, b) => order.indexOf(a.ID || a.classname) - order.indexOf(b.ID || b.classname));

  for (const c of classes) {
    const name = c.ID || c.classname;
    if (!order.includes(name)) continue;

    console.log(`\n==================================================`);
    console.log(`კლასი: ${name} (ID: ${c._id})`);
    console.log(`==================================================`);

    if (!c.calendar || c.calendar.length === 0) {
      console.log("  [კალენდარი ცარიელია]");
      continue;
    }

    c.calendar.forEach((daySlots, dIdx) => {
      console.log(`  📅 ${days[dIdx] || dIdx + 1}:`);
      if (!daySlots || daySlots.length === 0) {
        console.log("     - არ არის გაკვეთილები");
        return;
      }
      daySlots.forEach((slot, sIdx) => {
        if (!slot || (!slot.subject_id && !slot.teacher_id)) {
          console.log(`     ${sIdx + 1}. [თავისუფალი]`);
        } else {
          const sName = subMap[slot.subject_id.toString()] || "უცნობი საგანი";
          const tName = teaMap[slot.teacher_id.toString()] || "უცნობი მასწავლებელი";
          console.log(`     ${sIdx + 1}. ${sName} — ${tName}`);
        }
      });
    });
  }

  await client.close();
}

verify().catch(console.error);
