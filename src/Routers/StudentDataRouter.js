const express = require('express');
const router = express.Router();

const studentDataModel = require('../Schemas/StudentDataSchema.js');

router.use(express.json());

// ADDING A NEW CATEGORY
router.post('/setNewStudentsData', (req, res) => {
    studentDataModel.setNewStudentsData({
        success: function (data) { res.status(200).send(data) },
        error: function (err) { res.status(200).send(err) },
        branch: req.body.data.branch,
        year: req.body.data.year,
        isPrev: req.body.data.isPrev,
        students: req.body.data.students,
    });
});
module.exports = router;