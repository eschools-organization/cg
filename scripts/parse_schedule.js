const fs = require("fs");

const dump = JSON.parse(fs.readFileSync("db_dump.json", "utf8"));

function getId(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (val.$oid) return val.$oid;
  if (val.toString) return val.toString();
  return String(val);
}

const subjectsMap = {};
dump.subjects.forEach(s => {
  subjectsMap[getId(s._id)] = s.name;
});

const teachersMap = {};
dump.teachers.forEach(t => {
  teachersMap[getId(t._id)] = `${t.name} ${t.surname}`;
});

console.log("=== SUBJECTS ===");
Object.entries(subjectsMap).forEach(([id, name]) => console.log(`${id}: ${name}`));

console.log("\n=== CLASSES ===");
dump.classes.forEach(c => {
  const cId = getId(c._id);
  console.log(`\n-----------------------------------------`);
  console.log(`Classname: "${c.classname}" (ID: ${cId})`);
  console.log("Subjects:");
  if (c.subjects) {
    c.subjects.forEach(s => {
      const sName = subjectsMap[getId(s.subject_id)] || s.subject_id;
      const tName = teachersMap[getId(s.teacher_id)] || s.teacher_id;
      console.log(`  - [${sName}] taught by [${tName}], hours_per_week: ${s.hours_per_week}`);
    });
  }
  console.log("Calendar:");
  if (c.calendar) {
    c.calendar.forEach((day, dIdx) => {
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      const slots = day.map(slot => {
        if (!slot || (!slot.subject_id && !slot.teacher_id)) return "---";
        const sName = subjectsMap[getId(slot.subject_id)] || slot.subject_id;
        const tName = teachersMap[getId(slot.teacher_id)] || slot.teacher_id;
        return `${sName} (${tName})`;
      });
      console.log(`  ${dayNames[dIdx] || dIdx}: ${slots.join(" | ")}`);
    });
  }
});
