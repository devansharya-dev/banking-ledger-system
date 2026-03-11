const accountModel = require("../models/account.model");

async function createAccount(req,res){
const userId = req.user._id;

const account = await accountModel.create({user: userId}); 

res.status(201).json({
    message:"Account created successfully",
    status:"success",
    data: account
});
}

module.exports = {
    createAccount   
}
