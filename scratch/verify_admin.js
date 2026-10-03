const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function main() {
  const uri = 'mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kakhati');
    const adminDoc = await db.collection('admins').findOne({ user_ID: 'admin' });
    console.log('Found Admin Doc:', adminDoc ? { name: adminDoc.name, user_ID: adminDoc.user_ID, role: adminDoc.role } : null);
    if (adminDoc) {
      const isMatch = await bcrypt.compare('admin', adminDoc.password);
      console.log('Password "admin" Match Result:', isMatch);
    }
  } finally {
    await client.close();
  }
}

main();
