import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Users,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Star,
  Play,
  Menu,
  X,
  Clock,
  Target,
  Layers,
  MessageSquare,
  FileText, ChevronDown, TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Landing: React.FC = () => {
  // const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  // const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  const features = [
    {
      icon: Target,
      title: 'Project Management',
      description: 'Organize and track projects with intuitive boards, timelines, and progress tracking.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time updates, comments, and file sharing.',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Monitor productivity with built-in time tracking and detailed reporting.',
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get insights into team performance and project progress with detailed analytics.',
      color: 'text-orange-600'
    },
    {
      icon: Zap,
      title: 'Automation',
      description: 'Streamline workflows with powerful automation rules and triggers.',
      color: 'text-yellow-600'
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Stay connected with integrated chat, notifications, and team messaging.',
      color: 'text-pink-600'
    },

    {
      icon: Shield,
      title: 'Security',
      description: 'Advanced role-based access control and data encryption for enterprise-grade security.',
      color: 'text-red-600'
    },
    {
      icon: Layers,
      title: 'Multi-Workspace Support',
      description: 'Manage multiple teams or departments in isolated workspaces.',
      color: 'text-teal-600'
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Upload, organize, and collaborate on important documents with version control.',
      color: 'text-indigo-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager at TechCorp',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      content: 'ProjectManager has transformed how our team collaborates. The intuitive interface and powerful features have increased our productivity by 40%.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'CEO at StartupXYZ',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      content: 'The best project management tool we\'ve used. The automation features alone have saved us countless hours every week.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Team Lead at DesignStudio',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      content: 'Finally, a tool that our entire team actually enjoys using. The user experience is exceptional and the features are comprehensive.',
      rating: 5
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '100K+', label: 'Projects Completed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  const capabilities = [
    { icon: ChevronDown, label: 'Simple Onboarding' },
    { icon: Globe, label: 'Global Access' },
    { icon: Shield, label: 'Top-Notch Security' },
    { icon: TrendingUp, label: 'Business Growth' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="font-bold text-xl text-neutral-900 dark:text-neutral-100">
                ProjectManager
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Testimonials
                </button>
                <Link
                  to="/login"
                  className="text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('features')}
                className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 w-full text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 w-full text-left"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 w-full text-left"
              >
                Testimonials
              </button>
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
              >
                Sign In
              </Link>
              <div className="px-3 py-2">
                <Link to="/register">
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6"
            >
              Manage Projects Like a
              <span className="text-primary-600 dark:text-primary-400"> Pro</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-3xl mx-auto"
            >
              Streamline your workflow, collaborate seamlessly, and deliver projects on time with our comprehensive project management platform.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/register">
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Start Free Trial
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                icon={<Play className="w-5 h-5" />}
                onClick={() => scrollToSection('demo')}
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>

          {/* Hero Image/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 relative"
            style={{ y: y1 }}
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur-3xl opacity-20"></div>
              <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <div className="bg-neutral-100 dark:bg-neutral-700 px-4 py-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Mobile App Redesign</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">Active</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-3">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">75% Complete</p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">API Integration</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">In Progress</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-3">
                        <div className="bg-secondary-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">45% Complete</p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Marketing Campaign</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs rounded-full">Planning</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-3">
                        <div className="bg-accent-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">20% Complete</p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 dark:bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4"
            >
              Everything you need to succeed
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto"
            >
              Powerful features designed to help teams collaborate, track progress, and deliver exceptional results.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4"
            >
              Loved by teams worldwide
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-600 dark:text-neutral-400"
            >
              See what our customers have to say about ProjectManager
            </motion.p>
          </div>

          <div className="relative">
            <Card className="p-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl text-neutral-900 dark:text-neutral-100 mb-6">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div className="flex items-center justify-center">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400">
                      {testimonials[activeTestimonial].role}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial
                      ? 'bg-primary-600'
                      : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4"
            >
              Simple, transparent pricing
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-600 dark:text-neutral-400"
            >
              Choose the plan that's right for your team
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$9',
                period: 'per user/month',
                features: ['Up to 10 projects', 'Basic time tracking', 'Email support', '5GB storage'],
                popular: false
              },
              {
                name: 'Professional',
                price: '$19',
                period: 'per user/month',
                features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '100GB storage', 'Automation rules'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: '$39',
                period: 'per user/month',
                features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'Unlimited storage', 'Advanced security'],
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className={`p-8 h-full relative ${plan.popular ? 'border-primary-500 shadow-lg' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                      {plan.price}
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400">
                      {plan.period}
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-neutral-600 dark:text-neutral-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="block">
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 bg-neutral-100 dark:bg-neutral-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {capabilities.map((item, index) => (
              <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
              >
                <item.icon className="w-8 h-8 mb-3 text-primary-600" />
                <span className="text-lg text-neutral-700 dark:text-neutral-300">
          {item.label}
        </span>
              </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600 dark:bg-primary-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to transform your workflow?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-primary-100 mb-8"
          >
            Join thousands of teams already using ProjectManager to deliver better results.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button
                size="lg"
                variant="secondary"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 dark:bg-neutral-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">PM</span>
                </div>
                <span className="font-bold text-xl">ProjectManager</span>
              </div>
              <p className="text-neutral-400 mb-4">
                The ultimate project management platform for modern teams.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
            <p className="text-neutral-400">
              © 2024 ProjectManager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};