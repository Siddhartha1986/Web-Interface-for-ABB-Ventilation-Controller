const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./public/db/users.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the users database.');
});

// db.serialize(() => {
//   db.each(`SELECT userid as id,
//                   name as name
//            FROM users`, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log(row.id + "\t" + row.name);
//   });
// });

// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });

sql="select * from users";
db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
    // close the database connection
    db.close();
  });

  db.insert(sql, [], (err, rows) => {
  // insert one row into the langs table
  db.run(sql, [], (err, rows) => {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  // close the database connection
  db.close();
  });

  db.run(sql_create, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Création réussie de la table 'Livres'");
    db.run(sql_insert, err => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Alimentation réussie de la table 'Livres'");
    });
  });
  