import React from 'react';
import { 
  TrendingUp, 
  Menu, 
  LogOut,
  ChevronLeft,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { User } from '../types';

interface NavigationDrawerProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  visibleNavItems: { id: string; icon: any; label: string }[];
  onLogout: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  visibleNavItems,
  onLogout
}) => {
  return (
    <aside 
      className={cn(
        "bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col shrink-0 h-screen sticky top-0 z-20",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Header / Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="bg-emerald-500 p-2 rounded-lg shrink-0 shadow-lg shadow-emerald-500/20">
          <TrendingUp className="text-white" size={24} />
        </div>
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-xl text-white tracking-tight whitespace-nowrap"
            >
              ShopAssist
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* User Profile Section */}
      <div className="px-4 py-6 border-b border-slate-800/50">
        <div className={cn(
          "flex items-center gap-3 rounded-xl p-2 transition-colors",
          isSidebarOpen ? "bg-slate-800/40" : "justify-center"
        )}>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <UserIcon size={20} />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-bold text-white truncate">{currentUser.username}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider truncate">{currentUser.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {visibleNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
              activeTab === item.id 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-medium" 
                : "hover:bg-slate-800/60 hover:text-white text-slate-400 font-medium"
            )}
            title={!isSidebarOpen ? item.label : undefined}
          >
            <item.icon size={22} className={cn("shrink-0 transition-transform group-hover:scale-110", activeTab === item.id ? "scale-110" : "")} />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!isSidebarOpen && activeTab === item.id && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800/60 transition-colors text-slate-400 hover:text-white"
        >
          {isSidebarOpen ? <ChevronLeft size={22} className="shrink-0" /> : <Menu size={22} className="shrink-0" />}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm font-medium"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
              onLogout();
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-bold group"
        >
          <LogOut size={22} className="shrink-0 transition-transform group-hover:-translate-x-1" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm whitespace-nowrap"
              >
                Logout Account
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </aside>
  );
};
