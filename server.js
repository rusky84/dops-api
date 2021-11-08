const express = require("express");

const cors = require("cors");
const dbConfig = require("./app/config/db.config.js");

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));


// Express v4.16.0 and higher - body parser part of express
// --------------------------
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

// For Express version less than 4.16.0
// ------------------------------------
// const bodyParser = require("body-parser");
// Body parser - deprecieated 
// parse requests of content-type - application/json
// app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

//
const db = require("./app/models");
const Role = db.role;


// MongoDB database connector to - Cloud cluster.
db.mongoose
  .connect(`mongodb+srv://${dbConfig.USER}:${dbConfig.PASS}@clusterops.vyk67.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Express API." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
        descr: "Base credentials for user access"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
/*
      new Role({
        name: "moderator",
        descr: "Not in use"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });
*/
      new Role({
        name: "admin",
        descr: "Full administration access"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });

      new Role({
        name: "global",
        descr: "Global report access"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'global' to roles collection");
      });

      new Role({
        name: "dau",
        descr: "Digga Australia report access"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'dau' to roles collection");
      });

      new Role({
        name: "dna",
        descr: "Digga North America report access"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'dna' to roles collection");
      });

      new Role({
        name: "duk",
        descr: "Digga UK report access"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'duk' to roles collection");
      });

    }
  });
}
