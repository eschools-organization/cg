const fs = require("fs");

const dump = JSON.parse(fs.readFileSync("db_dump.json", "utf8"));

console.log("Subjects raw:", JSON.stringify(dump.subjects.slice(0, 10), null, 2));
