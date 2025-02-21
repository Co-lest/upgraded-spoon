import mysql from "mysql";

let connectedToDatabase;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "reconnecting",
});

export function connectDatabase () {
    connection.connect((err) => {
        if (err) {
            console.error(`Failed to connect to database: ${err}`);
            connectedToDatabase = false;
            return connectedToDatabase;
        }
        connectedToDatabase = true;
        console.log("Connected to database!");
        return connectedToDatabase;
    });
}

export function insertUser () {
    connection.query(
        `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                \`username\` VARCHAR(100),
                \`name\` VARCHAR(100),
                \`password\` VARCHAR(200),
                \`school\` VARCHAR(200),
                \`interests\` VARCHAR(200),
                \`hometown\` VARCHAR(200)
            );
        `,
        (err, results) => {
        if (err) {
            console.error("Error creating table:", err);
            return;
        }
        }
    );
}