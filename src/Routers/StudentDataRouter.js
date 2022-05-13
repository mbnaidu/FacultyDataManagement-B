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
router.post('/upload', upload.single('file'), function (req, res) {
    function run() {
        let extract_pages = [89, 90, 91, 92, 93, 94, 95, 96, 97]
        const process = spawn('python', ['./src/Python/Script.py', extract_pages, is_PDF]);
        process.stdout.on('data', function (stdData) {
            outputText = stdData.toString('utf8')
            outputText = JSON.parse(outputText);
            genderData = outputText.splice(-1)
            // console.log('+++++', genderData[0].male)
            if (!is_PDF) {
                studentDataModel.setNewStudentsData({
                    success: function (data) { res.status(200).send(data) },
                    error: function (err) { res.status(200).send(err) },
                    section: req.body.section,
                    year: req.body.year,
                    isPrev: req.body.isPrev,
                    students: outputText,
                    male: genderData[0].male,
                    female: genderData[0].female
                });
            }
            else {
                res.json()
            }
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