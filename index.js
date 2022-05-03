// require('./src/DB');
const cors = require('cors')
const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const usersRoute = require('./src/Routers/UserRouter');

app.use(cors())
app.use(usersRoute);


//PORT which listens
// app.listen(3001);
app.listen(process.env.PORT || 3001, () => {
    console.log(
        `Server is ready at http://localhost:${process.env.PORT || 3001}`
    );
});