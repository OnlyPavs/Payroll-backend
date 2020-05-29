const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PayrollSchema = new mongoose.Schema(
  {
    empId: {
      type: Number,
      required: true,
    },
    month: {
      type: Date,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PayrollSchema.plugin(AutoIncrement, { inc_field: 'payId', start_seq: 10 });
const Payroll = mongoose.model('Payroll', PayrollSchema);

module.exports = Payroll;
