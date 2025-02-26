import mysql from "mysql";
import { promisify } from "util";

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

const query = promisify(connection.query).bind(connection);

export async function insertUser(obj) {
  try {
    const results = await query(`SELECT id FROM users WHERE username = ?`, [obj.username]);

    if (results.length > 0) {
      console.log(`User already exists.`);
      return true;
    } else {
      await query(
        `INSERT INTO users (username, name, password, school, interests, hometown) VALUES (?, ?, ?, ?, ?, ?)`,
        [obj.username, obj.name, obj.password, obj.school, obj.interests, obj.hometown]
      );
      console.log(`Data inserted successfully!`);
      return false;
    }
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err;
  }
}

export async function loginUser(obj) {

  const results = await query(`SELECT id FROM users WHERE username = ? AND password = ?`);

  if (results.length > 0) {
    console.log(`Username: ${obj.username} logged in!`);
    return true;
  } 
  console.log(`Wrong password: ${obj.username}`);


  // const searchUser = `SELECT id FROM users WHERE username = ? AND password = ?`;

  // connection.query(
  //   searchUser,
  //   [obj.username, obj.password],
  //   (error, results, fields) => {
  //     if (error) {
  //       console.error(`Error fetching data!: ${err}`);
  //       return;
  //     }

  //     if (results.length > 0) {
  //       console.log(`${results[0]}`);
  //       return true;
  //     } else {
  //       console.log(`Either user does not exist or wrong password!`);
  //       return false;
  //     }
  //   }
  // );
}

// connection.end(); // call this function when user has finnished all the database connection I dont think the application will reach a time when this is needed
