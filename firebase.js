var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://forevermark-forum-b2944.firebaseio.com",
});

const db = admin.firestore();

module.exports = db;
