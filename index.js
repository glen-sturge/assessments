const csv = require("csv-parser");
const mysql2 = require("mysql2");
const fs = require("fs");

const results = [];

// csv file name
const fileName = "./people-100000.csv";

async function readData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(fileName)
      .pipe(csv({}))
      .on("data", (data) => {
        let transformedData = [
          data["User Id"],
          data["First Name"],
          data["Last Name"],
          data["Sex"],
          data["Email"],
          data["Phone"],
          data["Date of birth"],
          data["Job Title"],
        ];
        results.push(transformedData);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function loadToMysql(results) {
  // Database credentials
  const hostname = "localhost";
  const username = "root";
  const password = "CB6N8gL2tB1pHRGNBqkA";
  const databaseName = "driven";

  // DB connection
  let db = mysql2.createConnection({
    host: hostname,
    user: username,
    password: password,
    database: databaseName,
  });

  db.connect((err) => {
    if (err) return console.error("error: " + err.message);

    db.query("DROP TABLE user", (err) => {
      if (err) {
        console.log(err);
      } else {
        //Query to create table "user"
        var createStatement =
          "CREATE TABLE user(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, user_id char(15), first_name char(50), last_name char(50), sex char(6), email char(50), phone char(50), date_of_birth DATE, job_title char(100))";

        db.query(createStatement, (err) => {
          if (err) console.log("Error: " + err);
        });

        let query =
          "INSERT INTO user (user_id, first_name, last_name, sex, email, phone, date_of_birth, job_title) VALUES ?";

        db.query(query, [results], (err, result) => {
          console.log(err || result);
          // Close the database connection
          db.end();
        });
      }
    });
  });
}

readData()
  .then((results) => loadToMysql(results))
  .catch((error) => console.log(error));
