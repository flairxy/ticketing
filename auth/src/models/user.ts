import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";
//An interface that describes the properties required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

//An interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//An interface that describes the properties that a user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  //here we're defining how our response will look like.
  toJSON: {
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v
    }
  }
});

userSchema.pre("save", async function (done) {
  // we use the function keyword instead of the arrow function since we want our "this" to point to the document
  //using the arrow function will make "this" equal to the context of the entire file
  if (this.isModified("password")) {
    const hash = await PasswordManager.toHash(this.get("password")); //get the user's password and pass it to hash
    this.set("password", hash);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
