require('./src/DB/DataBase');
const cors = require('cors')
const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const usersRoute = require('./src/Routers/UserRouter');
const studentRoute = require('./src/Routers/StudentDataRouter');
const readFileRoute = require('./src/Routers/ReadFileRouter');

app.use(cors())
app.use(usersRoute);
app.use(studentRoute);
app.use(readFileRoute);

app.listen(process.env.PORT || 3001, () => {
    console.log(
        `Server is ready at http://localhost:${process.env.PORT || 3001}`
    );
});