/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Component } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Settings, 
  Plus, 
  Search,
  AlertTriangle,
  DollarSign,
  Briefcase,
  Calendar,
  ChevronRight,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  History
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths, addDays, parseISO, isBefore } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from './lib/utils';
import { Product, Sale, Expense, BankAccount, Supplier, User, SupplierInvoice, SupplierPayment, Role, Customer, CustomerCreditTransaction, SavedReport, ProductPerformance } from './types';
import { NavigationDrawer } from './components/NavigationDrawer';
import toast, { Toaster } from 'react-hot-toast';
import { 
  db, 
  auth, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  where, 
  Timestamp, 
  serverTimestamp, 
  onAuthStateChanged,
  signInWithPopup,
  googleProvider,
  signOut,
  increment,
  setDoc,
  getDoc,
  limit
} from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    providerInfo: any[];
  }
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let displayError = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.errorInfo || '{}');
        if (parsed.error) displayError = parsed.error;
      } catch (e) {
        displayError = this.state.errorInfo || displayError;
      }

      return (
        <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
          <Card className="max-w-md p-8 text-center">
            <div className="bg-rose-100 text-rose-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Application Error</h1>
            <p className="text-slate-600 mb-6">{displayError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Reload Application
            </button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  if (errMessage.includes('Missing or insufficient permissions')) {
    toast.error(`Permission Denied: You don't have access to ${path || 'this resource'}.`);
  } else if (errMessage.includes('Could not reach Cloud Firestore backend')) {
    toast.error("Offline: Connection to database failed. Please check your internet.");
  } else {
    toast.error(`Database error: ${errMessage}`);
  }
  
  // Re-throw for ErrorBoundary to catch if it's a fatal listener error
  throw new Error(JSON.stringify(errInfo));
}

const PaymentBadge = ({ method }: { method: string }) => {
  const configs: any = {
    cash: { color: 'bg-emerald-100 text-emerald-700', icon: DollarSign },
    online: { color: 'bg-blue-100 text-blue-700', icon: TrendingUp },
    pos: { color: 'bg-purple-100 text-purple-700', icon: CreditCard }
  };
  const config = configs[method.toLowerCase()] || { color: 'bg-slate-100 text-slate-700', icon: History };
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize", config.color)}>
      <Icon size={12} />
      {method}
    </span>
  );
};
const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void, key?: any }) => (
  <div 
    onClick={onClick} 
    className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className, onClick && "cursor-pointer")}
  >
    {children}
  </div>
);

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon size={20} className="text-white" />
      </div>
      {trend && (
        <div className={cn("flex items-center text-xs font-medium", trend === 'up' ? 'text-emerald-600' : 'text-rose-600')}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </Card>
);

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '', username: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [invoices, setInvoices] = useState<SupplierInvoice[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [stockValue, setStockValue] = useState(0);
  const [profitLoss, setProfitLoss] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Modals
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isCustomerDetailModalOpen, setIsCustomerDetailModalOpen] = useState(false);
  const [isSupplierDetailModalOpen, setIsSupplierDetailModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [viewingCustomerId, setViewingCustomerId] = useState<string | null>(null);
  const [viewingSupplierId, setViewingSupplierId] = useState<string | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBankAccountModalOpen, setIsBankAccountModalOpen] = useState(false);
  const [isAdjustStockModalOpen, setIsAdjustStockModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCustomerPaymentModalOpen, setIsCustomerPaymentModalOpen] = useState(false);
  const [isSaveReportModalOpen, setIsSaveReportModalOpen] = useState(false);

  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerHistory, setCustomerHistory] = useState<Sale[]>([]);
  const [customerCreditHistory, setCustomerCreditHistory] = useState<CustomerCreditTransaction[]>([]);
  const [supplierPaymentHistory, setSupplierPaymentHistory] = useState<SupplierPayment[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [reportName, setReportName] = useState('');
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkEditForm, setBulkEditForm] = useState({ category: '', retail_price: 0, wholesale_price: 0 });
  const [salePaymentMethod, setSalePaymentMethod] = useState<'cash' | 'online' | 'pos'>('cash');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };
  const [salesFilterPaymentMethod, setSalesFilterPaymentMethod] = useState('all');
  const [salesSort, setSalesSort] = useState<{ field: string, order: 'asc' | 'desc' }>({ field: 'date', order: 'desc' });

  // Added barcode scan handling for POS
  const [scanBarcode, setScanBarcode] = useState('');

  // Forms data
  const [productForm, setProductForm] = useState({ name: '', category: 'Groceries', unit: 'pcs', cost_price: 0, retail_price: 0, wholesale_price: 0, stock_quantity: 0, min_stock_level: 5, expiry_date: '', barcode: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', address: '', notes: '', credit_limit: 0 });
  const [customerPaymentForm, setCustomerPaymentForm] = useState({ amount: 0, date: format(new Date(), 'yyyy-MM-dd'), description: 'Credit Payment' });
  const [invoiceForm, setInvoiceForm] = useState({ supplier_id: '', invoice_number: '', date: format(new Date(), 'yyyy-MM-dd'), total_amount: 0 });
  const [supplierForm, setSupplierForm] = useState({ name: '', contact_info: '' });
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'Salesperson' });
  const [expenseForm, setExpenseForm] = useState({ category: 'Rent', amount: 0, date: format(new Date(), 'yyyy-MM-dd'), description: '' });
  const [bankAccountForm, setBankAccountForm] = useState({ name: '', balance: 0 });
  const [adjustStockForm, setAdjustStockForm] = useState({ product_id: '', quantity_change: 0, reason: 'adjustment' });
  const [paymentForm, setPaymentForm] = useState({ supplier_id: '', invoice_id: '', amount: 0, date: format(new Date(), 'yyyy-MM-dd'), payment_method: 'Bank Transfer' });
  const [salesTrends, setSalesTrends] = useState<any[]>([]);
  const [reportYear, setReportYear] = useState<string>(new Date().getFullYear().toString());
  const [reportFilters, setReportFilters] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    salesperson: '',
    type: 'all'
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ id: user.uid, ...userDoc.data() } as any);
          } else {
            // First time login - bootstrap default admin if email matches or first user
            const defaultRole = user.email === 'nana038mail@gmail.com' ? 'Admin' : 'Salesperson';
            const userData = {
              uid: user.uid,
              username: user.email?.split('@')[0] || 'user',
              role: defaultRole,
              createdAt: serverTimestamp()
            };
            await setDoc(doc(db, 'users', user.uid), userData);
            setCurrentUser({ id: user.uid, ...userData } as any);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setCurrentUser(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Data Fetching
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribes: (() => void)[] = [];

    // Products
    unsubscribes.push(onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'products')));

    // Sales
    unsubscribes.push(onSnapshot(query(collection(db, 'sales'), orderBy('date', 'desc'), limit(100)), (snapshot) => {
      setSales(snapshot.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate?.()?.toISOString() || d.data().date } as any)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'sales')));

    // Customers
    unsubscribes.push(onSnapshot(collection(db, 'customers'), (snapshot) => {
      setCustomers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'customers')));

    // Expenses
    unsubscribes.push(onSnapshot(collection(db, 'expenses'), (snapshot) => {
      setExpenses(snapshot.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate?.()?.toISOString() || d.data().date } as any)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'expenses')));

    // Bank Accounts
    unsubscribes.push(onSnapshot(collection(db, 'bank_accounts'), (snapshot) => {
      setBankAccounts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'bank_accounts')));

    // Suppliers
    unsubscribes.push(onSnapshot(collection(db, 'suppliers'), (snapshot) => {
      setSuppliers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'suppliers')));

    // Users
    unsubscribes.push(onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users')));

    return () => unsubscribes.forEach(un => un());
  }, [currentUser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Derived Stats & Reports logic
  useEffect(() => {
    // Stock Value
    const totalVal = products.reduce((sum, p) => sum + (p.cost_price * p.stock_quantity), 0);
    setStockValue(totalVal);

    // Sales Trends (last 12 months)
    const trends: any[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach((m, i) => {
      const monthSales = sales.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === i && d.getFullYear().toString() === reportYear;
      });
      trends.push({
        month: m,
        total: monthSales.reduce((sum, s) => sum + s.total_amount, 0)
      });
    });
    setSalesTrends(trends);

    // Profit & Loss
    const filteredSales = sales.filter(s => {
      const d = s.date.split('T')[0];
      return d >= reportFilters.startDate && d <= reportFilters.endDate;
    });
    const income = filteredSales.reduce((sum, s) => sum + s.total_amount, 0);
    const filteredExpenses = expenses.filter(e => {
      const d = e.date.split('T')[0];
      return d >= reportFilters.startDate && d <= reportFilters.endDate;
    });
    const expenseTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Cost of goods sold (simplified)
    const cogs = filteredSales.reduce((sum, s) => {
      return sum + (s.items?.reduce((iSum: number, item: any) => iSum + (item.cost_price || 0) * item.quantity, 0) || 0);
    }, 0);

    setProfitLoss({
      total_sales: income,
      total_expenses: expenseTotal,
      cost_of_sales: cogs,
      gross_profit: income - cogs,
      net_profit: income - cogs - expenseTotal
    });

    // Product Performance
    const perfMap = new Map();
    filteredSales.forEach(s => {
      s.items?.forEach((item: any) => {
        const existing = perfMap.get(item.product_id) || { name: item.name, total_quantity: 0, total_revenue: 0 };
        perfMap.set(item.product_id, {
          ...existing,
          total_quantity: existing.total_quantity + item.quantity,
          total_revenue: existing.total_revenue + item.subtotal
        });
      });
    });
    setProductPerformance(Array.from(perfMap.values()));

  }, [sales, products, expenses, reportYear, reportFilters]);

  const hasPermission = (allowedRoles: Role[]) => {
    return currentUser && allowedRoles.includes(currentUser.role as Role);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      if (showSignup) {
        await createUserWithEmailAndPassword(auth, loginForm.email, loginForm.password);
        toast.success("Account created!");
      } else {
        await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
        toast.success("Welcome back!");
      }
    } catch (e: any) {
      setLoginError(e.message);
      toast.error(e.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 font-sans text-slate-900 overflow-hidden">
        <Toaster />
        <Card className="w-full max-w-md p-8 m-4">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-emerald-500 p-3 rounded-xl mb-4 text-white">
              <TrendingUp size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">ShopAssist</h1>
            <p className="text-slate-500">{showSignup ? 'Create your account' : 'Log in to manage your retail business.'}</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                required
                placeholder="email@example.com"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                value={loginForm.email}
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-emerald-500 text-white py-2 rounded-lg font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? 'Processing...' : (showSignup ? 'Sign Up' : 'Login')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
             Sign in with Google
          </button>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowSignup(!showSignup)}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {showSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>
        </Card>
      </div>
    );
  }

// Remove extra hasPermission

  const today = new Date();
  const thirtyDaysFromNow = addDays(today, 30);
  const expiringProducts = products.filter(p => {
    if (!p.expiry_date) return false;
    const expDate = parseISO(p.expiry_date);
    return isBefore(expDate, thirtyDaysFromNow) && p.stock_quantity > 0;
  });

  const handleSaveReport = async () => {
    if (!reportName.trim()) {
      toast.error('Please enter a report name');
      return;
    }
    try {
      await addDoc(collection(db, 'saved_reports'), {
        name: reportName,
        filters: reportFilters,
        createdAt: serverTimestamp()
      });
      toast.success('Report configuration saved');
      setReportName('');
      setIsSaveReportModalOpen(false);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'saved_reports');
    }
  };

  const loadSavedReport = (report: SavedReport) => {
    setReportFilters(report.filters);
    toast.success(`Loaded: ${report.name}`);
  };

  const viewCustomerDetail = async (customerId: string) => {
    setViewingCustomerId(customerId as any);
    setIsCustomerDetailModalOpen(true);
    try {
      // Fetch sales history
      const q = query(collection(db, 'sales'), where('customer_id', '==', customerId), orderBy('date', 'desc'), limit(50));
      onSnapshot(q, (sn) => {
        setCustomerHistory(sn.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate?.()?.toISOString() || d.data().date } as any)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `customers/${customerId}/history`));

      // CredHistory - for now we just show balance or implement a separate credits collection
      // For simplicity let's assume credit history is partly in sales items
    } catch (error) {
       console.error(error);
    }
  };

  const handleRecordCustomerPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingCustomerId) return;
    try {
      const payload = {
        customer_id: viewingCustomerId,
        amount: Number(customerPaymentForm.amount),
        date: serverTimestamp(),
        description: customerPaymentForm.description
      };
      await addDoc(collection(db, 'customer_payments'), payload);
      
      // Update customer balance
      const customerRef = doc(db, 'customers', viewingCustomerId as any);
      await updateDoc(customerRef, {
        balance: increment(-Number(customerPaymentForm.amount))
      });

      toast.success('Payment recorded');
      setIsCustomerPaymentModalOpen(false);
      setCustomerPaymentForm({ amount: 0, date: format(new Date(), 'yyyy-MM-dd'), description: 'Credit Payment' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'customer_payments');
    }
  };

  const handleBulkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updates = Object.fromEntries(
        Object.entries(bulkEditForm).filter(([_, v]) => v !== '' && v !== 0)
      );
      
      for (const id of selectedProductIds) {
        const productRef = doc(db, 'products', id as any);
        await updateDoc(productRef, updates);
      }

      toast.success('Products updated successfully');
      setIsBulkEditModalOpen(false);
      setSelectedProductIds([]);
    } catch (e) {
      console.error(e);
      toast.error('Failed to update products');
    }
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => {
          let val: any = values[i]?.trim();
          if (['cost_price', 'retail_price', 'wholesale_price', 'stock_quantity', 'min_stock_level'].includes(h)) {
            val = Number(val) || 0;
          }
          obj[h] = val;
        });
        return obj;
      }).filter(p => p.name);

      try {
        for (const item of data) {
           await addDoc(collection(db, 'products'), { ...item, createdAt: serverTimestamp() });
        }
        toast.success(`Succesfully imported ${data.length} products`);
      } catch (err) {
        toast.error('Import error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleAddSale = async (e: React.FormEvent | null, type: string = 'retail') => {
    if (e) e.preventDefault();
    if (type === 'credit' && !selectedCustomerId) {
      toast.error('Customer required for credit sales');
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    const saleData = {
      date: serverTimestamp(),
      total_amount: total,
      type: type,
      payment_method: salePaymentMethod,
      customer_name: selectedCustomer?.name || 'Walk-in Customer',
      customer_id: selectedCustomerId || null,
      salesperson_id: currentUser?.id || 'unknown',
      items: cart
    };

    try {
      const saleRef = await addDoc(collection(db, 'sales'), saleData);
      
      // Update stock quantities (client-side simple update)
      for (const item of cart) {
        const productRef = doc(db, 'products', item.product_id);
        await updateDoc(productRef, {
          stock_quantity: increment(-item.quantity)
        });
      }

      toast.success('Sale completed');
      setIsSaleModalOpen(false);
      setCart([]);
      setSelectedCustomerId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'sales');
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock_quantity) {
        toast.error('Insufficient stock');
        return;
      }
      setCart(cart.map(item => 
        item.product_id === product.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unit_price }
          : item
      ));
    } else {
      if (product.stock_quantity <= 0) {
        toast.error('Out of stock');
        return; 
      }
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        quantity: 1,
        unit_price: product.retail_price,
        subtotal: product.retail_price
      }]);
    }
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (String(item.product_id) === String(productId)) {
        const newQty = Math.max(1, item.quantity + delta);
        const product = products.find(p => String(p.id) === String(productId));
        if (delta > 0 && product && newQty > product.stock_quantity) {
          toast.error('Insufficient stock');
          return item;
        }
        return { ...item, quantity: newQty, subtotal: newQty * item.unit_price };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => String(item.product_id) !== String(productId)));
  };

  const handleBarcodeScanForPos = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && scanBarcode.trim()) {
      e.preventDefault();
      try {
        const q = query(collection(db, 'products'), where('barcode', '==', scanBarcode.trim()), limit(1));
        const snapshot = await onSnapshot(q, (sn) => {
           if (!sn.empty) {
             const product = { id: sn.docs[0].id, ...sn.docs[0].data() } as any as Product;
             addToCart(product);
             setScanBarcode('');
             toast.success(`Added: ${product.name}`);
           } else {
             toast.error('Product not found');
           }
        }, (err) => handleFirestoreError(err, OperationType.GET, 'products/barcode'));
      } catch (err) {
        console.error(err);
        toast.error('Scan error');
      }
    }
  };

  const handleBarcodeScanForAdjustment = async (barcode: string) => {
    if (!barcode.trim()) return;
    try {
      const q = query(collection(db, 'products'), where('barcode', '==', barcode.trim()), limit(1));
      onSnapshot(q, (sn) => {
         if (!sn.empty) {
           const product = { id: sn.docs[0].id, ...sn.docs[0].data() } as any as Product;
           setAdjustStockForm({ product_id: product.id, quantity_change: 0, reason: 'adjustment' });
           setIsAdjustStockModalOpen(true);
           toast.success(`Found: ${product.name}`);
         } else {
           toast.error('Product not found');
         }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'products/barcode'));
    } catch (err) {
      console.error(err);
      toast.error('Scan error');
    }
  };

  const totalCash = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const lowStockCount = products.filter(p => p.stock_quantity <= p.min_stock_level).length;

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    ).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const NAV_ITEMS = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Salesperson', 'InventoryManager'] },
    { id: 'inventory', icon: Package, label: 'Inventory', roles: ['Admin', 'InventoryManager'] },
    { id: 'pos', icon: ShoppingCart, label: 'POS Terminal', roles: ['Admin', 'Salesperson'] },
    { id: 'sales', icon: History, label: 'Sales History', roles: ['Admin', 'Salesperson'] },
    { id: 'crm', icon: Users, label: 'CRM', roles: ['Admin', 'Salesperson'] },
    { id: 'suppliers', icon: Users, label: 'Suppliers', roles: ['Admin', 'InventoryManager'] },
    { id: 'expenses', icon: Briefcase, label: 'Expenses', roles: ['Admin'] },
    { id: 'reports', icon: TrendingUp, label: 'Reports', roles: ['Admin'] },
    { id: 'users', icon: Settings, label: 'User Roles', roles: ['Admin'] }
  ];

  const visibleNavItems = NAV_ITEMS.filter(item => hasPermission(item.roles as Role[]));

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Modals */}
      {isPaymentModalOpen && hasPermission(['Admin', 'InventoryManager']) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Record Payment</h2>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const payload = {
                  ...paymentForm,
                  amount: Number(paymentForm.amount),
                  createdAt: serverTimestamp()
                };
                await addDoc(collection(db, 'supplier_payments'), payload);
                
                // Update supplier balance if needed
                if (paymentForm.supplier_id) {
                  const supplierRef = doc(db, 'suppliers', paymentForm.supplier_id as any);
                  await updateDoc(supplierRef, {
                    balance: increment(-Number(paymentForm.amount))
                  });
                }

                setIsPaymentModalOpen(false);
              } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, 'supplier_payments');
              }
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                <input type="number" step="0.01" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: Number(e.target.value)})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" value={paymentForm.date} onChange={e => setPaymentForm({...paymentForm, date: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                <select value={paymentForm.payment_method} onChange={e => setPaymentForm({...paymentForm, payment_method: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit">Credit</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-600">Save Payment</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isAdjustStockModalOpen && hasPermission(['Admin', 'InventoryManager']) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Adjust Stock</h2>
              <button onClick={() => setIsAdjustStockModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const productRef = doc(db, 'products', adjustStockForm.product_id);
                await updateDoc(productRef, {
                  stock_quantity: increment(adjustStockForm.quantity_change)
                });
                
                // Track transition in sales or a separate adjustments collection if needed
                // For now just update stock
                
                toast.success('Stock adjusted successfully');
                setIsAdjustStockModalOpen(false);
              } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, `products/${adjustStockForm.product_id}`);
              }
            }} className="p-6 space-y-4">
              {adjustStockForm.product_id && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 text-sm">
                  <span className="text-slate-500">Product:</span> <span className="font-bold text-slate-800">{products.find(p => String(p.id) === String(adjustStockForm.product_id))?.name}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Change (e.g. -5 or 10)</label>
                <input type="number" autoFocus value={adjustStockForm.quantity_change} onChange={e => setAdjustStockForm({...adjustStockForm, quantity_change: Number(e.target.value)})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <select value={adjustStockForm.reason} onChange={e => setAdjustStockForm({...adjustStockForm, reason: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="adjustment">General Adjustment</option>
                  <option value="damage">Damage</option>
                  <option value="loss">Loss</option>
                  <option value="count">Count Correction</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAdjustStockModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-600">Adjust</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isInvoiceModalOpen && hasPermission(['Admin', 'InventoryManager']) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Add Supplier Invoice</h2>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const payload = {
                supplier_id: fd.get('supplier_id'),
                invoice_number: fd.get('invoice_number'),
                date: fd.get('date'),
                total_amount: Number(fd.get('total_amount')),
                createdAt: serverTimestamp()
              };
              try {
                await addDoc(collection(db, 'supplier_invoices'), payload);
                setIsInvoiceModalOpen(false);
              } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, 'supplier_invoices');
              }
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                <select name="supplier_id" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 bg-white" required>
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} (Bal: {formatCurrency(s.balance)})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Number</label>
                <input type="text" name="invoice_number" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" name="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount ($)</label>
                <input type="number" step="0.01" name="total_amount" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-600">Save Invoice</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isSupplierModalOpen && hasPermission(['Admin', 'InventoryManager']) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Add Supplier</h2>
              <button onClick={() => setIsSupplierModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await addDoc(collection(db, 'suppliers'), {
                  ...supplierForm,
                  balance: 0,
                  createdAt: serverTimestamp()
                });
                toast.success('Supplier added successfully');
                setIsSupplierModalOpen(false);
                setSupplierForm({ name: '', contact_info: '' });
              } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, 'suppliers');
              }
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name</label>
                <input type="text" value={supplierForm.name} onChange={e => setSupplierForm({...supplierForm, name: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info</label>
                <input type="text" value={supplierForm.contact_info} onChange={e => setSupplierForm({...supplierForm, contact_info: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsSupplierModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-600">Save Supplier</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isUserModalOpen && hasPermission(['Admin']) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">{editingUserId ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => {
                setIsUserModalOpen(false);
                setEditingUserId(null);
                setUserForm({ username: '', password: '', role: 'Salesperson' });
              }} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const method = editingUserId ? 'PUT' : 'POST';
                const url = editingUserId ? `/api/users/${editingUserId}` : '/api/users';
                
                // Only send password if it's new or being changed, avoiding empty password on PUT
                const bodyData = { ...userForm };
                if (editingUserId && !userForm.password) {
                  delete (bodyData as any).password;
                }

                const res = await fetch(url, {
                  method: method,
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(bodyData)
                });
                if (res.ok) {
                  toast.success(editingUserId ? 'User updated successfully' : 'User added successfully');
                  setIsUserModalOpen(false);
                  setEditingUserId(null);
                  setUserForm({ username: '', password: '', role: 'Salesperson' });
                } else {
                  const errInfo = await res.json();
                  toast.error(errInfo.error || 'Failed to save user');
                }
              } catch (e) {
                toast.error('Network error');
              }
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input type="text" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password {editingUserId && <span className="text-slate-400 font-normal">(Leave blank to keep current)</span>}</label>
                <input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} required={!editingUserId} minLength={6} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500">
                  <option value="Salesperson">Salesperson</option>
                  <option value="InventoryManager">InventoryManager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => {
                  setIsUserModalOpen(false);
                  setEditingUserId(null);
                  setUserForm({ username: '', password: '', role: 'Salesperson' });
                }} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-600">{editingUserId ? 'Save Changes' : 'Save User'}</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isExpenseModalOpen && hasPermission(['Admin']) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Record Expense</h2>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await addDoc(collection(db, 'expenses'), {
                  ...expenseForm,
                  amount: Number(expenseForm.amount),
                  createdAt: serverTimestamp()
                });
                toast.success('Expense recorded');
                setIsExpenseModalOpen(false);
                setExpenseForm({ category: 'Rent', amount: 0, date: format(new Date(), 'yyyy-MM-dd'), description: '' });
              } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, 'expenses');
              }
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input type="text" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input type="number" step="0.01" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: parseFloat(e.target.value)})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input type="text" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-600">Save Expense</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isBankAccountModalOpen && hasPermission(['Admin']) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Add Bank Account</h2>
              <button onClick={() => setIsBankAccountModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await addDoc(collection(db, 'bank_accounts'), {
                  ...bankAccountForm,
                  balance: Number(bankAccountForm.balance),
                  createdAt: serverTimestamp()
                });
                toast.success('Bank Account created');
                setIsBankAccountModalOpen(false);
                setBankAccountForm({ name: '', balance: 0 });
              } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, 'bank_accounts');
              }
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Name</label>
                <input type="text" value={bankAccountForm.name} onChange={e => setBankAccountForm({...bankAccountForm, name: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Balance ($)</label>
                <input type="number" step="0.01" value={bankAccountForm.balance} onChange={e => setBankAccountForm({...bankAccountForm, balance: parseFloat(e.target.value)})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsBankAccountModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-600">Save Account</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isProductModalOpen && hasPermission(['Admin', 'InventoryManager']) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Add New Product</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const payload: any = Object.fromEntries(fd.entries());
              
              // Numeric conversion
              payload.cost_price = Number(payload.cost_price);
              payload.retail_price = Number(payload.retail_price);
              payload.wholesale_price = Number(payload.wholesale_price);
              payload.stock_quantity = Number(payload.stock_quantity);
              payload.min_stock_level = Number(payload.min_stock_level);
              payload.createdAt = serverTimestamp();

              try {
                await addDoc(collection(db, 'products'), payload);
                toast.success('Product added');
                setIsProductModalOpen(false);
              } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, 'products');
              }
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                  <input type="text" name="name" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input type="text" name="category" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                  <input type="text" name="unit" required placeholder="e.g. kg, pcs, box" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Barcode (Ready to Scan)</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="barcode" 
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 bg-emerald-50/30 transition-all focus:bg-white" 
                      placeholder="Scan/Type Barcode..."/>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:animate-pulse">
                      <History size={18} />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Initial Stock</label>
                  <input type="number" name="stock_quantity" required defaultValue="0" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min. Stock Level</label>
                  <input type="number" name="min_stock_level" required defaultValue="5" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price ($)</label>
                  <input type="number" step="0.01" name="cost_price" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Retail Price ($)</label>
                  <input type="number" step="0.01" name="retail_price" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Wholesale Price ($)</label>
                  <input type="number" step="0.01" name="wholesale_price" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date (Optional)</label>
                  <input type="date" name="expiry_date" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
                  <input type="url" name="image_url" placeholder="https://example.com/image.jpg" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-600">Save Product</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isCustomerModalOpen && hasPermission(['Admin', 'Salesperson']) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Add Customer</h2>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await addDoc(collection(db, 'customers'), {
                  ...customerForm,
                  balance: 0,
                  createdAt: serverTimestamp()
                });
                toast.success('Customer added');
                setIsCustomerModalOpen(false);
                setCustomerForm({ name: '', phone: '', email: '', address: '', notes: '', credit_limit: 0 });
              } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, 'customers');
              }
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input type="text" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="text" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input type="text" value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Credit Limit ($)</label>
                <input type="number" step="0.01" value={customerForm.credit_limit} onChange={e => setCustomerForm({...customerForm, credit_limit: Number(e.target.value)})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea value={customerForm.notes} onChange={e => setCustomerForm({...customerForm, notes: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 h-20" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 rounded-lg transition-colors">Save Customer</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isCustomerDetailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 italic">Customer Profile</h2>
              <button onClick={() => setIsCustomerDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {customers.find(c => c.id === viewingCustomerId) && (() => {
                const c = customers.find(cust => cust.id === viewingCustomerId)!;
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
                        <div className="space-y-3">
                          <p className="font-bold text-2xl text-slate-900">{c.name}</p>
                          <div className="flex items-center gap-2 text-slate-600"><Users size={16}/> {c.phone || 'No phone'}</div>
                          <div className="flex items-center gap-2 text-slate-600"><Settings size={16}/> {c.email || 'No email'}</div>
                          <div className="flex items-center gap-2 text-slate-600"><LayoutDashboard size={16}/> {c.address || 'No address'}</div>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                       <div className="flex items-center justify-between mb-4">
                         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Financial Status</h3>
                         <button 
                            onClick={() => setIsCustomerPaymentModalOpen(true)}
                            className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
                         >
                           Record Payment
                         </button>
                       </div>
                       <div className="space-y-4">
                         <div>
                           <p className="text-xs text-slate-500">Outstanding Balance</p>
                           <p className={cn("text-3xl font-bold", c.outstanding_balance > 0 ? "text-rose-600" : "text-emerald-600")}>
                             {formatCurrency(c.outstanding_balance || 0)}
                           </p>
                         </div>
                         <div>
                           <p className="text-xs text-slate-500">Credit Limit</p>
                           <p className="text-lg font-bold text-slate-800">{formatCurrency(c.credit_limit)}</p>
                         </div>
                       </div>
                     </div>
                   </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Detailed Credit History</h3>
                        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                              <tr>
                                <th className="px-4 py-3 font-bold text-slate-700">Date</th>
                                <th className="px-4 py-3 font-bold text-slate-700">Description</th>
                                <th className="px-4 py-3 font-bold text-slate-700 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {customerCreditHistory.map(item => (
                                <tr key={item.id}>
                                  <td className="px-4 py-3 text-slate-600 text-xs">{format(new Date(item.date), 'MMM d, yyyy')}</td>
                                  <td className="px-4 py-3">
                                    <p className="font-bold text-slate-800">{item.description}</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">{item.type}</p>
                                  </td>
                                  <td className={cn("px-4 py-3 font-bold text-right", item.type === 'debt' ? "text-rose-600" : "text-emerald-600")}>
                                    {item.type === 'payment' ? '-' : '+'}{formatCurrency(item.amount)}
                                  </td>
                                </tr>
                              ))}
                              {customerCreditHistory.length === 0 && (
                                <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400">No credit history.</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Purchase History</h3>
                        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                              <tr>
                                <th className="px-4 py-3 font-bold text-slate-700">Date</th>
                                <th className="px-4 py-3 font-bold text-slate-700">Amount</th>
                                <th className="px-4 py-3 font-bold text-slate-700">Type</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {customerHistory.map(sale => (
                                <tr key={sale.id}>
                                  <td className="px-4 py-3 text-slate-600 text-xs">{format(new Date(sale.date), 'MMM d, yyyy')}</td>
                                  <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(sale.total_amount)}</td>
                                  <td className="px-4 py-3 capitalize text-slate-500">{sale.type}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </Card>
        </div>
      )}

      {isSupplierDetailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between font-bold text-slate-800">
              <h2 className="text-xl">Supplier Payment History</h2>
              <button onClick={() => setIsSupplierDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {suppliers.find(s => s.id === viewingSupplierId) && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{suppliers.find(s => s.id === viewingSupplierId)?.name}</h3>
                      <p className="text-slate-500">{suppliers.find(s => s.id === viewingSupplierId)?.contact_info}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Balance Due</p>
                      <p className="text-3xl font-black text-rose-600">{formatCurrency(suppliers.find(s => s.id === viewingSupplierId)?.balance || 0)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <CreditCard size={18} className="text-blue-500"/> All Payments Made
                    </h4>
                    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Invoice #</th>
                            <th className="px-6 py-4">Method</th>
                            <th className="px-6 py-4 text-right">Amount Paid</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {supplierPaymentHistory.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic font-medium">No payments recorded for this supplier.</td></tr>
                          )}
                          {supplierPaymentHistory.map(payment => (
                            <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-slate-600 font-medium">{format(new Date(payment.date), 'MMM d, yyyy')}</td>
                              <td className="px-6 py-4 font-bold text-slate-900">{payment.invoice_number || 'Direct Payment'}</td>
                              <td className="px-6 py-4">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase">{payment.payment_method}</span>
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-blue-600">{formatCurrency(payment.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {isCustomerPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Record Customer Payment</h2>
              <button onClick={() => setIsCustomerPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleRecordCustomerPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                  value={customerPaymentForm.amount}
                  onChange={e => setCustomerPaymentForm({...customerPaymentForm, amount: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                  value={customerPaymentForm.date}
                  onChange={e => setCustomerPaymentForm({...customerPaymentForm, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Method / Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Cash Payment, Bank Transfer"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                  value={customerPaymentForm.description}
                  onChange={e => setCustomerPaymentForm({...customerPaymentForm, description: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
                Record Payment
              </button>
            </form>
          </Card>
        </div>
      )}

      {isBulkEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Bulk Edit Products</h2>
              <button onClick={() => setIsBulkEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleBulkUpdate} className="p-6 space-y-4">
              <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                Updating <span className="font-black text-slate-900">{selectedProductIds.length}</span> selected products. Leave fields empty to keep current values.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Category</label>
                <input 
                  type="text"
                  placeholder="e.g. Beverages"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                  value={bulkEditForm.category}
                  onChange={e => setBulkEditForm({...bulkEditForm, category: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Retail Price ($)</label>
                    <input 
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                      value={bulkEditForm.retail_price || ''}
                      onChange={e => setBulkEditForm({...bulkEditForm, retail_price: Number(e.target.value)})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Wholesale Price ($)</label>
                    <input 
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                      value={bulkEditForm.wholesale_price || ''}
                      onChange={e => setBulkEditForm({...bulkEditForm, wholesale_price: Number(e.target.value)})}
                    />
                 </div>
              </div>
              <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setIsBulkEditModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
                 <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">Apply Changes</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isSaveReportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Save Report Configuration</h2>
              <button onClick={() => setIsSaveReportModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Configuration Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Weekly Wholesale Audit"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
                  value={reportName}
                  onChange={e => setReportName(e.target.value)}
                />
              </div>
              <button onClick={handleSaveReport} className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Save Current Filters
              </button>
            </div>
          </Card>
        </div>
      )}

      {isSaleModalOpen && hasPermission(['Admin', 'Salesperson']) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-5xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <h2 className="text-xl font-bold text-slate-800">New Sale (POS)</h2>
                <select 
                  className="bg-slate-100 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 max-w-xs"
                  value={selectedCustomerId || ''}
                  onChange={e => setSelectedCustomerId(e.target.value || null)}
                >
                  <option value="">Walk-in Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button onClick={() => setIsCustomerModalOpen(true)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="New Customer">
                  <Plus size={20} />
                </button>
              </div>
              <div className="relative ml-4 flex-[1.5] flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text"
                    placeholder="Search product..."
                    value={localSearch}
                    onChange={e => setLocalSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="relative flex-1 group">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none group-focus-within:animate-bounce">
                     <History size={16} />
                   </div>
                   <input 
                     type="text"
                     autoFocus
                     value={scanBarcode}
                     onChange={e => setScanBarcode(e.target.value)}
                     onKeyDown={handleBarcodeScanForPos}
                     placeholder="Ready to Scan Barcode..."
                     className="w-full pl-9 pr-4 py-2 border border-emerald-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 font-mono shadow-sm"
                   />
                </div>
              </div>
              <button onClick={() => setIsSaleModalOpen(false)} className="text-slate-400 hover:text-slate-600 ml-4"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-hidden flex">
              <div className="w-2/3 p-6 overflow-y-auto border-r border-slate-100">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {products
                    .filter(p => {
                       if (!searchQuery) return true;
                       const q = searchQuery.toLowerCase();
                       return p.name.toLowerCase().includes(q) || 
                              p.category.toLowerCase().includes(q) || 
                              p.barcode?.includes(q);
                    })
                    .length === 0 && (
                      <div className="col-span-full py-12 text-center text-slate-400">
                        <Search className="mx-auto mb-2 opacity-20" size={48} />
                        <p className="text-sm italic">No products found matching "{searchQuery}"</p>
                      </div>
                    )}
                  {products
                    .filter(p => {
                       if (!searchQuery) return true;
                       const q = searchQuery.toLowerCase();
                       return p.name.toLowerCase().includes(q) || 
                              p.category.toLowerCase().includes(q) || 
                              p.barcode?.includes(q);
                    })
                    .sort((a, b) => b.stock_quantity - a.stock_quantity)
                    .map(product => {
                      const cartItem = cart.find(item => item.product_id === product.id);
                      return (
                      <button 
                        key={product.id}
                        onClick={() => addToCart(product)}
                        disabled={product.stock_quantity <= 0}
                        className={cn(
                          "p-4 rounded-xl border transition-all text-left group disabled:opacity-50 disabled:grayscale",
                          cartItem 
                            ? "border-emerald-500 bg-emerald-50/50" 
                            : "border-slate-200 hover:border-emerald-500 hover:bg-emerald-50"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-800 group-hover:text-emerald-700">{product.name}</p>
                          {cartItem && (
                            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                              {cartItem.quantity}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{product.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-slate-900">{formatCurrency(product.retail_price)}</span>
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold", product.stock_quantity > 0 ? "bg-white text-emerald-700 border border-emerald-100" : "bg-rose-100 text-rose-700")}>
                            {product.stock_quantity} left
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="w-1/3 p-6 bg-slate-50 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Cart</h3>
                  <button onClick={() => setCart([])} className="text-xs text-rose-600 hover:underline">Clear all</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {cart.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                      <ShoppingCart size={48} strokeWidth={1}/>
                      <p className="text-sm">Your cart is empty</p>
                    </div>
                  )}
                  {cart.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <button onClick={() => removeFromCart(item.product_id)} className="text-slate-400 hover:text-rose-600"><X size={14}/></button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border border-slate-100 rounded-lg p-1 bg-slate-50">
                          <button onClick={() => updateCartQuantity(item.product_id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-slate-50">-</button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.product_id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-slate-50">+</button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">{formatCurrency(item.unit_price)} ea</p>
                          <p className="text-sm font-bold text-slate-900">{formatCurrency(item.subtotal)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span className="text-slate-500 font-medium italic">Total Amount</span>
                    <span className="text-2xl">{formatCurrency(cart.reduce((sum, item) => sum + item.subtotal, 0))}</span>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Method</label>
                    <div className="flex gap-2">
                       {['cash', 'online', 'pos'].map(m => (
                         <button 
                           key={m}
                           onClick={() => setSalePaymentMethod(m as any)}
                           className={cn(
                             "flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all capitalize",
                             salePaymentMethod === m 
                               ? "bg-emerald-500 text-white border-emerald-600 shadow-md" 
                               : "bg-white text-slate-600 border-slate-200 hover:border-emerald-500"
                           )}
                         >
                           {m}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleAddSale(null, 'credit')} 
                      className="bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
                      disabled={cart.length === 0}
                    >
                      Credit Sale
                    </button>
                    <button 
                      onClick={() => handleAddSale(null, 'retail')}
                      disabled={cart.length === 0}
                      className="bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                    >
                      Cash Sale
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Sidebar Navigation */}
      <NavigationDrawer 
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        visibleNavItems={visibleNavItems}
        onLogout={handleLogout}
      />


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-bottom border-slate-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {activeTab === 'pos' ? 'POS Terminal' : 
             activeTab === 'sales' ? 'Sales History' : 
             activeTab.replace('_', ' ')}
          </h1>
          {['dashboard', 'sales', 'pos'].includes(activeTab) && (
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 w-64"
                />
              </div>
              <button 
                onClick={() => setIsSaleModalOpen(true)}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} /> New Transaction
              </button>
            </div>
          )}
        </header>

        <div className="p-8">
          {activeTab === 'pos' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="bg-emerald-100 p-8 rounded-full text-emerald-600 animate-pulse">
                <ShoppingCart size={64} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">POS Terminal</h2>
              <p className="text-slate-500 max-w-md text-center">Ready to sell products. Please use the "New Sale" button or scan a barcode to start a transaction.</p>
              <button 
                onClick={() => setIsSaleModalOpen(true)}
                className="mt-4 px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2"
              >
                <Plus size={20} /> New Sale Transaction
              </button>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search sale / customer..." 
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-emerald-500"
                      />
                   </div>
                   <select 
                     value={salesFilterPaymentMethod}
                     onChange={e => setSalesFilterPaymentMethod(e.target.value)}
                     className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                   >
                     <option value="all">All Payments</option>
                     <option value="cash">Cash</option>
                     <option value="online">Online</option>
                     <option value="pos">POS</option>
                   </select>
                </div>
                
                <div className="flex items-center gap-6">
                   <button 
                     onClick={() => {
                       const filtered = sales
                         .filter(s => !searchQuery || s.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || String(s.id).includes(searchQuery))
                         .filter(s => salesFilterPaymentMethod === 'all' || s.payment_method?.toLowerCase() === salesFilterPaymentMethod);
                       exportToCSV(filtered, 'sales_history');
                     }}
                     className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs"
                   >
                     Export CSV
                   </button>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Sales Volume</p>
                      <p className="text-xl font-bold text-slate-900">{formatCurrency(sales.reduce((sum, s) => sum + s.total_amount, 0))}</p>
                   </div>
                   <div className="h-10 w-px bg-slate-200"></div>
                   <div className="flex gap-4">
                      <div className="text-center">
                         <p className="text-[10px] text-emerald-600 font-bold uppercase">Cash</p>
                         <p className="text-sm font-bold text-slate-800">{formatCurrency(sales.filter(s => s.payment_method?.toLowerCase() === 'cash').reduce((sum, s) => sum + s.total_amount, 0))}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] text-blue-600 font-bold uppercase">Online</p>
                         <p className="text-sm font-bold text-slate-800">{formatCurrency(sales.filter(s => s.payment_method?.toLowerCase() === 'online').reduce((sum, s) => sum + s.total_amount, 0))}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] text-purple-600 font-bold uppercase">POS</p>
                         <p className="text-sm font-bold text-slate-800">{formatCurrency(sales.filter(s => s.payment_method?.toLowerCase() === 'pos').reduce((sum, s) => sum + s.total_amount, 0))}</p>
                      </div>
                   </div>
                </div>
              </div>

              <Card>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead>
                         <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <th className="px-6 py-4 font-medium">Sale ID</th>
                            <th 
                              className="px-6 py-4 font-medium cursor-pointer hover:text-slate-700 whitespace-nowrap"
                              onClick={() => setSalesSort({ field: 'date', order: salesSort.field === 'date' && salesSort.order === 'desc' ? 'asc' : 'desc' })}
                            >
                              Date {salesSort.field === 'date' && (salesSort.order === 'desc' ? '↓' : '↑')}
                            </th>
                            <th className="px-6 py-4 font-medium">Customer</th>
                            <th className="px-6 py-4 font-medium min-w-[150px]">Products Sold</th>
                            <th className="px-6 py-4 font-medium text-center">Payment</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th 
                              className="px-6 py-4 font-medium text-right cursor-pointer hover:text-slate-700"
                              onClick={() => setSalesSort({ field: 'total_amount', order: salesSort.field === 'total_amount' && salesSort.order === 'desc' ? 'asc' : 'desc' })}
                            >
                              Amount {salesSort.field === 'total_amount' && (salesSort.order === 'desc' ? '↓' : '↑')}
                            </th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                         {sales
                           .filter(s => {
                             if (!searchQuery) return true;
                             const q = searchQuery.toLowerCase();
                             return (s.customer_name?.toLowerCase().includes(q) || 
                                    String(s.id).includes(q) ||
                                    s.payment_method?.toLowerCase().includes(q) ||
                                    s.total_amount.toString().includes(q) ||
                                    format(new Date(s.date), 'MMM d, yyyy HH:mm').toLowerCase().includes(q) ||
                                    (s.items && s.items.some(item => item.product_name?.toLowerCase().includes(q))));
                           })
                           .filter(s => salesFilterPaymentMethod === 'all' || s.payment_method?.toLowerCase() === salesFilterPaymentMethod)
                           .length === 0 && (
                           <tr>
                             <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                               No sales records found matching your selection.
                             </td>
                           </tr>
                         )}
                         {sales
                           .filter(s => {
                             if (!searchQuery) return true;
                             const q = searchQuery.toLowerCase();
                             return (s.customer_name?.toLowerCase().includes(q) || 
                                    String(s.id).includes(q) ||
                                    s.payment_method?.toLowerCase().includes(q) ||
                                    s.total_amount.toString().includes(q) ||
                                    format(new Date(s.date), 'MMM d, yyyy HH:mm').toLowerCase().includes(q) ||
                                    (s.items && s.items.some(item => item.product_name?.toLowerCase().includes(q))));
                           })
                           .filter(s => salesFilterPaymentMethod === 'all' || s.payment_method?.toLowerCase() === salesFilterPaymentMethod)
                           .sort((a: any, b: any) => {
                             const order = salesSort.order === 'asc' ? 1 : -1;
                             if (salesSort.field === 'date') {
                               return (new Date(a.date).getTime() - new Date(b.date).getTime()) * order;
                             }
                             if (salesSort.field === 'total_amount') {
                               return (a.total_amount - b.total_amount) * order;
                             }
                             return 0;
                           })
                           .map(sale => (
                           <React.Fragment key={sale.id}>
                             <tr 
                               className={cn(
                                 "hover:bg-slate-50 transition-colors cursor-pointer border-l-2", 
                                 expandedSaleId === sale.id ? "bg-emerald-50/30 border-emerald-500" : "border-transparent"
                               )}
                               onClick={() => setExpandedSaleId(expandedSaleId === sale.id ? null : sale.id)}
                             >
                                <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                                  <div className="flex items-center gap-2">
                                    <ChevronRight size={12} className={cn("transition-transform", expandedSaleId === sale.id && "rotate-90 text-emerald-500")} />
                                    #{sale.id}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium">{format(new Date(sale.date), 'MMM d, HH:mm')}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{sale.customer_name}</td>
                                <td className="px-6 py-4">
                                   <div className="flex flex-col gap-0.5">
                                     {sale.items?.slice(0, 2).map((item, idx) => (
                                       <span key={idx} className="text-[10px] text-slate-500">
                                         {item.product_name} <span className="text-slate-400">({item.quantity})</span>
                                       </span>
                                     ))}
                                     {sale.items && sale.items.length > 2 && (
                                       <span className="text-[9px] text-emerald-600 font-bold italic">+{sale.items.length - 2} more items</span>
                                     )}
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                   <PaymentBadge method={sale.payment_method || 'Cash'} />
                                </td>
                                <td className="px-6 py-4">
                                   <span className={cn(
                                     "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                                     sale.type === 'retail' ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-600"
                                   )}>
                                     {sale.type}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(sale.total_amount)}</td>
                             </tr>
                             <AnimatePresence>
                               {expandedSaleId === sale.id && (
                                 <tr>
                                   <td colSpan={7} className="px-6 py-0 bg-slate-50/50">
                                     <motion.div
                                       initial={{ height: 0, opacity: 0 }}
                                       animate={{ height: 'auto', opacity: 1 }}
                                       exit={{ height: 0, opacity: 0 }}
                                       className="overflow-hidden"
                                     >
                                       <div className="py-6 px-4 space-y-6">
                                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                           <div>
                                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Order Details</p>
                                             <div className="space-y-1">
                                               <p className="text-sm font-medium">#{sale.id}</p>
                                               <p className="text-xs text-slate-500">{format(new Date(sale.date), 'MMMM d, yyyy HH:mm:ss')}</p>
                                             </div>
                                           </div>
                                           <div>
                                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Customer</p>
                                             <p className="text-sm font-medium">{sale.customer_name}</p>
                                             <p className="text-[10px] text-slate-500 italic">Retail Transaction</p>
                                           </div>
                                           <div>
                                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Payment Method</p>
                                             <PaymentBadge method={sale.payment_method || 'Cash'} />
                                           </div>
                                           <div className="text-right">
                                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                                             <p className="text-xl font-bold text-emerald-600">{formatCurrency(sale.total_amount)}</p>
                                           </div>
                                         </div>

                                         <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                                           <table className="w-full text-xs">
                                             <thead>
                                               <tr className="bg-slate-50 text-slate-500">
                                                 <th className="px-4 py-2 font-medium">Item Name</th>
                                                 <th className="px-4 py-2 font-medium text-center">Qty</th>
                                                 <th className="px-4 py-2 font-medium text-right">Unit Price</th>
                                                 <th className="px-4 py-2 font-medium text-right">Subtotal</th>
                                               </tr>
                                             </thead>
                                             <tbody className="divide-y divide-slate-100">
                                               {sale.items?.map((item, idx) => (
                                                 <tr key={idx}>
                                                   <td className="px-4 py-2 font-medium text-slate-700">{item.product_name}</td>
                                                   <td className="px-4 py-2 text-center text-slate-600">{item.quantity}</td>
                                                   <td className="px-4 py-2 text-right text-slate-600">{formatCurrency(item.unit_price)}</td>
                                                   <td className="px-4 py-2 text-right font-medium text-slate-900">{formatCurrency(item.subtotal)}</td>
                                                 </tr>
                                               ))}
                                             </tbody>
                                             <tfoot className="bg-slate-50/50 font-bold border-t border-slate-100">
                                               <tr>
                                                 <td colSpan={3} className="px-4 py-2 text-right text-slate-500 uppercase tracking-tighter text-[10px]">Grand Total</td>
                                                 <td className="px-4 py-2 text-right text-emerald-600">{formatCurrency(sale.total_amount)}</td>
                                               </tr>
                                             </tfoot>
                                           </table>
                                         </div>
                                       </div>
                                     </motion.div>
                                   </td>
                                 </tr>
                               )}
                             </AnimatePresence>
                           </React.Fragment>
                         ))}
                      </tbody>
                   </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Cash Flow" 
                  value={formatCurrency(totalCash)} 
                  icon={DollarSign} 
                  trend="up" 
                  trendValue="12.5%" 
                  color="bg-blue-500"
                />
                <StatCard 
                  title="Stock Value" 
                  value={formatCurrency(stockValue)} 
                  icon={Package} 
                  color="bg-purple-500"
                />
                <StatCard 
                  title="Monthly Revenue" 
                  value={formatCurrency(profitLoss?.revenue || 0)} 
                  icon={TrendingUp} 
                  trend="up" 
                  trendValue="8.2%" 
                  color="bg-emerald-500"
                />
                <StatCard 
                  title="Low Stock Items" 
                  value={lowStockCount} 
                  icon={AlertTriangle} 
                  color="bg-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <Card className="lg:col-span-2 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-slate-800">Sales Overview</h2>
                    <select className="text-sm border-slate-200 rounded-md">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sales.slice(0, 7).reverse().map(s => ({ name: format(new Date(s.date), 'MMM d'), total: s.total_amount }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Recent Transactions */}
                <Card className="p-6">
                  <h2 className="font-bold text-slate-800 mb-6">Recent Sales</h2>
                  <div className="space-y-4">
                    {sales.length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-4">No recent sales.</p>
                    )}
                    {sales.slice(0, 5).map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-full",
                            sale.type === 'retail' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                          )}>
                            <ShoppingCart size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{sale.customer_name || 'Walk-in Customer'}</p>
                            <p className="text-xs text-slate-500">{format(new Date(sale.date), 'MMM d, h:mm a')}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(sale.total_amount)}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1">
                    View All <ChevronRight size={16} />
                  </button>
                </Card>
              </div>

              {/* Bottom Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Low Stock Alert */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="text-amber-500" size={20} /> Low Stock Alerts
                    </h2>
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">{lowStockCount} Items</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-100">
                          <th className="pb-3 font-medium">Product</th>
                          <th className="pb-3 font-medium">Category</th>
                          <th className="pb-3 font-medium">In Stock</th>
                          <th className="pb-3 font-medium">Min Level</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {products.filter(p => p.stock_quantity <= p.min_stock_level).slice(0, 5).map(product => (
                          <tr key={product.id} className="group">
                            <td className="py-4 font-medium text-slate-800">{product.name}</td>
                            <td className="py-4 text-slate-500">{product.category}</td>
                            <td className="py-4">
                              <span className="text-rose-600 font-bold">{product.stock_quantity}</span> {product.unit}
                            </td>
                            <td className="py-4 text-slate-500">{product.min_stock_level}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Expiry Alerts */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="text-rose-500" size={20} /> Expiring Soon
                    </h2>
                    <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold">{expiringProducts.length} Items</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-100">
                          <th className="pb-3 font-medium">Product</th>
                          <th className="pb-3 font-medium">In Stock</th>
                          <th className="pb-3 font-medium">Expiry Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {expiringProducts.length === 0 && (
                          <tr><td colSpan={3} className="py-4 text-center text-slate-500">No products expiring soon.</td></tr>
                        )}
                        {expiringProducts.slice(0, 5).map(product => (
                          <tr key={product.id} className="group">
                            <td className="py-4 font-medium text-slate-800">{product.name}</td>
                            <td className="py-4"><span className="font-bold">{product.stock_quantity}</span> {product.unit}</td>
                            <td className="py-4">
                              <span className="bg-rose-100/50 text-rose-700 px-2 py-1 rounded text-xs font-bold border border-rose-200 shadow-sm flex items-center w-fit gap-1">
                                <AlertTriangle size={12} /> {format(parseISO(product.expiry_date!), 'MMM d, yyyy')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Bank Balances */}
                <Card className="p-6">
                  <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <CreditCard className="text-blue-500" size={20} /> Bank Accounts
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bankAccounts.map(account => (
                      <div key={account.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{account.name}</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(account.balance)}</p>
                      </div>
                    ))}
                    <button onClick={() => setIsBankAccountModalOpen(true)} className="p-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all flex flex-col items-center justify-center gap-1">
                      <Plus size={20} />
                      <span className="text-xs font-medium">Add Account</span>
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search / Scan barcode to adjust..." 
                      className="pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 w-80"
                      value={localSearch}
                      onChange={e => {
                        setLocalSearch(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && localSearch.trim()) {
                          // Check if it looks like a barcode (mostly numbers and long-ish)
                          if (localSearch.length >= 8 && /^\d+$/.test(localSearch)) {
                            handleBarcodeScanForAdjustment(localSearch);
                            setLocalSearch('');
                          }
                        }
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none group-focus-within:animate-bounce">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <select 
                    className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm"
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {Array.from(new Set(products.map(p => p.category))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {selectedProductIds.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg animate-in fade-in slide-in-from-left-2">
                       <span className="text-xs font-bold text-emerald-700">{selectedProductIds.length} Selected</span>
                       <button onClick={() => setIsBulkEditModalOpen(true)} className="text-xs font-bold text-emerald-600 hover:underline ml-2">Bulk Update</button>
                       <button onClick={() => setSelectedProductIds([])} className="p-1 text-slate-400 hover:text-rose-500"><X size={14}/></button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="file" 
                    id="csv-import" 
                    className="hidden" 
                    accept=".csv" 
                    onChange={handleImportCSV}
                  />
                  <label 
                    htmlFor="csv-import"
                    className="px-4 py-2 text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200 cursor-pointer flex items-center gap-2"
                  >
                    Import Products
                  </label>
                  <button 
                    onClick={() => {
                      const filtered = products
                        .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode?.includes(searchQuery) || String(p.id).includes(searchQuery))
                        .filter(p => !categoryFilter || p.category === categoryFilter);
                      exportToCSV(filtered, 'inventory');
                    }}
                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 flex items-center gap-2"
                  >
                    Export CSV
                  </button>
                  <button onClick={() => setIsProductModalOpen(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                    <Plus size={18} /> Add Product
                  </button>
                </div>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <th className="px-6 py-4 w-10">
                           <input 
                             type="checkbox" 
                             className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                             onChange={(e) => {
                               if (e.target.checked) {
                                 setSelectedProductIds(products.map(p => p.id));
                               } else {
                                 setSelectedProductIds([]);
                               }
                             }}
                           />
                        </th>
                        <th className="px-6 py-4 font-medium">Barcode / ID</th>
                        <th className="px-2 py-4 font-medium">Image</th>
                        <th className="px-6 py-4 font-medium">Product Name</th>
                        <th className="px-6 py-4 font-medium">Category</th>
                        <th className="px-6 py-4 font-medium">Stock</th>
                        <th className="px-6 py-4 font-medium">Cost Price</th>
                        <th className="px-6 py-4 font-medium">Retail Price</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products
                        .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode?.includes(searchQuery) || String(p.id).includes(searchQuery))
                        .filter(p => !categoryFilter || p.category === categoryFilter)
                        .length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                            No products found matching criteria.
                          </td>
                        </tr>
                      )}
                      {products
                        .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode?.includes(searchQuery) || String(p.id).includes(searchQuery))
                        .filter(p => !categoryFilter || p.category === categoryFilter)
                        .map(product => (
                        <tr key={product.id} className={cn("hover:bg-slate-50 transition-colors", selectedProductIds.includes(product.id) && "bg-emerald-50/30", product.stock_quantity <= product.min_stock_level && "bg-rose-50/70")}>
                          <td className="px-6 py-4">
                             <input 
                               type="checkbox" 
                               checked={selectedProductIds.includes(product.id)}
                               onChange={() => {
                                 if (selectedProductIds.includes(product.id)) {
                                   setSelectedProductIds(selectedProductIds.filter(id => id !== product.id));
                                 } else {
                                   setSelectedProductIds([...selectedProductIds, product.id]);
                                 }
                               }}
                               className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                             />
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-mono text-xs">{product.barcode || `#${product.id}`}</td>
                          <td className="px-2 py-4">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                <Package size={20} />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{product.category}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-bold",
                                product.stock_quantity <= product.min_stock_level ? "text-rose-600" : "text-slate-900"
                              )}>{product.stock_quantity}</span> {product.unit}
                              {product.stock_quantity <= product.min_stock_level && (
                                <AlertTriangle size={14} className="text-rose-500" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{formatCurrency(product.cost_price)}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(product.retail_price)}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => {
                              setAdjustStockForm({ product_id: product.id, quantity_change: 0, reason: 'adjustment' });
                              setIsAdjustStockModalOpen(true);
                            }} className="text-emerald-500 font-medium text-sm hover:underline">Adjust Stock</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'crm' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search customers..." 
                      className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 w-80"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <button onClick={() => setIsCustomerModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
                  <Plus size={18} /> Add Customer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers
                  .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone?.includes(searchQuery))
                  .map(customer => (
                  <Card key={customer.id} className="p-6 group cursor-pointer hover:border-blue-300 transition-all" onClick={() => viewCustomerDetail(customer.id)}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Users size={24} />
                      </div>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{customer.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{customer.phone || 'No phone'}</p>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Balance</p>
                        <p className={cn("text-lg font-bold", customer.outstanding_balance > 0 ? "text-rose-600" : "text-emerald-600")}>
                          {formatCurrency(customer.outstanding_balance)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total History</p>
                        <p className="text-lg font-bold text-slate-800 italic">View Profile</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && hasPermission(['Admin', 'InventoryManager']) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-slate-800">Supplier Management</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search suppliers..." 
                      value={localSearch}
                      onChange={e => setLocalSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <button onClick={() => setIsSupplierModalOpen(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2">
                  <Plus size={18} /> Add Supplier
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers
                  .filter(s => {
                    if (!searchQuery) return true;
                    const q = searchQuery.toLowerCase();
                    return s.name.toLowerCase().includes(q) || 
                           (s.contact_person?.toLowerCase()?.includes(q)) || 
                           (s.email?.toLowerCase()?.includes(q)) || 
                           (s.phone?.toLowerCase()?.includes(q));
                  })
                  .length === 0 && (
                  <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Package className="mx-auto text-slate-300 mb-2" size={48} />
                    <p className="text-slate-500 font-medium">No suppliers match your search query.</p>
                  </div>
                )}
                {suppliers
                  .filter(s => {
                    if (!searchQuery) return true;
                    const q = searchQuery.toLowerCase();
                    return s.name.toLowerCase().includes(q) || 
                           (s.contact_person?.toLowerCase()?.includes(q)) || 
                           (s.email?.toLowerCase()?.includes(q)) || 
                           (s.phone?.toLowerCase()?.includes(q));
                  })
                  .map(supplier => (
                    <Card key={supplier.id} className="p-6 group hover:border-emerald-300 transition-all cursor-pointer" onClick={async () => {
                      setViewingSupplierId(supplier.id);
                      setIsSupplierDetailModalOpen(true);
                      const q = query(collection(db, 'supplier_payments'), where('supplier_id', '==', supplier.id), orderBy('date', 'desc'), limit(50));
                      onSnapshot(q, (sn) => {
                        setSupplierPaymentHistory(sn.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate?.()?.toISOString() || d.data().date } as any)));
                      }, (err) => handleFirestoreError(err, OperationType.LIST, `suppliers/${supplier.id}/payments`));
                    }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        <Users size={20} />
                      </div>
                      <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded",
                        supplier.balance > 0 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                      )}>
                        {supplier.balance > 0 ? 'Outstanding Balance' : 'Clear'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{supplier.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{supplier.contact_info}</p>
                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Balance</p>
                        <p className="text-xl font-bold text-slate-900">{formatCurrency(supplier.balance)}</p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <button onClick={(e) => { e.stopPropagation(); setIsInvoiceModalOpen(true); }} className="text-emerald-600 font-medium text-xs hover:underline">Add Invoice</button>
                        <span className="text-[10px] text-slate-400 font-bold italic group-hover:text-emerald-500 transition-colors">View Payments</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Added Invoices List */}
              <Card className="mt-8">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Recent Supplier Invoices</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <th className="px-6 py-4 font-medium">Invoice #</th>
                        <th className="px-6 py-4 font-medium">Supplier</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Total</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoices
                        .filter(inv => {
                           if (!searchQuery) return true;
                           const q = searchQuery.toLowerCase();
                           return inv.invoice_number.toLowerCase().includes(q) || 
                                  inv.supplier_name?.toLowerCase()?.includes(q) || 
                                  inv.status.toLowerCase().includes(q);
                        })
                        .length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                            No invoices found matching your search.
                          </td>
                        </tr>
                      )}
                      {invoices
                        .filter(inv => {
                           if (!searchQuery) return true;
                           const q = searchQuery.toLowerCase();
                           return inv.invoice_number.toLowerCase().includes(q) || 
                                  inv.supplier_name?.toLowerCase()?.includes(q) || 
                                  inv.status.toLowerCase().includes(q);
                        })
                        .map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{inv.invoice_number}</td>
                          <td className="px-6 py-4 text-slate-600">{inv.supplier_name}</td>
                          <td className="px-6 py-4 text-slate-600">{format(new Date(inv.date), 'MMM d, yyyy')}</td>
                          <td className="px-6 py-4 font-bold text-rose-600">{formatCurrency(inv.total_amount)}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded",
                              inv.status === 'paid' ? "bg-emerald-100 text-emerald-700" :
                              inv.status === 'partial' ? "bg-amber-100 text-amber-700" :
                              "bg-rose-100 text-rose-700"
                            )}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {inv.status !== 'paid' && (
                              <button onClick={() => {
                                setPaymentForm({ ...paymentForm, supplier_id: String(inv.supplier_id), invoice_id: String(inv.id) });
                                setIsPaymentModalOpen(true);
                              }} className="text-emerald-600 text-sm font-medium hover:underline">
                                Record Payment
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'expenses' && hasPermission(['Admin']) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Business Expenses</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      const filtered = expenses.filter(e => !searchQuery || e.description.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase()));
                      exportToCSV(filtered, 'expenses');
                    }}
                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    Export CSV
                  </button>
                  <button onClick={() => setIsExpenseModalOpen(true)} className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors flex items-center gap-2">
                    <Plus size={18} /> Record Expense
                  </button>
                </div>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Category</th>
                        <th className="px-6 py-4 font-medium">Description</th>
                        <th className="px-6 py-4 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {expenses
                        .filter(e => !searchQuery || e.description.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase()))
                        .length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                            No expenses recorded.
                          </td>
                        </tr>
                      )}
                      {expenses
                        .filter(e => !searchQuery || e.description.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(expense => (
                        <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-600">{format(new Date(expense.date), 'MMM d, yyyy')}</td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase">{expense.category}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{expense.description}</td>
                          <td className="px-6 py-4 text-right font-bold text-rose-600">{formatCurrency(expense.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'users' && hasPermission(['Admin']) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-slate-800">User Management</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={localSearch}
                      onChange={e => setLocalSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <button onClick={() => setIsUserModalOpen(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2">
                  <Plus size={18} /> Add User
                </button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <th className="px-6 py-4 font-medium">Username</th>
                        <th className="px-6 py-4 font-medium">Role</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users
                        .filter(u => !searchQuery || u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()))
                        .length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                            No users found matching your search.
                          </td>
                        </tr>
                      )}
                      {users
                        .filter(u => !searchQuery || u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(user => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "text-xs font-bold px-2 py-1 rounded",
                              user.role === 'Admin' ? "bg-purple-100 text-purple-700" :
                              user.role === 'InventoryManager' ? "bg-blue-100 text-blue-700" :
                              "bg-emerald-100 text-emerald-700"
                            )}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              className="text-slate-400 hover:text-emerald-500 font-medium"
                              onClick={() => {
                                setEditingUserId(user.id);
                                setUserForm({ username: user.username, password: '', role: user.role });
                                setIsUserModalOpen(true);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'reports' && hasPermission(['Admin']) && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                    <Calendar size={18} className="text-slate-400" />
                    <input type="date" value={reportFilters.startDate} onChange={e => setReportFilters({...reportFilters, startDate: e.target.value})} className="text-sm border-none focus:ring-0 p-0" />
                    <span className="text-slate-400">to</span>
                    <input type="date" value={reportFilters.endDate} onChange={e => setReportFilters({...reportFilters, endDate: e.target.value})} className="text-sm border-none focus:ring-0 p-0" />
                  </div>
                  <select 
                    value={reportFilters.salesperson} 
                    onChange={e => setReportFilters({...reportFilters, salesperson: e.target.value})}
                    className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm"
                  >
                    <option value="">All Salespersons</option>
                    {users.filter(u => u.role === 'Salesperson' || u.role === 'Admin').map(u => <option key={u.id} value={u.username}>{u.username}</option>)}
                  </select>
                  <select 
                    value={reportFilters.type} 
                    onChange={e => setReportFilters({...reportFilters, type: e.target.value})}
                    className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm"
                  >
                    <option value="all">All Sale Types</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="credit">Credit</option>
                  </select>
              <button 
                onClick={async () => {
                  toast.success('Reports updated');
                }}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Generate Report
              </button>
                   <button 
                    onClick={() => setIsSaveReportModalOpen(true)}
                    className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 flex items-center gap-2"
                  >
                    Save Configuration
                  </button>
                  <button 
                    onClick={() => exportToCSV(sales, 'sales_report')}
                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    Export Sales CSV
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profit & Loss */}
                    <Card className="p-8">
                      <h2 className="text-lg font-bold text-slate-800 mb-8">Profit & Loss Statement</h2>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                          <span className="text-slate-600">Total Revenue</span>
                          <span className="font-bold text-slate-900">{formatCurrency(profitLoss?.revenue || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                          <span className="text-slate-600">Cost of Goods Sold (COGS)</span>
                          <span className="font-bold text-rose-600">-{formatCurrency(profitLoss?.cogs || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-4 bg-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-800">Gross Profit</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(profitLoss?.grossProfit || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                          <span className="text-slate-600">Operating Expenses</span>
                          <span className="font-bold text-rose-600">-{formatCurrency(profitLoss?.expenses || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 px-4 bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20">
                          <span className="font-bold text-lg">Net Profit</span>
                          <span className="font-bold text-2xl">{formatCurrency(profitLoss?.netProfit || 0)}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Inventory Value */}
                    <Card className="p-8">
                      <h3 className="font-bold text-slate-800 mb-4">Inventory Value Report</h3>
                      <div className="flex items-center justify-between bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <div>
                          <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider mb-1">Total Inventory Value</p>
                          <p className="text-3xl font-black text-emerald-900">{formatCurrency(stockValue)}</p>
                        </div>
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                          <TrendingUp size={32} />
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-slate-500 italic">* Based on current cost price and stock levels across all products.</p>
                      <div className="mt-8 pt-8 border-t border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-2">Saved Report Configs</h4>
                        <p className="text-xs text-slate-400">Manage and load your saved report filters from the sidebar.</p>
                      </div>
                    </Card>
                  </div>

                  {/* Sales Analytics */}
                  <Card className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-lg font-bold text-slate-800">Monthly Sales Trends</h2>
                      <select 
                        className="text-sm border-slate-200 rounded-lg px-4 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                        value={reportYear}
                        onChange={(e) => setReportYear(e.target.value)}
                      >
                        <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                        <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                        <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
                      </select>
                    </div>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesTrends}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Line type="monotone" name="Total Sales" dataKey="total" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Product Performance Report */}
                  <Card className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">Product Performance</h2>
                        <p className="text-sm text-slate-500 text-xs">Individual product metrics for selected period</p>
                      </div>
                      <button 
                        onClick={() => exportToCSV(productPerformance, 'product_performance')}
                        className="text-xs font-bold text-emerald-600 hover:underline"
                      >
                        Export Performance CSV
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm">
                          <thead>
                             <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <th className="px-6 py-4 font-medium">Product Name</th>
                                <th className="px-6 py-4 font-medium">Qty Sold</th>
                                <th className="px-6 py-4 font-medium">Revenue</th>
                                <th className="px-6 py-4 font-medium">Profit</th>
                                <th className="px-6 py-4 font-medium text-right">Margin</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {productPerformance.length === 0 && (
                               <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No data available for this period.</td></tr>
                             )}
                             {productPerformance.map((item, idx) => (
                               <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                                  <td className="px-6 py-4 text-slate-600">{item.quantity_sold}</td>
                                  <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(item.total_revenue)}</td>
                                  <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(item.total_profit)}</td>
                                  <td className="px-6 py-4 text-right">
                                     <span className={cn(
                                       "px-2 py-1 rounded-full text-[10px] font-black",
                                       item.profit_margin > 30 ? "bg-emerald-100 text-emerald-700" : 
                                       item.profit_margin > 15 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                                     )}>
                                       {item.profit_margin.toFixed(1)}%
                                     </span>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                   <Card className="p-6 h-full flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                       <History size={18} className="text-blue-500"/> Saved Configs
                    </h3>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                       {savedReports.length === 0 && (
                         <div className="text-center py-12 text-slate-400">
                           <p className="text-sm">No saved configurations.</p>
                         </div>
                       )}
                       {savedReports.map(report => (
                         <div key={report.id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-300 transition-all bg-white group shadow-sm">
                           <div className="flex items-center justify-between mb-2">
                             <p className="font-bold text-slate-800 group-hover:text-blue-600 text-sm truncate">{report.name}</p>
                             <button onClick={() => loadSavedReport(report)} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Load</button>
                           </div>
                           <div className="flex flex-wrap gap-1">
                             <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{report.filters.startDate} - {report.filters.endDate}</span>
                             {report.filters.salesperson && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{report.filters.salesperson}</span>}
                           </div>
                         </div>
                       ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
