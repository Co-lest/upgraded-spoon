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
      const results = await query(
        `INSERT INTO users (username, name, password, school, interests, hometown) VALUES (?, ?, ?, ?, ?, ?)`,
        [obj.username, obj.name, obj.password, obj.school, obj.interests, obj.hometown]
      );
      console.log(`Data inserted successfully!`, results);
      return false;
    }
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err;
  }
}

export async function loginUser(obj) {
  try {
    const results = await query(`SELECT id FROM users WHERE username = ? AND password = ?`, [obj.username, obj.password]);

    if (results.length > 0) {
      console.log(`Username: ${obj.username} logged in!`);
      return true;
    } else {
    console.log(`Wrong password or username: ${obj.username}`);
    return false;
    }
  } catch (error) {
    console.error(`Error fetchin' log details!: ${error}`);
    throw error;
  }
}

// connection.end(); // call this function when user has finnished all the database connection I dont think the application will reach a time when this is needed
