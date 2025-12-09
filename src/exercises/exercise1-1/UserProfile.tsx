/**
 * Exercise 1.1: The Fetch Machine (useReducer)
 */

import { useReducer, useEffect } from 'react';


interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

// Finite State Machine 
type Status = 'idle' | 'loading' | 'resolved' | 'rejected';

interface State {
  status: Status;      // Current status
  data: User | null;   // User data (null if not available)
  error: string | null; // Error message (null if no error)
}

type Action =
  | { type: 'FETCH_INIT' }                      // Start fetch
  | { type: 'FETCH_SUCCESS'; payload: User }    // Fetch succeeded with data
  | { type: 'FETCH_FAILURE'; payload: string }; // Fetch failed with error message

const initialState: State = {
  status: 'idle',    // Initially doing nothing
  data: null,        // No data yet
  error: null,       // No error yet
};


function userReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_INIT':
      if (state.status === 'loading') {
        console.warn('⚠️ Already loading, cannot fetch again!');
        return state; 
      }
      return {
        ...state,           // Keep other fields
        status: 'loading',  // Switch to loading
        error: null,        // Clear old error (if any)
      };

    case 'FETCH_SUCCESS':
      if (state.status !== 'loading') {
        console.warn('⚠️ Cannot SUCCESS when not loading!');
        return state;
      }
      return {
        ...state,
        status: 'resolved',      // Success!
        data: action.payload,    // Save data from action
        error: null,             // No error
      };

    case 'FETCH_FAILURE':
      // Only allow failure when loading
      if (state.status !== 'loading') {
        console.warn('⚠️ Cannot FAILURE when not loading!');
        return state;
      }
      return {
        ...state,
        status: 'rejected',      // Failed!
        data: null,              // Clear old data
        error: action.payload,   // Save error message
      };

    default:
      // Nếu action không nhận ra, giữ nguyên state
      return state;
  }
}


interface UserProfileProps {
  userId: number;
}

export function UserProfile({ userId }: UserProfileProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const { status, data, error } = state;

  useEffect(() => {
    const fetchUser = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        // Giả lập API call (delay 1.5 giây)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Giả lập data từ API
        const mockUser: User = {
          id: userId,
          name: `Nguyen Thi ${userId}`,
          email: `user${userId}@example.com`,
          avatar: `https://i.pravatar.cc/150?u=${userId}`,
        };

        // Simulate error if userId is 999
        if (userId === 999) {
          throw new Error('User does not exist!');
        }

        // Dispatch action thành công với data
        dispatch({ type: 'FETCH_SUCCESS', payload: mockUser });
      } catch (err) {
        // Dispatch action thất bại với error message
        dispatch({
          type: 'FETCH_FAILURE',
          payload: err instanceof Error ? err.message : 'An error occurred!',
        });
      }
    };

    fetchUser();
  }, [userId]); // Chạy lại khi userId thay đổi


  if (status === 'idle') {
    return (
      <div className="user-profile idle">
        <p>🔄 Preparing...</p>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="user-profile loading">
        <div className="spinner">⏳</div>
        <p>Loading user information...</p>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="user-profile error">
        <p>❌ Error: {error}</p>
        <button onClick={() => dispatch({ type: 'FETCH_INIT' })}>
          Try Again
        </button>
      </div>
    );
  }

  // status === 'resolved'
  if (data) {
    return (
      <div className="user-profile success">
        <img src={data.avatar} alt={data.name} />
        <h2>{data.name}</h2>
        <p>📧 {data.email}</p>
        <p>🆔 ID: {data.id}</p>
      </div>
    );
  }

  return null;
}

// CSS Styles
export const userProfileStyles = `
  .user-profile {
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    max-width: 300px;
    margin: 20px auto;
  }

  .user-profile.idle {
    background: #f0f0f0;
  }

  .user-profile.loading {
    background: #e3f2fd;
  }

  .user-profile.error {
    background: #ffebee;
    color: #c62828;
  }

  .user-profile.success {
    background: #e8f5e9;
  }

  .user-profile img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  .spinner {
    font-size: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .user-profile button {
    padding: 10px 20px;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }

  .user-profile button:hover {
    background: #1565c0;
  }
`;

export default UserProfile;
