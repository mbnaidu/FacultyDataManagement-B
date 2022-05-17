const mongoose = require('mongoose');
let studentDataSchema = new mongoose.Schema({
    section: String,
    year: Number,
    isPrev: { type: String, unique: true },
    students: Array,
    percentage: Number,
    male: Number,
    female: Number,
    malePercentage: Number,
    femalePercentage: Number,
    maleBacklogs: Number,
    femaleBacklogs: Number,
    presentSem: Array,
});

let studentDataModel = mongoose.model('studentData', studentDataSchema);
const studentData = mongoose.model('studentData', studentDataSchema);

//Updating studentsData
studentData.setNewStudentsData = function (handlers) {
    var studentsList = new studentDataModel();
    studentsList.section = handlers.section;
    studentsList.year = handlers.year;
    studentsList.isPrev = handlers.isPrev;
    studentsList.presentSem = handlers.presentSem;
    studentsList.students = handlers.students;
    studentsList.male = handlers.male;
    studentsList.female = handlers.female;
    studentsList.percentage = handlers.percentage;
    studentsList.malePercentage = handlers.malePercentage;
    studentsList.femalePercentage = handlers.femalePercentage;
    studentsList.maleBacklogs = handlers.maleBacklogs;
    studentsList.femaleBacklogs = handlers.femaleBacklogs;
    return studentsList.save(function (err, data) {
        if (!err) {
            handlers.success(data);
        } else {
            handlers.error(err);
        }
    })
};
module.exports = studentData;