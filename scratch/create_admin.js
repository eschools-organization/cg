const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function main() {
  const uri = 'mongodb+srv://kakhiweinrooneykakhidze_db_user:AL6ZBiEZ6tk%402L4@small.r76sze8.mongodb.net/kakhati';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kakhati');
    const hashedPassword = await bcrypt.hash('admin', 10);
    const adminUser = {
      name: 'Admin',
      surname: 'User',
      user_ID: 'admin',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    await db.collection('admins').updateOne({ user_ID: 'admin' }, { $set: adminUser }, { upsert: true });
    await db.collection('users').updateOne({ user_ID: 'admin' }, { $set: adminUser }, { upsert: true });
    console.log('✅ Admin user successfully added/updated with user_ID: "admin" and password: "admin"');
  } catch (err) {
    console.error('❌ Error adding admin:', err);
  } finally {
    await client.close();
  }
}

main();
