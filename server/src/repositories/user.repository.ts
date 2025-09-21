import { User, UserDocument } from "../models/user.model";

export const UserRepository = {
  findByEmail(email: string) {
    return User.findOne({ email });
  },

  findById(id: string) {
    return User.findById(id);
  },

  create(data: Partial<UserDocument>) {
    return User.create(data);
  }
};
