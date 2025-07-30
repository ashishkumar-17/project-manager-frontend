import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import {useLoading} from "../../hooks/useLoading.ts";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface ForgotPasswordForm {
  email: string;
}

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const { login } = useAuth();
  const { isLoading } = useLoading();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  const { register: registerForgot, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors } } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  const onForgotPasswordSubmit = async (data: ForgotPasswordForm) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password reset email sent!');
      setForgotPasswordOpen(false);
    } catch (error) {
      toast.error('Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-white font-bold text-2xl">PM</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Welcome back
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Sign in to your account to continue
          </p>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Demo Login:</strong> Use below email and password (min 6 characters)
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Example: john.doe@company.com / password123
            </p>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Email address"
                type="email"
                icon={<Mail className="w-4 h-4" />}
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={<Lock className="w-4 h-4" />}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  {...register('remember')}
                />
                <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        title="Reset Password"
      >
        <form onSubmit={handleForgotSubmit(onForgotPasswordSubmit)} className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <Input
            label="Email address"
            type="email"
            icon={<Mail className="w-4 h-4" />}
            placeholder="Enter your email"
            error={forgotErrors.email?.message}
            {...registerForgot('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setForgotPasswordOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};