import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

interface RegisterForm {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.username, data.password);
      navigate('/login');
    } catch (error: any) {
      console.error("Registration Error: ", error.message);
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
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
            Create your account
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Join thousands of teams already using ProjectManager
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full name"
              type="text"
              icon={<User className="w-4 h-4" />}
              placeholder="Enter your full name"
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />

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

            <div className="relative">
                <Input
                  label="Username"
                  type="text"
                  icon={<span className="text-neutral-400 font-medium">@</span>}
                  placeholder="Enter unique username"
                  error={errors.username?.message}
                  {...register('username', {
                    required: 'Username is required',
                    pattern: {
                      value: /^[a-zA-Z0-9_]{3,20}$/,
                      message: 'Username must be 3-20 characters, only letters, numbers, and underscores'
                    },
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    },
                    maxLength: {
                      value: 20,
                      message: 'Username must be at most 20 characters'
                    }
                  })}
                />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={<Lock className="w-4 h-4" />}
                placeholder="Create a password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
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

            <div className="relative">
              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                icon={<Lock className="w-4 h-4" />}
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 mt-1"
                  {...register('terms', {
                    required: 'You must accept the terms and conditions'
                  })}
                />
                <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.terms.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};