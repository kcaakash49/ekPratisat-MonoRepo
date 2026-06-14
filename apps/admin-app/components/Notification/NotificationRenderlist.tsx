"use client";

import React from 'react';
import Link from 'next/link';
import { Bell, Check, CheckCheck, MessageSquare, ArrowRight } from 'lucide-react';
import { useMarkAllRead, useMarkread } from '@repo/query-hook';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// 1. Explicit TypeScript structure matching your exact backend payload shape
interface NotificationItem {
  id: string; // The unique NotificationRecipient row record ID
  isRead: boolean;
  readAt: string | null;
  event: {
    title: string;
    body: string;
    link: string;
    createdAt: string;
  };
}

interface NotificationRenderListProps {
  notifications: NotificationItem[];
}

export default function NotificationRenderList({ notifications = [] }: NotificationRenderListProps) {

  const {mutate:markAllRead, isPending:markAllPending} = useMarkAllRead();
  const {mutate:markRead, isPending:markReadPending} = useMarkread();
  const queryClient = useQueryClient();
  
  // ⚡ Dummy placeholder handler for single item clear action
  const handleMarkAsRead = (id: string) => {
    markRead(id, {
      onSuccess: (data) => {
        toast.success(data.message || "Opeartion Successful");
        queryClient.invalidateQueries({
          queryKey:["notifications"]
        });
        queryClient.invalidateQueries({
          queryKey:["user-info"]
        })
      }
    })
  };

  // ⚡ Dummy placeholder handler for bulk clean actions
  const handleMarkAllAsRead = () => {
    markAllRead(undefined,{
      onSuccess: (data) => {
        toast.success(data.message || "Operation Successful");
        queryClient.invalidateQueries({
          queryKey: ["notifications"]
        });
        queryClient.invalidateQueries({
          queryKey:["user-info"]
        })
      }
    });
  };

  const pendingStatus =  markAllPending || markReadPending;

  return (
    <div className="max-w-7xl px-4 py-8 space-y-6">
      
      {/* Module Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-secondary-200 dark:border-secondary-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-500" />
            Inbox Alerts
          </h1>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            Real-time feed showing active, unread incoming operational updates.
          </p>
        </div>

        {/* Dummy Bulk Clear Action Controls */}
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={pendingStatus}
            className="inline-flex items-center gap-1.5 self-start sm:self-center px-4 py-2 text-xs font-bold border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-900 hover:bg-secondary-50 dark:hover:bg-secondary-800 shadow-sm transition active:scale-95"
          >
            <CheckCheck className="w-4 h-4 text-primary-500" />
            Clear all alerts
          </button>
        )}
      </div>

      {/* Main Core Render Feed Stack */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          
          /* 💎 Empty Screen State Layout - Triggers when result array maps to 0 length */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-secondary-200 dark:border-secondary-800 rounded-2xl bg-secondary-50/30 dark:bg-secondary-900/10 px-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center mb-4">
              <CheckCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-secondary-900 dark:text-secondary-100">You're all caught up!</h3>
            <p className="text-sm text-secondary-400 mt-1 max-w-sm leading-relaxed">
              No unread notification updates pending action right now. Enjoy your clean workspace!
            </p>
          </div>

        ) : (
          
          /* Active Live Unread Alerts List Mapper */
          notifications.map((item) => (
            <div
              key={item.id}
              className="group flex gap-4 p-4 rounded-xl border bg-primary-50/20 dark:bg-primary-950/5 border-primary-100/60 dark:border-primary-950/20 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              {/* Highlight Left-Border Decorative Glow Ribbon Accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />

              {/* Icon Matrix Box */}
              <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-secondary-800 shadow-sm border border-secondary-100 dark:border-secondary-700/50">
                <MessageSquare className="w-4 h-4 text-primary-500" />
              </div>

              {/* Data Text Layout Content Blocks */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-500 transition-colors duration-150">
                    {item.event.title}
                  </h3>
                  
                  {/* Localized Datetime String Parsing */}
                  <span className="text-[11px] text-secondary-400 whitespace-nowrap font-medium">
                    {new Date(item.event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed pr-8">
                  {item.event.body}
                </p>

                {/* Navigation Router Forwarding Link */}
                <div className="pt-1">
                  <Link 
                    href={item.event.link}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition"
                  >
                    View details
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Interactive Dummy Dismissal Trigger Check Box Icon */}
              <div className="flex items-center self-start sm:self-center">
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  disabled={pendingStatus}
                  title="Mark as read"
                  className="p-2 text-secondary-400 hover:text-emerald-500 hover:bg-white dark:hover:bg-secondary-800 rounded-xl border border-transparent hover:border-secondary-100 dark:hover:border-secondary-700 shadow-none hover:shadow-sm transition active:scale-90"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}