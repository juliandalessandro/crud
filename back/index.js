const express = require("express");
const app = express();

app.use(express.json());

const db = require("./models");

const recordsRouter = require("./routes/Records");
app.use("/records", recordsRouter);

db.sequelize.sync().then(() => {
    app.listen (3001, () =>{
        console.log("Server running on port 3001.");
    });
});
    