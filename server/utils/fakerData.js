import { faker } from '@faker-js/faker';
import User from '../models/userModel.js'; // Ensure this path is correct
import FriendRequest from '../models/friendRequest.js'; // Ensure this path is correct

// Generate random users
export async function generateFakeUsers(numUsers = 10) {
  const fakeUsers = [];
  for (let i = 0; i < numUsers; i++) {
    fakeUsers.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatar: faker.image.avatar(),
    });
  }
  await User.insertMany(fakeUsers);
  console.log(`${numUsers} fake users created.`);
}

// Generate friend requests
export async function generateFriendRequests() {
  const users = await User.find();

  for (const user of users) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    if (user._id.toString() !== randomUser._id.toString()) {
      try {
        await FriendRequest.create({
          requestFrom: user._id, // Correct field name
          requestTo: randomUser._id, // Correct field name
          requestStatus: 'Pending', // Optional since it defaults to 'Pending'
        });
        console.log(`Friend request created from ${user.firstName} to ${randomUser.firstName}`);
      } catch (err) {
        console.error('Error creating friend request:', err);
      }
    }
  }
  console.log('Fake friend requests generated.');
}
