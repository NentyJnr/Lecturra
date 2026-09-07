import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { setCredentials } from '../store/authSlice';
import type {
  LoginCommand,
  RegisterUserCommand,
  ForgotPasswordCommand,
  ResetPasswordCommand,
} from '../types/auth';

export const useLoginMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: LoginCommand) => authApi.login(command),
    onSuccess: (data) => {
      if (data.success && data.data) {
        const { token, refreshToken, user } = data.data;
        dispatch(setCredentials({ token, refreshToken, user }));
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        navigate('/dashboard');
      }
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (command: RegisterUserCommand) => authApi.register(command),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (command: ForgotPasswordCommand) => authApi.forgotPassword(command),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (command: ResetPasswordCommand) => authApi.resetPassword(command),
  });
};
