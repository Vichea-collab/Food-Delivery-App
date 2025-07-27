import { MongoClient } from "mongodb";
const uri = "mongodb+srv://Vichea:099505752@cluster0.gknlelz.mongodb.net/QuickEats";
const client = new MongoClient(uri);

const admin = {
  email: "admin@gmail.com",
  password: "$2b$10$7.JkHiPaUSAUow60czPip.FHhCpdEgcAbihJdJmDaeugr/XI8vbl2",
  role: "admin"
};

async function run() {
  try {
    await client.connect();
    const db = client.db("QuickEats");
    const users = db.collection("users");
    await users.insertOne(admin);
    console.log("Admin user inserted!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);