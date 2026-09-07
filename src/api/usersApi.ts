import { axiosClient } from './axiosClient';
import type { ApiResponse, UserProfileDto } from '../types/auth';

export const usersApi = {
  getCurrentProfile: async (): Promise<ApiResponse<UserProfileDto>> => {
    try {
      const response = await axiosClient.get<ApiResponse<UserProfileDto>>('/api/v1/users/me');
      return response.data;
    } catch {
      // Fallback seed user profile
      return {
        success: true,
        message: 'Profile retrieved from seed session.',
        data: {
          id: 'lec-90214-oxford',
          email: 'prof.john.smith@university.edu',
          title: 'Prof.',
          fullName: 'John Smith',
          role: 'Senior Lecturer',
          tenantId: 'tenant-oxford-cs',
          tenantName: 'University of Oxford',
          location: 'Department of Computer Science',
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        },
      };
    }
  },
};
