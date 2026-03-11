const Transaction = require("../models/transaction.model");
const Ledger = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

/**
 * - create new transaction
 *  The 10 step transfer the flow
 * validate the request body
 * check if from account exist
 * check if to account exist
 * check if from account have sufficient balance
 * create new transaction with pending status
 * create new ledger for from account with debit type
 * create new ledger for to account with credit type
 * update transaction status to completed
 * if any error occur update transaction status to failed and reverse the ledger entries
 */

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  // validate the request body
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  //check if transaction exist
  const isTransactionExist = await Transaction.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionExist) {
    if (isTransactionExist.status === "completed") {
      return res.status(200).json({
        message: "Transaction already exist",
        status: "success",
        data: isTransactionExist,
      });
    }
    if (isTransactionExist.status === "pending") {
      return res.status(200).json({
        message: "Transaction is pending",
        status: "pending",
        data: isTransactionExist,
      });
    }
    if (isTransactionExist.status === "failed") {
      return res.status(500).json({
        message: "Transaction already exist but failed",
        status: "failed",
        data: isTransactionExist,
      });
    }
    if (isTransactionExist.status === "reversed") {
      return res.status(200).json({
        message: "Transaction already exist but reversed",
        status: "success",
        data: isTransactionExist,
      });
    }
  }

  // check account status
  if (
    fromUserAccount.status !== "active" ||
    toUserAccount.status !== "active"
  ) {
    return res.status(400).json({
      message: "Account is not active",
    });
  }
  //derive sender balance from ledger
  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}.Required balance is ${amount}`,
    });
  }

  const transaction = await Transaction.create({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status: "pending",
  });

  await Ledger.create({
    account: toAccount,
    amount,
    transaction: transaction._id,
    type: "credit",
  });

  await Ledger.create({
    account: fromAccount,
    amount,
    transaction: transaction._id,
    type: "debit",
  });

  transaction.status = "completed";
  await transaction.save();

  // send email to sender and receiver
  emailService.sendEmail(
    fromUserAccount.user.email,
    "Transaction successful",
    `Your transaction of amount ${amount} to account ${toAccount} is successful.`,
  );
  emailService.sendEmail(
    toUserAccount.user.email,
    "Transaction successful",
    `You have received a transaction of amount ${amount} from account ${fromAccount}.`,
  );

  return res.status(201).json({
    message: "Transaction created successfully",
    status: "success",
    data: transaction,
  });
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  // validate the request body
  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const toUserAccount = await accountModel.findOne({ _id: toAccount });
  if (!toUserAccount) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  let fromuseraccount = await accountModel.findOne({
    user: req.user._id,
    status: "active",
  });

  if (!fromuseraccount) {
    fromuseraccount = await accountModel.create({
      user: req.user._id,
      status: "active",
    });
  }

  const transaction = new Transaction(
    {
      fromAccount: fromuseraccount._id,
      toAccount,
      amount,
      idempotencyKey,
      status: "pending",
    }
  );

  await transaction.save();

  await Ledger.create({
    account: toAccount,
    amount,
    transaction: transaction._id,
    type: "credit",
  });

  await Ledger.create({
    account: fromuseraccount._id,
    amount,
    transaction: transaction._id,
    type: "debit",
  });

  transaction.status = "completed";
  await transaction.save();

  return res.status(201).json({
    message: "Initial funds created successfully",
    transaction: transaction,
    status: "success",
  });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
