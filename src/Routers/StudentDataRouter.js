const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
var is_PDF = true;
const studentDataModel = require('../Schemas/StudentDataSchema.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Assets/')
    },
    filename: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.originalname.includes('pdf')) {
            is_PDF = true
            cb(null, 'results.pdf')
        }
        else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.originalname.includes('xlsx' || 'xls' || 'csv')) {
            is_PDF = false
            cb(null, 'studentsList.xlsx')
        }
    },
})

const upload = multer({ storage: storage })
router.post('/uploadStudentDataExcel', upload.single('file'), function (req, res) {
    function run() {
        const process = spawn('python', ['./src/Python/StudentExcel.py']);
        process.stdout.on('data', function (stdData) {
            outputText = stdData.toString('utf8');
            outputText = JSON.parse(outputText);
            // console.log('+++++', genderData[0].male)
            studentDataModel.setNewStudentsData({
                success: function (data) { res.status(200).send(data) },
                error: function (err) { res.status(200).send(err) },
                section: req.body.section,
                year: req.body.year,
                isPrev: req.body.isPrev,
                students: outputText,
                presentSem: [],
                male: outputText.filter((student) => student.gender === ('M' || 'Male' || 'male' || 'm')).length,
                female: outputText.filter((student) => student.gender === ('F' || 'Female' || 'female' || 'f')).length,
                percentage: outputText.filter((student) => (student.backlogs === 0)).length,
                malePercentage: outputText.filter((student) => (student.gender === ('M' || 'Male' || 'male' || 'm') && student.backlogs === 0)).length,
                femalePercentage: outputText.filter((student) => (student.gender === ('F' || 'Female' || 'female' || 'f') && student.backlogs === 0)).length,
                maleBacklogs: outputText.filter((student) => (student.gender === ('M' || 'Male' || 'male' || 'm') && student.backlogs !== 0)).length,
                femaleBacklogs: outputText.filter((student) => (student.gender === ('F' || 'Female' || 'female' || 'f') && student.backlogs !== 0)).length,
            });
        });
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

router.post('/uploadResultPDF', upload.single('file'), function (req, res) {
    function run() {
        let extract_pages = [89, 90, 91, 92, 93, 94, 95, 96, 97]
        const process = spawn('python', ['./src/Python/StudentPDF.py', extract_pages]);
        process.stdout.on('data', function (stdData) {
            if (typeof stdData.toString() === 'string')
                studentDataModel.findOne({ isPrev: req.body.isPrev })
                    .then((item) => {
                        var spawn = require('child_process').spawn,
                            py = spawn('python', ['./src/Python/StudentResult.py', req.body.semNumber]),
                            data = item
                        dataString = '';
                        py.stdout.on('data', function (data) {
                            dataString += data.toString();
                        });
                        py.stdout.on('end', function () {
                            let output = JSON.parse(dataString)
                            studentDataModel.findOneAndUpdate({ isPrev: req.body.isPrev }, { students: output.students, maleBacklogs: output.maleBacklogs, femaleBacklogs: output.femaleBacklogs, presentSem: output.presentSem })
                                .then()
                                .catch(err => console.log('Error: ' + err));
                        });
                        py.stdin.write(JSON.stringify(data));
                        py.stdin.end();
                        res.sendStatus(200)
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
        });
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

router.post('/uploadSupplyPDF', upload.single('file'), function (req, res) {
    function run() {
        let extract_pages = [3]
        const process = spawn('python', ['./src/Python/StudentPDF.py', extract_pages]);
        process.stdout.on('data', function (stdData) {
            if (typeof stdData.toString() === 'string') {
                studentDataModel.findOne({ isPrev: req.body.isPrev })
                    .then((item) => {
                        var spawn = require('child_process').spawn,
                            py = spawn('python', ['./src/Python/StudentSupply.py', req.body.semNumber, req.body.isSupply, req.body.noOfAttempts]),
                            data = item
                        dataString = '';
                        py.stdout.on('data', function (data) {
                            dataString += data.toString();
                        });
                        py.stdout.on('end', function () {
                            let output = JSON.parse(dataString)
                            studentDataModel.findOneAndUpdate({ isPrev: req.body.isPrev }, { students: output.students, maleBacklogs: output.maleBacklogs, femaleBacklogs: output.femaleBacklogs, presentSem: output.presentSem })
                                .then((item) => console.log(item))
                                .catch(err => console.log('Error: ' + err));
                        });
                        py.stdin.write(JSON.stringify(data));
                        py.stdin.end();
                        res.sendStatus(200)
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        });
        process.stdout.on('end', function () {
            console.log('end');
        });
        process.stdin.end();
    };
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
router.get('/getAllStudents', function (req, res) {
    studentDataModel.find({}).then(function (categories) {
        res.send(categories);
    });
});

// GETTING BY SECTION
router.post('/getbysection', (req, res) => {
    studentDataModel.find({ section: req.body.data.section })
        .then((item) => { if (item.length > 0) { res.json(item) } else { res.json(null) } })
        .catch(err => res.status(400).json('Error: ' + err));
});
// GETTING BY SECTION
router.post('/getbyyear', (req, res) => {
    studentDataModel.find({ year: req.body.data.year })
        .then((item) => { if (item) { res.json(item) } else { res.send(null) } })
        .catch(err => res.status(400).json('Error: ' + err));
});
// GETTING BY SECTION
router.post('/getbysectionandyear', (req, res) => {
    studentDataModel.find({ section: req.body.data.section, year: req.body.data.year })
        .then((item) => res.json(item))
        .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;