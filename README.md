# Dosti Connect

Dosti Connect is a full-stack social media application that allows users to connect with friends, share posts, like and comment on content, and engage in conversations. Built using the MERN stack (MongoDB, Express, React, and Node.js), Dosti Connect focuses on seamless user interaction, responsive design, and a scalable architecture.

## Features

- **User Authentication**: Secure sign-up and login functionality with JWT authentication.
- **Posts**: Users can create, edit, and delete posts with media (images/videos).
- **Comments & Likes**: Users can comment on posts and like/unlike them.
- **Friendship System**: Users can send, accept, or decline friend requests.
- **Profile Management**: Each user has a profile page with personal details and posts.
- **Media Sharing**: Support for sharing GIFs and live streams.
- **Search & Explore**: Users can search for other users, posts, and explore content.

## Tech Stack

- **Frontend**: React.js, Bootstrap, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer (for media uploads)
- **Real-time Functionality**: Socket.IO (for notifications)
- **Deployment**: Heroku / Netlify


### Prerequisites

- Install [Node.js](https://nodejs.org/)
- Install [MongoDB](https://www.mongodb.com/try/download/community)


## API Endpoints

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| POST   | `/api/auth/signup`     | Register a new user                      |
| POST   | `/api/auth/login`      | Log in a user                            |
| GET    | `/api/posts`           | Fetch all posts                          |
| POST   | `/api/posts`           | Create a new post                        |
| PUT    | `/api/posts/:id`       | Edit a post                              |
| DELETE | `/api/posts/:id`       | Delete a post                            |
| POST   | `/api/posts/:id/like`  | Like or unlike a post                    |
| POST   | `/api/posts/:id/comment` | Comment on a post                      |




### Future Enhancements

- **Group Chats**: Introduce group chat functionality for users to create group conversations with friends.
- **Story Feature**: Allow users to post short-lived "stories" that disappear after 24 hours.
- **Hashtag Support**: Enable hashtag functionality to help users categorize posts and find trending topics.
- **Polls and Surveys**: Let users create polls and surveys for their friends and followers to interact with.
- **Post Analytics**: Provide analytics for users' posts, such as view counts, likes over time, and engagement stats.
- **Location-based Services**: Allow users to check in or tag locations in posts.
- **Multi-language Chat Translation**: Automatically translate messages in real-time for users speaking different languages.
