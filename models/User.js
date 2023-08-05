const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);


/**
 * Password hash middleware.
 */
// userSchema.pre('save', async function save(next) {
//   const user = this;
//   if (!user.isModified('password')) { return next(); }
//   try {
//     user.password = await bcrypt.hash(user.password, 10);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

/**
 * Helper method for validating user's password.
 */
// userSchema.methods.comparePassword = async function comparePassword(candidatePassword, cb) {
//   try {
//     cb(null, await bcrypt.verify(candidatePassword, this.password));
//   } catch (err) {
//     cb(err);
//   }
// };

// name of collection and schema
const User = new mongoose.model("User", UserSchema);

module.exports = User;