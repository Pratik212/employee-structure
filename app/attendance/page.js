// app/attendance/page.js
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users } from 'lucide-react';

export default function AttendancePage() {
  const router = useRouter();

  return (
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header - Changed to teal color */}
        <header className="bg-teal-600 text-white p-4 flex items-center">
          <button
              onClick={() => router.back()}
              className="mr-4"
              aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Mark Attendance</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-teal-600 w-16 h-16 rounded-full flex items-center justify-center">
                <Users className="text-white w-8 h-8" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-teal-600 mb-4 text-center">Attendance Management</h2>

            <p className="text-teal-600 font-medium mb-6">
              Use this interface to mark attendance for employees. You can check in, view current status, and generate reports.
            </p>

            {/* Placeholder for attendance functionality - Updated button colors */}
            <div className="space-y-4">
              <button
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors"
                  onClick={() => alert('Check-in functionality would go here')}
              >
                Check In
              </button>

              <button
                  className="w-full bg-gray-200 text-teal-600 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  onClick={() => alert('View Status functionality would go here')}
              >
                View Status
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-teal-600 mb-3">Recent Activity</h3>

            <ul className="space-y-3">
              <li className="border-b border-gray-100 pb-2">
                <p className="font-bold text-teal-600">John Doe</p>
                <p className="text-sm text-teal-500">Checked in at 9:00 AM</p>
              </li>
              <li className="border-b border-gray-100 pb-2">
                <p className="font-bold text-teal-600">Jane Smith</p>
                <p className="text-sm text-teal-500">Checked in at 9:15 AM</p>
              </li>
              <li>
                <p className="font-bold text-teal-600">Mike Johnson</p>
                <p className="text-sm text-teal-500">Checked in at 9:30 AM</p>
              </li>
            </ul>
          </div>
        </main>
      </div>
  );
}