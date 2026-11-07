import mongoose from 'mongoose';
import { AccountTypes } from '../../core/rbac/constants/roles.constants.js';

// why we use this type model bcz this is enterprise lvl model type architecture
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,  // this is string type we can change this string to number
      required: [true, 'Name is required'], // this is for error catching use
      trim: true, // here this example "  hamza@gmail.com    " -> "hamza@gmail.com"
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: null,
    },
    accountType: {
      type: String,
      enum: Object.values(AccountTypes),
      default: AccountTypes.SUB_ACCOUNT,
      required: true,
    },
    role: {
      type: String,
      default: null,
    },
    customRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomRole',
      default: null,
    },
    parentAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    metadata: {
      permissions: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ accountType: 1 });
userSchema.index({ status: 1 });
userSchema.index({ parentAccount: 1 });

const User = mongoose.model('User', userSchema);

export default User;