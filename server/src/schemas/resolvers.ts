import User, { UserDocument } from '../models/User.js';
import Book, { BookDocument } from '../models/Book.js';
import {signToken} from '../services/auth.js'
import { AuthenticationError } from '../services/auth.js';
const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any): Promise<UserDocument | null> => {
      if (context.user) {
        return await User.findById(context.user._id).populate('savedBooks');
      }
        throw new Error('You need to be logged in!');
    }
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string, password: string }): Promise<UserDocument | null> => {
      const user = await
        User.findOne({
            email,
            });
        if (!user) {
            throw new Error('Incorrect credentials');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
            throw new Error('Incorrect credentials');
        }
        return user;
    },
    addUser : async (_parent: any, args: { username: string, email: string, password: string }): Promise<{token:string, user: UserDocument}> => {
      const user = await User.create(args);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: any, { bookData }: { bookData: BookDocument }, context: any): Promise<UserDocument | null> => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('User not authenticated');
    },
    removeBook : async (_parent: any, { bookId }: { bookId: string }, context: any): Promise<UserDocument | null> => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new Error('You need to be logged in!');
    },
  },
};

export default resolvers;
