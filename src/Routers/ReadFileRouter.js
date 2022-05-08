const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
var is_PDF = true;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Assets/')
    },
    filename: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.originalname.includes('pdf')) {
            is_PDF = true
            cb(null, 'results.pdf')
        }
        else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.originalname.includes('xlsx' || 'xls')) {
            is_PDF = false
            cb(null, 'studentsList.xlsx')
        }
    },
})

const upload = multer({ storage: storage })

const logOutput = (name) => (data) => console.log(`[${name}] ${data.toString()}`)

router.post('/upload', upload.single('file'), function (req, res) {
    res.json({})

    function run() {
        let user = [89, 90, 91, 92, 93, 94, 95, 96, 97]
        const process = spawn('python', ['./src/Python/Script.py', user, is_PDF]);
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
});
module.exports = router;