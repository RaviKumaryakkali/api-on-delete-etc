const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
module.exports = app;

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error:${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//Get players api

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT * FROM cricket_team ORDER BY player_id`;
  const dbResponse = await db.all(getPlayersQuery);
  response.send(
    dbResponse.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

// post player api

app.post("/players/", async (request, response) => {
  const playerDetails = request.body.playerId;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES ("${playerName}",
    ${jerseyNumber},
    "${role}")`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

// get a player by id

app.get("/players/:playerId/", async (request, response) => {
  const playerId = request.params.playerId;
  const getPlayerQuery = `
    SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//update a player

app.put("/players/:playerId/", async (request, response) => {
  const playerDetails = request.body.playerId;
  const playerId = request.params.playerId;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE cricket_team SET 
    "player_name":"Maneesh",
    "jersey_number":54,
    "role":"All-rounder"
    WHERE 
    player_id = ${playerID};`;

  await db.run(updatePlayerQuery);
  response.send("player Details Updated");
});

//DELETE a player

app.delete("/players/:playerId/", async (request, response) => {
  const playerDetails = request.body;
  const playerId = request.params.playerId;
  const deleteBookQuery = `
    DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  await db.run(deleteBookQuery);
  response.send("player Removed");
});
