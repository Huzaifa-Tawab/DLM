const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require("cors");

// Initialize Firebase Admin SDK with the service account key
const serviceAccount = require("./Key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://console.firebase.google.com/project/dlm-webapp/database/dlm-webapp-default-rtdb/data/~2F",
  // Replace with your database URL
});

const app = express();
app.use(cors());

const port = 8080; // Choose a port for your server

app.use(bodyParser.json());

// Endpoint to create a new user
app.post("/createUser", async (req, res) => {
  const { email, password, uid } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      uid: uid,
    });
    // console.log("Successfully created new user:", userRecord.uid);
    res.status(200).json({ code: "success" });
  } catch (error) {
    // console.error("Error creating new user:", error);
    res.status(500).json({ code: error.code });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
