const fs = require("fs");

const dump = JSON.parse(fs.readFileSync("db_dump.json", "utf8"));

console.log("=== ALL SUBJECTS IN DB ===");
dump.subjects.forEach(s => {
  console.log(`ID: ${s._id} -> "${s.subject_name || s.name}"`);
});
