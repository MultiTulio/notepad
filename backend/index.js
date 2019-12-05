const express = require("express");
const app = express();
const port = 3001;

const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database(":memory:");
const moment = require("moment");

db.serialize(function() {
  db.run("CREATE TABLE category (id INTEGER PRIMARY KEY, name TEXT)");
  db.run(
    "CREATE TABLE note (id INTEGER PRIMARY KEY, time TEXT, text TEXT, categoryId INT)"
  );
});
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
app.use(cors());
app.use(express.json());
app.post("/addNote", (req, res) => {
  const date = moment().format("DD/MM/YYYY HH:mm:ss");
  //   console.log(date);
  db.run(
    "INSERT INTO note (time, text, categoryId) VALUES (?, ?, ?)",
    [date, req.body.text, req.body.categoryId],
    function(err) {
      res.send({
        id: this.lastID,
        time: date,
        text: req.body.text,
        categoryId: req.body.categoryId
      });
    }
  );
  //   console.log(req.body.text);
});

app.get("/listCategory/:id", (req, res) => {
  db.all(
    "SELECT id, text, time FROM note WHERE categoryId = (?) ORDER BY time DESC",
    [req.params.id],
    function(err, rows) {
      if (err) console.error(err);
      else {
        console.log(rows);
        res.send({ notes: rows });
      }
    }
  );
});

app.get("/listCategoriesWithNotes", (req, res) => {
  db.all(
    "SELECT category.*, note.id AS noteId, note.text, note.time FROM category LEFT JOIN note ON category.id = note.categoryId ORDER BY note.time DESC",
    [req.params.id],
    function(err, rows) {
      if (err) console.error(err);
      else {
        const resultDictionary = {};
        console.log(rows);
        rows.forEach(row => {
          if (row.id in resultDictionary) {
            resultDictionary[row.id].notes.push({
              id: row.noteId,
              text: row.text,
              time: row.time
            });
          } else {
            resultDictionary[row.id] = {
              id: row.id,
              name: row.name,
              notes: row.noteId
                ? [
                    {
                      id: row.noteId,
                      text: row.text,
                      time: row.time
                    }
                  ]
                : []
            };
          }
        });
        res.send({
          categories: Object.keys(resultDictionary).map(
            key => resultDictionary[key]
          )
        });
      }
    }
  );
});

app.post("/addCat", (req, res) => {
  db.run("INSERT INTO category (name) VALUES (?)", [req.body.catData], function(
    err
  ) {
    res.send({ id: this.lastID, name: req.body.catData });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
