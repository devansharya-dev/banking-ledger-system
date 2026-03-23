const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "Account is required"],
    index: true,
    immutable: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    immutable: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: [true, "Transaction is required"],
    index: true,
    immutable: true,
  },
  type: {
    type: String,
    enum: {
      values: ["credit", "debit"],
      message: "Type must be either credit or debit",
    },
    required: [true, "Type is required"],
    immutable: true,
  },
});

function validateLedgerEntry() {
  throw new Error(
    "Ledger entry is immutable and cannot be modified after creation"
  );
}

// Ledger rows are append-only so the transaction history remains auditable.
ledgerSchema.pre("findOneAndUpdate", validateLedgerEntry);
ledgerSchema.pre("deleteOne", validateLedgerEntry);
ledgerSchema.pre("remove", validateLedgerEntry);
ledgerSchema.pre("update", validateLedgerEntry);
ledgerSchema.pre("deleteMany", validateLedgerEntry);
ledgerSchema.pre("updateMany", validateLedgerEntry);
ledgerSchema.pre("updateOne", validateLedgerEntry);
ledgerSchema.pre("findOneAndReplace", validateLedgerEntry);

module.exports = mongoose.model("Ledger", ledgerSchema);
