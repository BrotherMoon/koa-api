const userModel = require('../models/user.model');
module.exports = {
    getAllUser: async function (ctx) {
        try {
            const data = await userModel.find();
            console.log(data);
            ctx.body = data;
        } catch (e) {
            console.error(e);
        }
    },
    insert: async function () {
        const newUser = new userModel({
            name: 'h',
            nickname: 'haha'
        })
        newUser.save((err, re) => {
            err ? console.error(err) : console.log(re)
        })
    }
}