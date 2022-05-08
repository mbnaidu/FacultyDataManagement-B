require('./src/DB/DataBase');
const cors = require('cors')
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { spawn } = require('child_process')

dotenv.config();
const logOutput = (name) => (data) => console.log(`[${name}] ${data.toString()}`)

function run() {
    let user = [1, 2]
    const process = spawn('python', ['./src/Python/Script.py', user, 'babu']);
    process.stdout.on(
        'data',
        logOutput('stdout')
    );
    process.stderr.on(
        'data',
        logOutput('stderr')
    );
}
(() => {
    try {
        run()
        // process.exit(0)
    } catch (e) {
        console.error(e.stack);
        process.exit(1);
    }
})();
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