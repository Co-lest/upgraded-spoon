import mysql from "mysql";

let connectedToDatabase;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "reconnecting",
});

export async function connectDatabase() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error(`Failed to connect to database: ${err}`);
        connectedToDatabase = false;
        reject(connectedToDatabase);
        return;
      }
      connectedToDatabase = true;
      console.log("Connected to database!");
      resolve(connectedToDatabase);
    });
  });
}

export function insertUser(obj) {
  const checkIfExists = `SELECT id FROM users WHERE username = ?`;
  let doesUserExist = false;
  connection.query(checkIfExists, [obj.username], (err, results) => {
    if (err) {
      console.log(`Error checking if user exists: ${err}`);
      return err;
    } else if (results.length > 0) {
      doesUserExist = true;
      console.log(`ok this should work`);
      return true;
    }
  });

  console.log(`Does user exist: ${doesUserExist}`);

  if (!doesUserExist) {
    const insertQuery = `
      INSERT INTO users (username, name, password, school, interests, hometown)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    connection.query(
      insertQuery,
      [
        obj.username,
        obj.name,
        obj.password,
        obj.school,
        obj.interests,
        obj.hometown,
      ],
      (err, results) => {
        if (err) {
          console.error(`Error inserting data: ${err}`);
          return err;
        }
        console.log(`Data inserted succesfully!`);
      }
    );
  }
}

export async function loginUser(obj) {
  const searchUser = `SELECT id FROM users WHERE username = ? AND password = ?`;

  connection.query(
    searchUser,
    [obj.username, obj.password],
    (error, results, fields) => {
      if (error) {
        console.error(`Error fetching data!: ${err}`);
        return;
      }

      if (results.length > 0) {
        console.log(`${results[0]}`);
        return true;
      } else {
        console.log(`Either user does not exist or wrong password!`);
        return false;
      }
    }
  );
}

// connection.end(); // call this function when user has finnished all the database connection I dont think the application will reach a time when this is needed
