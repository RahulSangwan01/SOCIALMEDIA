import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage or Redux
      const response = await axios.get(`/api/friend-requests/${userId}`);
      setRequests(response.data);
    };
    fetchRequests();
  }, []);

  return (
    <div>
      <h2>Friend Requests</h2>
      <ul>
        {requests.map((req, index) => (
          <li key={index}>
            {req.from.firstName} {req.from.lastName} sent you a friend request!
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequests;
