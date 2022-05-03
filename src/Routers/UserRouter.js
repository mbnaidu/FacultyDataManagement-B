const express = require('express');
const router = express.Router();

const usersModel = require('../Schemas/UserSchema');

router.use(express.json());

router.post('/api/google-login', async (req, res) => {
    usersModel.addNewUser({
        success: function (data) { res.status(200).send(data) },
        error: function (err) { res.status(200).send(err) },
        data: req.body.data
    }).then((userData) => res.json(userData))
        .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;