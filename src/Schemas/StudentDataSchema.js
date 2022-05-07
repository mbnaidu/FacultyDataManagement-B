const mongoose = require('mongoose');
let studentDataSchema = new mongoose.Schema({
    branch: String,
    year: Number,
    isPrev: { type: String, unique: true },
    students: Array,
});

let studentDataModel = mongoose.model('studentData', studentDataSchema);
const studentData = mongoose.model('studentData', studentDataSchema);

//Updating studentsData
studentData.setNewStudentsData = function (handlers) {
    var studentsList = new studentDataModel();
    studentsList.branch = handlers.branch;
    studentsList.year = handlers.year;
    studentsList.isPrev = handlers.isPrev;
    studentsList.students = handlers.students;
    return studentsList.save(function (err, data) {
        if (!err) {
            handlers.success(data);
        } else {
            handlers.error(err);
        }
    })
};
module.exports = studentData;