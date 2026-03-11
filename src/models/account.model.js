const  mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 
const Ledger = require("./ledger.model");

const accountSchema = new mongoose.Schema({
     user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true
     },
     status:{
        type: String,
        enum: ["active", "inactive","suspended"],
        default: "active",
        required: [true, "Status is required"]
     },
     currency:{
        type: String,
        required: [true, "Currency is required"],
        default: "INR"
     },
     
},{
    timestamps: true
}) 

accountSchema.index({ user: 1 ,status: 1   })
accountSchema.methods.getBalance = async function() {
   const balancedata = await mongoose.model("Ledger").aggregate([
    { $match: { account: this._id } }, 
    {
         $group: {
            _id: null,
            totalDebit: { $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] } },
            totalCredit: { $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] } }
         },
         $project: {
            balance: { $subtract: ["$totalDebit", "$totalCredit"] }
         }
    }
   ]);

  if(balancedata.length === 0){
    return 0;
  }
  return balancedata[0].balance;
}


const accountModel = mongoose.model("Account",accountSchema);

module.exports = accountModel;