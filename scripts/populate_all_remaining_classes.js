const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati";
const dbName = "kakhati";

// Subject IDs
const SUB = {
  MATEMATIKA: "633b5a65464f1ed48074de63",
  KARTULI: "633b5a60464f1ed48074de5f",
  KHELOVNEBA: "633b5a74464f1ed48074de6b",
  BUNEBA: "633b5a6d464f1ed48074de67",
  SAGVTO: "633b5a8f464f1ed48074de7d",
  CHADRAKI: "633b5a97464f1ed48074de85",
  MUSIKA: "633b5a8c464f1ed48074de79",
  SPORTI: "633b5a93464f1ed48074de81",
  INGLISURI: "633b5a88464f1ed48074de75",
  IST: "633b5a9a464f1ed48074de89",
  ME_DA_SAZ: "633b5aab464f1ed48074de99",
  GEOGRAFIA: "633b5ac8464f1ed48074dea5",
  FIZIKA: "633b5a9f464f1ed48074de91",
  ISTORIA: "633b5a9c464f1ed48074de8d",
  QIMIA: "633b5aa1464f1ed48074de95",
  SAQ_ISTORIA: "633b5add464f1ed48074dead",
  GERMANULI: "633b5ad2464f1ed48074dea9",
  SAMOQALAQO: "633b5ae3464f1ed48074deb1",
  BIOLOGIA: "633b5ac3464f1ed48074dea1",
  RUSULI: "633b5ab8464f1ed48074de9d",
  CHVENI_SAQ: "65186d9d2a2a68aa6dd16471",
  PR_KHELOVNEBA: "658a96e78304ce99986001e5",
  PR_MUSIKA: "660fc8cddaaedf520aaa2ec8"
};

// Teacher Data
const TEACHER_DATA = {
  EDITA_KANKIA: { id: "6338650b6d84152e4c8181d9", name: "ედიტა ჭანქია", user_ID: "19001055079" },
  LINDA_BERULAVA: { id: "68d849430a0eae68961fe362", name: "ლინდა ბერულავა", user_ID: "19001106517" },
  ALIKA_SHEDANIA: { id: "6852c6f64b85da4633c2dfa5", name: "ალიკა შელანია", user_ID: "19001091864" },
  IZA_MANIA: { id: "6338650b6d84152e4c8181d1", name: "იზა შანია", user_ID: "19001029755" },
  NATA_BUCXRIKIDZE: { id: "6338650b6d84152e4c8181df", name: "ნატა ბუცხრიკიძე", user_ID: "19001103223" },
  NINO_KAKULIA: { id: "66f44d0bb1ddd4ff34683cb7", name: "ნინო კაკულია", user_ID: "19001058019" },
  LALI_XORGUANI: { id: "66f44c19e0b16f797a4874e9", name: "ლალი ხორგუანი", user_ID: "19001049436" },
  TAMRIKO_CHURGULIA: { id: "6338650b6d84152e4c8181dd", name: "თამრიკო ჭურღულია", user_ID: "19001056005" },
  NANI_GUGUCHIA: { id: "66f25ffeb38d255e8daacbb8", name: "ნანი გუგუჩია", user_ID: "19001090139" },
  TAMUNA_LUKAVA: { id: "66f2701962e7946949bb7c4c", name: "თამუნა ლუკავა", user_ID: "62809011523" },
  NATELA_CHAXAIA: { id: "66f26940214dada53ec6ca6a", name: "ნათელა ჩახაია", user_ID: "19001010623" },
  SOFIO_BESHIA: { id: "6338650b6d84152e4c8181db", name: "სოფიო ბეშია", user_ID: "19001011350" },
  ANA_TODUA: { id: "65af99bda0c853921fc5ab9c", name: "ანა თოდუა", user_ID: "19001004072" },
  TAMILA_KVIRKVELIA: { id: "65af9b5ca0c853921fc5b724", name: "თამილა კვირკველია", user_ID: "62001004799" },
  TAMUNA_XUFENIA: { id: "6338650b6d84152e4c8181ed", name: "თამუნა ხუფენია", user_ID: "19001013905" },
  MIRZA_CXOLARIA: { id: "66e5a328b8cc599633e833f8", name: "მირზა ჩხოლარია", user_ID: "19001102860" },
  RAMIN_KVARACXELIA: { id: "66f06d6a5891503847b7c869", name: "რამინ კვარაცხელია", user_ID: "62001038582" },
  RATI_GARDAVA: { id: "6ac0902359a6f2238af0c2e7", name: "რატი გარდავა", user_ID: "19001109979" },
  INGA_TURAVA: { id: "66f25cba96f32d749f741230", name: "ინგა ტურავა", user_ID: "19001016327" },
  NANA_BICHIA: { id: "66f2f01b553e0da0b6a6acff", name: "ნანა ბიჭია", user_ID: "62001032121" },
  NINO_KHORAVA: { id: "6338650b6d84152e4c8181d7", name: "ნინო ხორავა", user_ID: "48001023728" },
  NANA_QIRIA: { id: "6338650b6d84152e4c8181e7", name: "ნანა ქირია", user_ID: "19001035049" },
  CIRA_BIGVAVA: { id: "6338650b6d84152e4c8181d3", name: "ცირა ბიგვავა", user_ID: "19001048773" }
};

function pair(subId, teaObj) {
  return {
    subject_id: new ObjectId(subId),
    teacher_id: new ObjectId(teaObj.id)
  };
}

async function updateAllRemaining() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log("Connected to MongoDB.");

  const classesColl = db.collection("class");
  const teachersColl = db.collection("teachers");
  const subjectsColl = db.collection("subjects");

  // Ensure "არჩევითი - მედიაწიგნიერება" exists in subjects collection
  let mediaSub = await subjectsColl.findOne({ name: "არჩევითი - მედიაწიგნიერება" });
  if (!mediaSub) {
    const res = await subjectsColl.insertOne({ name: "არჩევითი - მედიაწიგნიერება" });
    mediaSub = { _id: res.insertedId };
    console.log(`Created new subject 'არჩევითი - მედიაწიგნიერება' with ID ${mediaSub._id}`);
  }

  // Update Nana Qiria and Tsira Bigvava info
  await teachersColl.updateOne({ _id: new ObjectId(TEACHER_DATA.NANA_QIRIA.id) }, { $set: { name: TEACHER_DATA.NANA_QIRIA.name, user_ID: TEACHER_DATA.NANA_QIRIA.user_ID } });
  await teachersColl.updateOne({ _id: new ObjectId(TEACHER_DATA.CIRA_BIGVAVA.id) }, { $set: { name: TEACHER_DATA.CIRA_BIGVAVA.name, user_ID: TEACHER_DATA.CIRA_BIGVAVA.user_ID } });

  const classSubjectsMap = {
    "4ა": [
      pair(SUB.MATEMATIKA, TEACHER_DATA.CIRA_BIGVAVA),
      pair(SUB.MUSIKA, TEACHER_DATA.TAMILA_KVIRKVELIA),
      pair(SUB.SPORTI, TEACHER_DATA.CIRA_BIGVAVA),
      pair(SUB.ME_DA_SAZ, TEACHER_DATA.ANA_TODUA),
      pair(SUB.KARTULI, TEACHER_DATA.CIRA_BIGVAVA),
      pair(SUB.SAGVTO, TEACHER_DATA.ALIKA_SHEDANIA),
      pair(SUB.KHELOVNEBA, TEACHER_DATA.NANI_GUGUCHIA),
      pair(SUB.INGLISURI, TEACHER_DATA.TAMRIKO_CHURGULIA),
      pair(SUB.BUNEBA, TEACHER_DATA.CIRA_BIGVAVA),
      pair(SUB.IST, TEACHER_DATA.RATI_GARDAVA)
    ],
    "5ა": [
      pair(SUB.MATEMATIKA, TEACHER_DATA.NANA_QIRIA),
      pair(SUB.KARTULI, TEACHER_DATA.NATA_BUCXRIKIDZE),
      pair(SUB.CHVENI_SAQ, TEACHER_DATA.LALI_XORGUANI),
      pair(SUB.IST, TEACHER_DATA.RATI_GARDAVA),
      pair(SUB.SAGVTO, TEACHER_DATA.MIRZA_CXOLARIA),
      pair(SUB.INGLISURI, TEACHER_DATA.TAMRIKO_CHURGULIA),
      pair(SUB.RUSULI, TEACHER_DATA.TAMUNA_LUKAVA),
      pair(SUB.GERMANULI, TEACHER_DATA.NATELA_CHAXAIA),
      pair(SUB.BUNEBA, TEACHER_DATA.TAMUNA_XUFENIA),
      pair(SUB.KHELOVNEBA, TEACHER_DATA.NANI_GUGUCHIA),
      pair(SUB.MUSIKA, TEACHER_DATA.TAMILA_KVIRKVELIA),
      pair(SUB.SPORTI, TEACHER_DATA.TAMUNA_LUKAVA)
    ],
    "8ა": [
      pair(SUB.GEOGRAFIA, TEACHER_DATA.TAMUNA_XUFENIA),
      pair(SUB.FIZIKA, TEACHER_DATA.RAMIN_KVARACXELIA),
      pair(SUB.MATEMATIKA, TEACHER_DATA.NANA_QIRIA),
      pair(SUB.INGLISURI, TEACHER_DATA.NANA_BICHIA),
      pair(SUB.SPORTI, TEACHER_DATA.NINO_KHORAVA),
      pair(SUB.KARTULI, TEACHER_DATA.NINO_KHORAVA),
      pair(SUB.MUSIKA, TEACHER_DATA.TAMILA_KVIRKVELIA),
      pair(SUB.QIMIA, TEACHER_DATA.SOFIO_BESHIA),
      pair(SUB.SAGVTO, TEACHER_DATA.MIRZA_CXOLARIA),
      pair(SUB.ISTORIA, TEACHER_DATA.LALI_XORGUANI),
      pair(SUB.KHELOVNEBA, TEACHER_DATA.NANI_GUGUCHIA),
      pair(SUB.GERMANULI, TEACHER_DATA.NATELA_CHAXAIA),
      pair(SUB.SAMOQALAQO, TEACHER_DATA.ANA_TODUA),
      pair(SUB.BIOLOGIA, TEACHER_DATA.SOFIO_BESHIA)
    ],
    "10ა": [
      pair(SUB.GERMANULI, TEACHER_DATA.NATELA_CHAXAIA),
      pair(SUB.SAMOQALAQO, TEACHER_DATA.ANA_TODUA),
      pair(SUB.SAQ_ISTORIA, TEACHER_DATA.LALI_XORGUANI),
      pair(SUB.INGLISURI, TEACHER_DATA.TAMRIKO_CHURGULIA),
      pair(SUB.MATEMATIKA, TEACHER_DATA.NANA_QIRIA),
      pair(SUB.QIMIA, TEACHER_DATA.SOFIO_BESHIA),
      pair(SUB.BIOLOGIA, TEACHER_DATA.SOFIO_BESHIA),
      pair(SUB.GEOGRAFIA, TEACHER_DATA.TAMUNA_XUFENIA),
      pair(SUB.FIZIKA, TEACHER_DATA.RAMIN_KVARACXELIA),
      pair(SUB.SPORTI, TEACHER_DATA.MIRZA_CXOLARIA),
      pair(SUB.PR_KHELOVNEBA, TEACHER_DATA.NANI_GUGUCHIA),
      pair(SUB.RUSULI, TEACHER_DATA.TAMUNA_LUKAVA),
      pair(SUB.KARTULI, TEACHER_DATA.NINO_KHORAVA),
      pair(SUB.SAGVTO, TEACHER_DATA.MIRZA_CXOLARIA)
    ],
    "11ა": [
      pair(SUB.ISTORIA, TEACHER_DATA.LALI_XORGUANI),
      pair(SUB.SAQ_ISTORIA, TEACHER_DATA.LALI_XORGUANI),
      pair(SUB.GEOGRAFIA, TEACHER_DATA.TAMUNA_XUFENIA),
      pair(SUB.KARTULI, TEACHER_DATA.NATA_BUCXRIKIDZE),
      pair(SUB.FIZIKA, TEACHER_DATA.RAMIN_KVARACXELIA),
      pair(SUB.QIMIA, TEACHER_DATA.SOFIO_BESHIA),
      pair(SUB.BIOLOGIA, TEACHER_DATA.SOFIO_BESHIA),
      { subject_id: mediaSub._id, teacher_id: new ObjectId(TEACHER_DATA.INGA_TURAVA.id) },
      pair(SUB.MATEMATIKA, TEACHER_DATA.NANA_QIRIA),
      pair(SUB.SAMOQALAQO, TEACHER_DATA.ANA_TODUA),
      pair(SUB.SAGVTO, TEACHER_DATA.MIRZA_CXOLARIA),
      pair(SUB.INGLISURI, TEACHER_DATA.TAMRIKO_CHURGULIA),
      pair(SUB.RUSULI, TEACHER_DATA.TAMUNA_LUKAVA),
      pair(SUB.SPORTI, TEACHER_DATA.MIRZA_CXOLARIA),
      pair(SUB.PR_MUSIKA, TEACHER_DATA.TAMILA_KVIRKVELIA)
    ]
  };

  for (const [classCode, subjectsList] of Object.entries(classSubjectsMap)) {
    const clsQuery = classCode === "11ა" 
      ? { $or: [{ classname: "11ა" }, { classname: "11-12ა" }, { ID: "11ა" }, { ID: "11-12ა" }] }
      : { $or: [{ classname: classCode }, { ID: classCode }] };

    const clsDoc = await classesColl.findOne(clsQuery);

    if (!clsDoc) {
      console.error(`Class ${classCode} not found!`);
      continue;
    }

    console.log(`\nUpdating Class ${classCode} (_id: ${clsDoc._id}) with ${subjectsList.length} subjects...`);

    await classesColl.updateOne(
      { _id: clsDoc._id },
      { $set: { subjects: subjectsList } }
    );

    for (const subItem of subjectsList) {
      const teacherId = subItem.teacher_id;
      const teacherDoc = await teachersColl.findOne({ _id: teacherId });

      if (teacherDoc) {
        let teacherClasses = teacherDoc.classes || [];
        let clsEntry = teacherClasses.find(tc => tc.class_id && tc.class_id.toString() === clsDoc._id.toString());
        if (!clsEntry) {
          clsEntry = {
            class_id: clsDoc._id.toString(),
            subjects: [{ subject_id: subItem.subject_id.toString() }]
          };
          teacherClasses.push(clsEntry);
        } else {
          if (!clsEntry.subjects) clsEntry.subjects = [];
          const exists = clsEntry.subjects.some(s => s.subject_id === subItem.subject_id.toString());
          if (!exists) {
            clsEntry.subjects.push({ subject_id: subItem.subject_id.toString() });
          }
        }
        await teachersColl.updateOne(
          { _id: teacherId },
          { $set: { classes: teacherClasses } }
        );
      }
    }
  }

  console.log("\n✅ All remaining classes (4ა, 5ა, 8ა, 10ა, 11ა) updated successfully!");
  await client.close();
}

updateAllRemaining().catch(console.error);
