"use client";

import React from "react";
import { Github, Mail, Globe, Server, Terminal } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const appVersion = "v1.0.0";
  const buildHash = "5d3f8c7";


  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            StackHook Pvt. Ltd.
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-xs">
            Empowering real estate with intelligent property management
            solutions.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href="mailto:support@stackhook.com"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://stackhook.com"
              target="_blank"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Globe size={18} />
            </a>
            <a
              href="https://github.com/stackhook"
              target="_blank"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Github size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/dashboard" className="hover:text-primary-600 dark:hover:text-primary-400">Dashboard</a></li>
            <li><a href="/properties" className="hover:text-primary-600 dark:hover:text-primary-400">Properties</a></li>
            <li><a href="/agents" className="hover:text-primary-600 dark:hover:text-primary-400">Agents</a></li>
            <li><a href="/clients" className="hover:text-primary-600 dark:hover:text-primary-400">Clients</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/help" className="hover:text-primary-600 dark:hover:text-primary-400">Help Center</a></li>
            <li><a href="/contact" className="hover:text-primary-600 dark:hover:text-primary-400">Contact Support</a></li>
            <li><a href="/faq" className="hover:text-primary-600 dark:hover:text-primary-400">FAQs</a></li>
            <li><a href="/report-issue" className="hover:text-primary-600 dark:hover:text-primary-400">Report Issue</a></li>
          </ul>
        </div>

        {/* System Info */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase">System Info</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <Terminal size={14} /> Version: <span className="font-medium">{appVersion}</span>
            </li>
            <li className="flex items-center gap-2">
              <Server size={14} /> Env:{" "}
             
            </li>
            <li>
              Build: <span className="font-mono text-xs">{buildHash}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="px-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          <span>&copy; {year} StackHook Pvt. Ltd.</span>
          <span className="hidden sm:inline">|</span>
          <span>All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
