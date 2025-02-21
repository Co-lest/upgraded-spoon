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

export function insertUser (obj) {
    const insertQuery = `
    INSERT INTO users (username, name, password, school, interests, hometown)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  connection.query(insertQuery, [
    obj.username,
    obj.name,
    obj.password,
    obj.school,
    obj.interests,
    obj.hometown
  ], (err, results) => {
    if (err) {
        console.error(`Error inserting data: ${err}`);
        return;
    }
    console.log(`Data inserted succesfully!`);
    // connection.end();
  });
}