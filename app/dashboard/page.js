// app/menu/page.js
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, Users, Calendar, ChartBar, Clock, UserPlus, FileText, Settings, LogOut, ArrowRight } from 'lucide-react';
import Image from "next/image";
import imageAsset from "@/public/symbol.png";

export default function DashboardPage() {
  const router = useRouter();

  const appFeatures = [
    {
      name: 'Mark Attendance',
      icon: <FileText className="text-white w-6 h-6" />,
      path: '/attendance'
    },
    {
      name: 'Employee',
      icon: <FileText className="text-white w-6 h-6" />,
      path: '/employee'
    },
    {
      name: 'Stocktake',
      icon: <FileText className="text-white w-6 h-6" />,
      path: '/stocktake'
    },
    {
      name: 'Receiving',
      icon: <FileText className="text-white w-6 h-6" />,
      path: '/receiving'
    },
    {
      name: 'Gate In',
      icon: <FileText className="text-white w-6 h-6" />,
      path: '/gate-in'
    },
    {
      name: 'Daily Routine',
      icon: <FileText className="text-white w-6 h-6" />,
      path: '/daily-routine'
    },
    {
      name: 'Markdown',
      icon: <FileText className="text-white w-6 h-6" />,
      path: '/markdown'
    }
  ];

  const navItems = [
    { name: 'Home', icon: <Home className="h-6 w-6" />, path: '/dashboard' },
    { name: 'Calendar', icon: <Calendar className="h-6 w-6" />, path: '/calendar' },
    { name: 'Users', icon: <Users className="h-6 w-6" />, path: '/users' },
    { name: 'Settings', icon: <Settings className="h-6 w-6" />, path: '/settings' },
  ];

  const handleFeatureClick = (path) => {
    router.push(path);
  };

  const handleNavClick = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleBack = () => {
    router.back();
  };

  return (
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header - Changed to teal color */}
        <header className="bg-teal-600 text-white p-4 flex items-center justify-between">
          <div className="relative w-full">
            <Image src={imageAsset} alt="something" height={20} width={50}/>
          </div>
          <div className="flex gap-4">
            <button aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <button aria-label="Logout" onClick={handleLogout}>
              <LogOut className="h-6 w-6"/>
            </button>
          </div>
        </header>

        {/* Back Button */}
        <div className="px-4 pt-4">
          <button
              onClick={handleBack}
              className="flex items-center text-teal-600 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
        </div>

        {/* Main Content - Grid of App Features (now as cards) */}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {appFeatures.map((feature, index) => (
                <div
                    key={index}
                    className="bg-teal-50 rounded-lg flex items-center justify-between p-4 cursor-pointer shadow-sm"
                    onClick={() => handleFeatureClick(feature.path)}
                >
                  <span className="text-lg font-medium text-gray-800">{feature.name}</span>
                  <div className="bg-teal-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <ArrowRight className="text-white w-5 h-5" />
                  </div>
                </div>
            ))}
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 p-2">
          <div className="flex justify-around">
            {navItems.map((item, index) => (
                <button
                    key={index}
                    className="flex flex-col items-center text-gray-500 hover:text-teal-600"
                    onClick={() => handleNavClick(item.path)}
                >
                  {React.cloneElement(item.icon, {
                    className: "h-6 w-6"
                  })}
                  <span className="text-xs">{item.name}</span>
                </button>
            ))}
          </div>
        </nav>
      </div>
  );
}