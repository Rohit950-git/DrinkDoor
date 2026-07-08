"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, X, Shield, Sparkles, MessageSquare, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../common/Button";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "system" | "message" | "billing";
}

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Security Alert",
    description: "New login detected from Safari on macOS (San Francisco, CA).",
    time: "2 hours ago",
    read: false,
    type: "system",
  },
  {
    id: "n2",
    title: "New Message",
    description: "Support request ticket #1480 has been updated by support manager.",
    time: "4 hours ago",
    read: false,
    type: "message",
  },
  {
    id: "n3",
    title: "Invoice Paid Successfully",
    description: "Transaction ID #tx_48910248 for $149.00 USD was successfully processed.",
    time: "1 day ago",
    read: true,
    type: "billing",
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "system":
        return <Shield className="h-4 w-4 text-rose-500" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      case "billing":
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-zinc-500" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-xl"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-zinc-950"
            />
          )}
        </AnimatePresence>
      </Button>

      {/* Dropdown Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 sm:w-96 origin-top-right rounded-2xl border border-zinc-200/60 dark:border-zinc-850 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/40 dark:bg-zinc-950/40">
              <div>
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-150">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-sans mt-0.5">
                    You have {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 outline-none flex items-center gap-1 transition-colors select-none font-sans"
                >
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900/60 scrollbar-none">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "flex gap-4 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer relative",
                      !notification.read && "bg-indigo-500/[0.015] dark:bg-indigo-500/[0.01]"
                    )}
                  >
                    {/* Icon Column */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100/50 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40">
                        {getIcon(notification.type)}
                      </div>
                      {!notification.read && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-indigo-500" />
                      )}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            "text-xs font-semibold truncate",
                            notification.read
                              ? "text-zinc-700 dark:text-zinc-300"
                              : "text-zinc-950 dark:text-zinc-100"
                          )}
                        >
                          {notification.title}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-sans shrink-0 mt-0.5">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 font-sans leading-relaxed">
                        {notification.description}
                      </p>
                    </div>

                    {/* Action Column */}
                    <div className="shrink-0 flex items-start self-center ml-2">
                      <button
                        onClick={(e) => deleteNotification(notification.id, e)}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded text-zinc-400 hover:text-zinc-650 dark:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                        aria-label="Remove alert"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <Sparkles className="h-7 w-7 text-zinc-300 dark:text-zinc-750 mb-3 animate-pulse" />
                  <p className="text-xs font-semibold text-zinc-850 dark:text-zinc-200">
                    All caught up!
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-550 mt-1 max-w-[200px] font-sans">
                    You have no new notifications at the moment.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/40 dark:bg-zinc-950/40 text-center">
              <button className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors font-sans outline-none">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
