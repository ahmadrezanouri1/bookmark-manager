// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Bookmark, BookmarkDocument } from './schemas/bookmark.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Bookmark.name)
    private readonly bookmarkModel: Model<BookmarkDocument>, // Check provider name here
    private readonly jwtService: JwtService,
  ) {}

  async generateOTP(phoneNumber: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Find or create user by phoneNumber
    let user = await this.userModel.findOne({ phoneNumber });
    if (!user) {
      user = await this.userModel.create({ phoneNumber });
    }

    // Save OTP to the user's record
    user.otp = otp.toString();
    await user.save();

    // Call the sendOTP method to send the OTP to the user via email or SMS
    await this.sendOTP(phoneNumber, otp);

    return otp.toString();
  }

  private async sendOTP(phoneNumber: string, otp: number): Promise<void> {
    // Implement the logic to send the OTP to the user via email or SMS
    // This could be a call to an external service, such as an email service or a SMS gateway
    console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  }

  async generateAccessToken(phoneNumber: string): Promise<string> {
    const payload = { phoneNumber };
    const accessToken = this.jwtService.sign(payload); // Generate and sign the access token
    // Save the access token to the database
    await this.userModel.updateOne({ phoneNumber }, { accessToken });
    return accessToken; // Return the access token
  }

  async followUser(loggedInUserId, userId): Promise<void> {
    const user = await this.userModel.findById(loggedInUserId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.following.includes(userId)) {
      throw new Error('Already following user');
    }
    user.following.push(userId);
    await user.save();

    const followedUser = await this.userModel.findById(userId);
    if (!followedUser) {
      throw new Error('Followed user not found');
    }
    followedUser.followers.push(loggedInUserId);
    await followedUser.save();
  }

  async unfollowUser(loggedInUserId, userId) {
    const user = await this.userModel.findById(loggedInUserId);
    if (!user) {
      throw new Error('User not found');
    }
    const index = user.following.indexOf(userId);
    if (index === -1) {
      throw new Error('User is not being followed');
    }
    user.following.splice(index, 1);
    await user.save();

    const followedUser = await this.userModel.findById(userId);
    if (!followedUser) {
      throw new Error('Followed user not found');
    }
    const followerIndex = followedUser.followers.indexOf(loggedInUserId);
    if (followerIndex === -1) {
      throw new Error('Follower not found');
    }
    followedUser.followers.splice(followerIndex, 1);
    await followedUser.save();
  }

  async getFollowers(loggedInUserId: string) {
    const user = await this.userModel
      .findById(loggedInUserId)
      .populate('followers');
    return user.followers;
  }

  async getFollowing(loggedInUserId: string) {
    const user = await this.userModel
      .findById(loggedInUserId)
      .populate('following');
    return user.following;
  }

  async createBookmark(userId: string, bookmark: Bookmark) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    bookmark.user = user; // Assign the user to the bookmark
    const createdBookmark = new this.bookmarkModel(bookmark);
    await createdBookmark.save();
    return createdBookmark;
  }

  async getUserBookmarks(userId: string) {
    const bookmarks = await this.bookmarkModel.find({ user: userId });
    return bookmarks;
  }

  async getBookmarkDetail(userId: string, bookmarkId: string) {
    const bookmark = await this.bookmarkModel.findOne({
      _id: bookmarkId,
      user: userId,
    });
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    return bookmark;
  }

  async deleteBookmark(userId: string, bookmarkId: string) {
    const bookmark = await this.bookmarkModel.findOneAndDelete({
      _id: bookmarkId,
      user: userId,
    });
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    return bookmark;
  }
}
