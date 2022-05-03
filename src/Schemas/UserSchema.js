const mongoose = require('mongoose');
let usersSchema = new mongoose.Schema({
});

let UsersModel = mongoose.model('users', usersSchema);
const user = mongoose.model('users', usersSchema);
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '472472243625-v0ap7jnko2e6d21qpu1s6a05o6u4qlkj.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
//Adding new user
const users = [];
function upsert(array, item) {
    const i = array.findIndex((_item) => _item.email === item.email);
    if (i > -1) array[i] = item;
    else array.push(item);
}
user.addNewUser = async function (handlers) {
    const token = handlers.data.googleData.tokenId;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();
    upsert(users, { name, email, picture });
    return ({ name, email, picture })
};
module.exports = user;