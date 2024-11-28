// src/app/api/get-all-username/route.ts

import dbConnect from '@/lib/dbConnect'; // Ensure the path is correct for dbConnect
import UserModel from '@/model/User'; // Adjust the path to your User model
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export const GET = async () => {
  try {
    await dbConnect();

    // Fetch usernames from the database
    const users = await UserModel.find({}, 'username'); // Only retrieve the username field
    const usernames = users.map((user) => user.username); // Extract usernames from the returned user documents

    console.log('Usernames are', usernames);

    // Return the response as JSON
    return NextResponse.json({ usernames });
  } catch (error) {
    console.error('Error fetching usernames:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions); // Get the session of the current user

    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Not Authenticated',
        },
        {
          status: 401,
        }
      );
    }
    const { username } = await req.json(); // Get the target username from the request body
    // Validate if the username is provided
    console.log("Request parameter is ", username)

    if (!username) {
      return NextResponse.json(
        { success: false, message: 'Username is required' },
        { status: 400 }
      );
    }

    // Log the authenticated user and the target username for debugging
    console.log('Authenticated user:', session.user.username);
    console.log('Adding connection to:', username);

    // Find the current user (who is adding the friend)
    const currentUser = await UserModel.findOne({ username: session.user.username });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Find the target user (the one to be added as a friend)
    const targetUser = await UserModel.findOne({ username });
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'Target user not found' },
        { status: 404 }
      );
    }

    // Check if the target user is already in the friend list
    const isAlreadyFriend = currentUser.friendList.some((friend) => friend.username === targetUser.username);
    if (isAlreadyFriend) {
      return NextResponse.json(
        { success: false, message: 'Already friends with this user' },
        { status: 400 }
      );
    }

    // Add the target user to the current user's friend list
    currentUser.friendList.push({
      username: username,
      friendsFrom: new Date(), // Set the friendship date to now
    });

    // Save the updated user document
    await currentUser.save();

    // Return a success response
    return NextResponse.json(
      { success: true, message: `Connection to ${username} added successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error while adding friend:', error);
    return NextResponse.json({ error: 'Server Error in Adding Connection' }, { status: 500 });
  }
};
