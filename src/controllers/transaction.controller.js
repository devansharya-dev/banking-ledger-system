const Transaction = require("../models/transaction.model");
const Ledger = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");

/**
 * Create a transfer between two active accounts using an idempotency key.
 */
async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const fromUserAccount = await accountModel
    .findOne({ _id: fromAccount })
    .populate("user", "email name");
  const toUserAccount = await accountModel
    .findOne({ _id: toAccount })
    .populate("user", "email name");

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  // Repeated requests with the same client key should resolve to the same transaction outcome.
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

  if (
    fromUserAccount.status !== "active" ||
    toUserAccount.status !== "active"
  ) {
    return res.status(400).json({
      message: "Account is not active",
    });
  }

  // Balance is derived from immutable ledger entries, not stored directly on the account.
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

  // Notification failures are handled inside the email service and should not fail the API request.
  if (fromUserAccount.user?.email) {
    emailService.sendTransactionEmail(
      fromUserAccount.user.email,
      fromUserAccount.user.name || "User",
      amount,
      fromAccount,
      toAccount
    );
  }

  if (toUserAccount.user?.email) {
    emailService.sendTransactionEmail(
      toUserAccount.user.email,
      toUserAccount.user.name || "User",
      amount,
      fromAccount,
      toAccount
    );
  }

  return res.status(201).json({
    message: "Transaction created successfully",
    status: "success",
    data: transaction,
  });
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

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

  // Ensure the system user has an active source account before funding others.
  if (!fromuseraccount) {
    fromuseraccount = await accountModel.create({
      user: req.user._id,
      status: "active",
    });
  }

  const transaction = new Transaction({
    fromAccount: fromuseraccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "pending",
  });

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
