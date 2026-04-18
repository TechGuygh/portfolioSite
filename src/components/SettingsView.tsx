import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { 
  Settings, 
  DollarSign, 
  Percent, 
  Bell, 
  Save, 
  Globe,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface AppSettings {
  currency_symbol: string;
  default_tax_rate: number;
  notification_email: string;
  low_stock_threshold: number;
  business_name: string;
  business_address: string;
  updatedAt: any;
}

const DEFAULT_SETTINGS: AppSettings = {
  currency_symbol: '$',
  default_tax_rate: 0,
  notification_email: '',
  low_stock_threshold: 10,
  business_name: '',
  business_address: '',
  updatedAt: null
};

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'config', 'app_settings'));
        if (settingsDoc.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...settingsDoc.data() } as AppSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'config', 'app_settings'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Application Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Configure your store settings and global preferences</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4 dark:bg-slate-800 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Globe size={18} className="text-blue-500" /> General Store Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Business Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={settings.business_name}
                  onChange={e => setSettings({...settings, business_name: e.target.value})}
                  placeholder="e.g. Acme Superstore"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Business Address</label>
                <textarea 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-24"
                  value={settings.business_address}
                  onChange={e => setSettings({...settings, business_address: e.target.value})}
                  placeholder="123 Store St, City, Country"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 dark:bg-slate-800 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <DollarSign size={18} className="text-emerald-500" /> Financials
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Currency Symbol</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    <DollarSign size={16} />
                  </div>
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={settings.currency_symbol}
                    onChange={e => setSettings({...settings, currency_symbol: e.target.value})}
                    placeholder="$"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Default Tax Rate (%)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    <Percent size={16} />
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={settings.default_tax_rate}
                    onChange={e => setSettings({...settings, default_tax_rate: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 dark:bg-slate-800 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Bell size={18} className="text-amber-500" /> Notifications & Alerts
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Notification Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={settings.notification_email}
                  onChange={e => setSettings({...settings, notification_email: e.target.value})}
                  placeholder="alerts@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Low Stock Threshold</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    <Truck size={16} />
                  </div>
                  <input 
                    type="number" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={settings.low_stock_threshold}
                    onChange={e => setSettings({...settings, low_stock_threshold: Number(e.target.value)})}
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 dark:bg-slate-800 dark:border-slate-700 opacity-50 cursor-not-allowed">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-indigo-500" /> Security (Coming Soon)
            </h2>
            <p className="text-xs text-slate-500 italic">Advanced security and auditing features will be available in the next update.</p>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
