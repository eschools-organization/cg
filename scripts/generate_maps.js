const fs = require("fs");

const dump = JSON.parse(fs.readFileSync("db_dump.json", "utf8"));

function getId(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (val.$oid) return val.$oid;
  return String(val);
}

console.log("=== SUBJECTS MATCHING ===");
dump.subjects.forEach(s => {
  console.log(`"${s.subject_name || s.name}": ObjectId("${getId(s._id)}")`);
});

console.log("\n=== TEACHERS MATCHING ===");
dump.teachers.forEach(t => {
  console.log(`"${t.name} ${t.surname}": ObjectId("${getId(t._id)}")`);
});

console.log("\n=== CLASSES MATCHING ===");
dump.classes.forEach(c => {
  console.log(`"${c.ID || c.classname}": ObjectId("${getId(c._id)}")`);
});
