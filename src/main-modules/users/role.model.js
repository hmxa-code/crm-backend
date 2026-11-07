import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'CUSTOM',
    },
    permissions: [
      {
        type: String,
      },
    ],
    status: {
      type: Number,
      enum: [0, 1], // 0 = Disabled, 1 = Active
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

roleSchema.index({ role_name: 1 });
roleSchema.index({ type: 1 });

const CustomRole = mongoose.model('CustomRole', roleSchema);

export default CustomRole;
