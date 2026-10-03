const fs = require("fs");

const dump = JSON.parse(fs.readFileSync("db_dump.json", "utf8"));

function getId(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (val.$oid) return val.$oid;
  return String(val);
}

console.log("=== ALL SUBJECTS IN DB ===");
dump.subjects.forEach(s => {
  console.log(`ID: ${getId(s._id)} | Name: "${s.name}"`);
});

console.log("\n=== ALL TEACHERS IN DB ===");
dump.teachers.forEach(t => {
  console.log(`ID: ${getId(t._id)} | Name: "${t.name} ${t.surname}" | user_ID: "${t.user_ID}"`);
});

console.log("\n=== ALL CLASSES IN DB ===");
dump.classes.forEach(c => {
  console.log(`ID: ${getId(c._id)} | classname: "${c.classname}" | ID: "${c.ID}"`);
});
