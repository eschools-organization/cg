const fs = require("fs");

const dump = JSON.parse(fs.readFileSync("db_dump.json", "utf8"));

dump.classes.forEach((c, idx) => {
  console.log(`Index ${idx}: _id=${c._id}, ID=${c.ID}, classname=${c.classname}, name=${c.name}`);
});
