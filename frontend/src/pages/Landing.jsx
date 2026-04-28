import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldPlus, ShieldCheck, Clock, Users, ChevronRight, Activity, Database, Lock } from 'lucide-react';

const Landing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If user is already logged in, redirect them to their dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'patient') navigate('/patient-dashboard');
      else if (user.role === 'doctor') navigate('/doctor-dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-2 rounded-xl">
                <ShieldPlus className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-900">MedVault</span>
            </div>
            <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
              <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
              <a href="#about" className="hover:text-primary-600 transition-colors">About</a>
              <a href="#contact" className="hover:text-primary-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-700 hover:text-primary-600 font-semibold px-4 py-2 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="bg-primary-600 text-white hover:bg-primary-700 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-200 active:scale-95 btn-hover-effect">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 bg-gradient-to-b from-primary-50/50 to-white overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-100/30 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-bold mb-8 animate-fade-in-up">
            <Activity className="w-4 h-4" />
            <span>Securely Managing 10,000+ Health Records</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight animate-fade-in-up stagger-1">
            Your Health Records, <br />
            <span className="text-primary-600">Securely Managed.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-2">
            The ultimate platform for patients to store, manage, and share medical history with doctors instantly and securely. Built on trust and transparency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up stagger-3">
            <Link to="/signup" className="bg-primary-600 text-white hover:bg-primary-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-200 flex items-center justify-center gap-2 active:scale-95 btn-hover-effect">
              Create Free Account <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 hover:border-primary-200 hover:text-primary-600">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Secure Records', value: '10K+' },
              { label: 'Active Doctors', value: '500+' },
              { label: 'Patient Trust', value: '99.9%' },
              { label: 'Cities Covered', value: '50+' },
            ].map((stat, i) => (
              <div key={i} className={`text-center p-6 rounded-2xl border border-gray-50 hover:border-primary-100 transition-colors animate-fade-in-up stagger-${(i % 4) + 1}`}>
                <p className="text-4xl font-black text-primary-600 mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">Everything You Need.</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features designed to keep your medical life simple and secure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Encrypted Storage',
                desc: 'All your records are stored with enterprise-grade encryption to ensure maximum privacy.',
                icon: Lock,
                color: 'bg-blue-500'
              },
              {
                title: 'Instant Sharing',
                desc: 'Grant or revoke access to any doctor in seconds. You are always in control of your data.',
                icon: Users,
                color: 'bg-primary-600'
              },
              {
                title: 'Clinical Insights',
                desc: 'Doctors can provide clinical notes and diagnoses directly on your uploaded records.',
                icon: ShieldCheck,
                color: 'bg-green-500'
              }
            ].map((feature, i) => (
              <div key={i} className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up stagger-${(i % 3) + 1}`}>
                <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-gray-200`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-primary-600 rounded-[3rem] p-10 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary-200">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-700/30 rounded-full blur-3xl" />

            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 relative">
              Start Your Digital <br /> Health Journey Today.
            </h2>
            <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto relative font-medium">
              Join thousands of patients who have already switched to a more secure and efficient way to manage their medical history.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative">
              <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-50 px-10 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 btn-hover-effect shadow-xl shadow-primary-900/20">
                Join MedVault Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <ShieldPlus className="h-6 w-6 text-primary-600" />
            <span className="font-bold text-xl text-gray-900">MedVault</span>
          </div>
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} MedVault Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-600 font-medium text-sm">
            <a href="#" className="hover:text-primary-600">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
