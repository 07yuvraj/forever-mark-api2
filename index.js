const express = require("express");
const cors = require("cors");
var admin = require("firebase-admin");

// const db = require("./firebase");
const db = require("./firebase");
const app = express();

app.use(cors());
app.use(express.json());

// let usersCount = [];

app.get("/", (req, res) => {
  res.send("Hello world");
});

// app.get("/userByRoles", (req, res) => {
//   const docId = "v5Q9EekXM0Y6MVtMve6E";
//   const docRef = db.collection("roles").doc(docId);
//   console.log(docRef);
//   docRef.get().then((docu1) => {
//     console.log(docu1.data());
//     if (docu1.exists) {
//       db.collection("users")
//         .where("roles", "==", [docRef])
//         .get()
//         .then((querySnapshot) => {
//           querySnapshot.docs.forEach((docu) => {
//             let user = docu.data();
//             console.log(docu.data());
//           });
//           //   console.log(querySnapshot.docs);
//           //   res.send(querySnapshot.data());
//           res.send("done");
//         });
//     }
//   });
// });

app.get("/allVisitors", (req, res) => {
  console.log("/allVisitors");
  const docId = "v5Q9EekXM0Y6MVtMve6E";
  //   const docId = "15IbkdPjS0yvoIRPsv67";
  const docRef = db.collection("roles").doc(docId);
  docRef.get().then((doc) => {
    if (doc.exists) {
      let visitors = [];
      db.collection("users")
        .where("roles", "==", [docRef])
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((docu) => {
            const fieldValues = docu.data();
            let visitor = [
              fieldValues.firstName + " " + fieldValues.lastName,
              fieldValues.email,
              fieldValues.mobileNumber,
              fieldValues.companyName,
              fieldValues.designation,
              fieldValues.city,
              docu.id,
            ];
            // console.log(visitor);
            visitors.push(visitor);
          });
          res.send(visitors);
        });
    }
  });
});

app.get("/getVisitor/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.collection("users").doc(id).get();
  const fields = result.data();
  //   console.log(fields);
  //   res.send(fields);

  //   approvalStatus: false,
  //     firstName,
  //     lastName,
  //     email: req.body.email,
  //     designation: req.body.designation,
  //     mobileNumber: req.body.phone,
  //     companyName: req.body.organization,
  //     city,
  //     roles: [docRef],
  //     emailUpdates: false,
  //     whatsAppUpdates: true,
  //     createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  //     updatedAt: null,

  const fullName = fields.firstName + " " + fields.lastName;
  var address = fields.city.split(", ");
  const data = {
    fullName: fullName,
    email: fields.email,
    phone: fields.mobileNumber,
    organization: fields.companyName,
    designation: fields.designation,
    city: address[0],
    state: address[1],
    country: address[2],
    id: id,
  };
  //   const data = {
  //     meetingLink: fields.meetingLink,
  //     email: fields.email,
  //     name: fields.name,
  //     boothName: booth.data().boothName,
  //   };
  res.send(data);
});

app.post("/updateVisitor", async (req, res) => {
  const id = req.body.id;
  const userRef = db.collection("users").doc(id);
  const name = req.body.name;
  const nameArray = name.split(" ");
  const firstName = nameArray[0];
  const lastName = nameArray[1];
  const city = req.body.city + ", " + req.body.state + ", " + req.body.country;
  const data = {
    firstName,
    lastName,
    email: req.body.email,
    designation: req.body.designation,
    mobileNumber: req.body.phone,
    companyName: req.body.organization,
    city,
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  console.log(data);
  const result = await userRef.update(data);
  res.sendStatus(200);
});

app.get("/allRepresentatives", (req, res) => {
  console.log("/allRepresentatives");
  db.collection("vcs")
    .get()
    .then((snap) => {
      let reps = [];
      snap.forEach((user) => {
        const fieldValue = user.data();
        const a = [
          fieldValue.name,
          fieldValue.email,
          fieldValue.meetingLink,
          user.id,
        ];
        reps.push(a);
      });
      res.send(reps);
    });
});

app.get("/getRepresentative/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.collection("vcs").doc(id).get();

  //   console.log(result.data());
  const fields = result.data();
  const booth = await fields.boothReference.get();
  console.log(booth.data());
  const data = {
    meetingLink: fields.meetingLink,
    email: fields.email,
    name: fields.name,
    boothName: booth.data().boothName,
  };
  res.send(data);
});

app.post("/updateRepresentative", async (req, res) => {
  console.log("/updateRepresentative");
  const id = req.body.id;
  const userRef = db.collection("vcs").doc(id);
  const docName = req.body.boothName;
  const docRef = db.collection("booths").doc(docName);
  const data = {
    name: req.body.name,
    email: req.body.email,
    meetingLink: req.body.meetLink,
    phone: req.body.phone,
    brandName: req.body.brand,
    boothReference: docRef,
  };
  console.log(data);
  const result = await userRef.update(data);
  res.sendStatus(200);
});

// How to use reference field

// app.get("/allExhibitors", (req, res) => {
//   const docId = "NyZghxv2okfysZGQFvuH";
//   const docRef = db.collection("roles").doc(docId);
//   docRef.get().then((doc) => {
//     if (doc.exists) {
//       let exhibitors = [];
//       db.collection("users")
//         .where("roles", "==", [docRef])
//         .get()
//         .then((querySnapshot) => {
//           querySnapshot.docs.forEach((docu) => {
//             const fieldValues = docu.data();
//             let exhibitor = [
//               fieldValues.firstName + " " + fieldValues.lastName,
//               fieldValues.email,
//               fieldValues.mobileNumber,
//               fieldValues.companyName,
//               fieldValues.designation,
//               fieldValues.city,
//             ];
//             // console.log(exhibitor);
//             exhibitors.push(exhibitor);
//           });
//           res.send(exhibitors);
//         });
//     }
//   });
// });

app.get("/countUsers", (req, res) => {
  db.collection("users")
    .get()
    .then((snap) => {
      var size = snap.size;
      res.send({ length: size });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.get("/countVisitors", (req, res) => {
  const docId = "v5Q9EekXM0Y6MVtMve6E";
  //   const docId = "15IbkdPjS0yvoIRPsv67";
  const docRef = db.collection("roles").doc(docId);
  docRef.get().then((doc) => {
    if (doc.exists) {
      let visitors = [];
      db.collection("users")
        .where("roles", "==", [docRef])
        .get()
        .then((querySnapshot) => {
          var size = querySnapshot.size;
          res.send({ visitors: size });
        });
    }
  });
});

app.get("/countRepresentatives", (req, res) => {
  db.collection("vcs")
    .get()
    .then((snap) => {
      var size = snap.size;
      res.send({ representativesCount: size });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

// app.get("/userTypeCounts", (req, res) => {
//   // representatives
//   let usersCount = [];
//   db.collection("vcs")
//     .get()
//     .then((snap) => {
//       var size = snap.size;
//       let a = {
//         name: "Representatives",
//         value: size,
//         color: "primary",
//       };
//       usersCount.push(a);
//       const docId = "v5Q9EekXM0Y6MVtMve6E";
//       const docRef = db.collection("roles").doc(docId);
//       docRef
//         .get()
//         .then((doc) => {
//           if (doc.exists) {
//             let visitors = [];
//             db.collection("users")
//               .where("roles", "==", [docRef])
//               .get()
//               .then((querySnapshot) => {
//                 var size = querySnapshot.size;
//                 let b = {
//                   name: "Visitors",
//                   value: size,
//                   color: "secondary",
//                 };
//                 usersCount.push(b);
//                 db.collection("booths")
//                   .get()
//                   .then((snap2) => {
//                     var size = snap2.size;
//                     let c = {
//                       name: "Exhibitors",
//                       value: size,
//                       color: "warning",
//                     };
//                     usersCount.push(c);
//                     res.send(usersCount);
//                   })
//                   .catch((err) => {
//                     res.sendStatus(500);
//                   });
//               });
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//           res.sendStatus(500);
//         });
//     })
//     .catch((err) => {
//       res.sendStatus(500);
//     });

//   // visitors

//   // exhibitors
// });

app.get("/userTypeCounts", async (req, res) => {
  var dbPromises = [];
  var usersCount = [];
  var totalUsers = 0;
  dbPromises.push(db.collection("vcs").get());
  dbPromises.push(db.collection("users").get());
  dbPromises.push(db.collection("booths").get());
  const [representatives, visitors, exhibitors] = await Promise.all(dbPromises);
  let c = {
    name: "Exhibitors",
    value: exhibitors.size,
    color: "warning",
  };
  usersCount.push(c);
  let a = {
    name: "Representatives",
    value: representatives.size,
    color: "primary",
  };
  usersCount.push(a);
  let b = {
    name: "Visitors",
    value: visitors.size,
    color: "secondary",
  };
  usersCount.push(b);
  console.log(usersCount);
  totalUsers = representatives.size + exhibitors.size + visitors.size;
  res.json({ usersCount: usersCount, totalUsers: totalUsers });
});

app.post("/addVisitor", async (req, res) => {
  //d6rJjJDoNXePJ7sUgDFz
  //tpXxSUa6wQDurb6SjbI0
  //   console.log(req.body);
  const docId = "v5Q9EekXM0Y6MVtMve6E";
  const docRef = db.collection("roles").doc(docId);
  const name = req.body.name;
  const nameArray = name.split(" ");
  const firstName = nameArray[0];
  const lastName = nameArray[1];
  const city = req.body.city + ", " + req.body.state + ", " + req.body.country;
  const data = {
    approvalStatus: false,
    firstName,
    lastName,
    email: req.body.email,
    designation: req.body.designation,
    mobileNumber: req.body.phone,
    companyName: req.body.organization,
    city,
    roles: [docRef],
    emailUpdates: false,
    whatsAppUpdates: true,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    updatedAt: null,
  };
  console.log(data);

  const result = await db.collection("users").add(data);
  console.log(result.id);
  res.sendStatus(200);
});

app.post("/addRepresentative", async (req, res) => {
  // cIIuEh3DSvyQpClQM2e0
  const docName = req.body.boothName;
  const docRef = db.collection("booths").doc(docName);

  const name = req.body.name + ", " + req.body.brand;
  const data = {
    name,
    email: req.body.email,
    meetingLink: req.body.meetLink,
    phone: req.body.phone,
    boothReference: docRef,
  };
  console.log(data);
  const result = await db.collection("vcs").add(data);
  console.log(result.id);
  res.sendStatus(200);
});

app.get("/getBooths", (req, res) => {
  console.log("/getBooths");
  db.collection("booths")
    .get()
    .then((snap) => {
      let booths = [];
      snap.forEach((booth) => {
        const fieldValue = booth.data();
        // const a = [fieldValue.boothName, fieldValue.email, fieldValue.meetingLink];
        booths.push(fieldValue.boothName);
      });
      res.send(booths);
    });
});

const port = process.env.PORT || "3001";

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Server running on port ${port}`);
});
