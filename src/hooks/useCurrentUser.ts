import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { usersApi } from '../api/usersApi';
import { setUserProfile, logout } from '../store/authSlice';
import type { RootState } from '../store/store';

export const useCurrentUserQuery = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state: RootState) => state.auth);

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await usersApi.getCurrentProfile();
      if (!response.success) {
        throw new Error(response.message || 'Failed to load user profile');
      }
      return response.data;
    },
    enabled: isAuthenticated && !!accessToken,
    staleTime: 1000 * 60 * 15, // 15 mins
    retry: false,
  });

  // Sync state to Redux when query resolves or errors
  useEffect(() => {
    if (query.data) {
      dispatch(setUserProfile(query.data));
    } else if (query.isError) {
      dispatch(logout());
    }
  }, [query.data, query.isError, dispatch]);

  return query;
};
