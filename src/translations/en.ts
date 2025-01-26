const enTranslations = {
  welcome: 'Welcome',
  login: 'Login',
  logout: 'Logout',
  settings: 'Settings',
  language: 'Language',
  theme: 'Theme',
  dark: 'Dark',
  light: 'Light',
  system: 'System',
  error: 'Error',
  success: 'Success',
  warning: 'Warning',
  info: 'Info',
  close: 'Close',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  remove: 'Remove',
  confirm: 'Confirm',
  reject: 'Reject',
  loading: 'Loading',
  no_data: 'No data',
  required: 'Required',
  invalid: 'Invalid',
  min: 'Minimum',
  max: 'Maximum',
  length: 'Length',
  pattern: 'Pattern',
  match: 'Match',
  unique: 'Unique',
  exists: 'Exists',
  not_found: 'Not found',
  unauthorized: 'Unauthorized',
  forbidden: 'Forbidden',
  server_error: 'Server error',
  network_error: 'Network error',
  timeout: 'Timeout',
  unknown_error: 'Unknown error',
  try_again: 'Try again',
  refresh: 'Refresh',
  reload: 'Reload',
  reset: 'Reset',
  clear: 'Clear',
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',
  asc: 'Ascending',
  desc: 'Descending',
  next: 'Next',
  prev: 'Previous',
  first: 'First',
  last: 'Last',
  page: 'Page',
  of: 'of',
  total: 'Total',
  items: 'Items',
  selected: 'Selected',
  all: 'All',
  none: 'None',
  'select.month': 'Select Month',
  'balance.for': 'Balance for',
  'monthly.recurring.income': 'Monthly Recurring Income',
  'monthly.recurring.expenses': 'Monthly Recurring Expenses',
  'annual.total.revenue': 'Annual Total Revenue',
  'annual.total.expenses': 'Annual Total Expenses',
  'annual.total.profit.loss': 'Annual Total Profit/Loss',
  'annual.recurring.income': 'Annual Recurring Income',
  'annual.recurring.expenses': 'Annual Recurring Expenses',
  'annual.recurring.difference': 'Annual Recurring Difference',
  'show.annual.stats': 'Show Annual Stats',
  'hide.annual.stats': 'Hide Annual Stats',
  'recurring.deleted': 'Recurring transaction deleted',
  'transaction.deleted': 'Transaction deleted',
  'pdf.export.failed.description': 'PDF export failed. Please try again.',
  login_required: 'Login required',
  'save.failed': 'Save failed',
  'data.loaded': 'Data loaded',
  'data.loaded.success': 'Data loaded successfully',
  'pdf.exported': 'PDF exported',
  'pdf.exported.success': 'PDF exported successfully',
  'pdf.export.failed': 'PDF export failed',
  'data.reset': 'Data reset',
  'data.reset.success': 'Data reset successfully',
  'category.food': 'Food',
  'category.transport': 'Transport',
  'category.utilities': 'Utilities',
  'category.entertainment': 'Entertainment',
  'category.shopping': 'Shopping',
  'category.health': 'Health',
  'category.education': 'Education',
  'category.other': 'Other',
  'category.housing': 'Housing',
  'income.added': 'Income added',
  'expense.added': 'Expense added',
  'loading.failed': 'Loading failed',
  'save.data': 'Save data',
  'amount': 'Amount',
  'description': 'Description',
  'date': 'Date',
  'income': 'Income',
  'expense': 'Expense',
  'expenses': 'Expenses',
  'processing': 'Processing',
  'add.income': 'Add Income',
  'add.expense': 'Add Expense',
  'enter.amount': 'Enter amount',
  'enter.description': 'Enter description',
  'pick.date': 'Pick date',
  'fill.required': 'Please fill all required fields',
  'invalid.credentials': 'Invalid credentials',
  'login.success': 'Login successful',
  'account.creation.failed': 'Account creation failed',
  'account.created': 'Account created successfully',
  'login.failed': 'Login failed',
  'welcome.back': 'Welcome back',
  'create.account': 'Create an account',
  'auth.signin.description': 'Sign in to your account',
  'auth.signup.description': 'Create a new account',
  'loading.description': 'Loading data',
  'load.data': 'Load data',
  'load.data.description': 'Loading saved data',
  'email': 'Email',
  'password': 'Password',
  'enter.email': 'Enter your email',
  'enter.password': 'Enter your password',
  'recurring.transactions': 'Recurring Transactions',
  'saving': 'Saving',
  'saving.description': 'Saving data',
  'data.saved': 'Data saved',
  'account.exists': 'Account already exists',
  'confirm.save': 'Confirm save',
  'confirm.save.description': 'Are you sure you want to save?',
  'reset.data': 'Reset data',
  'confirm.reset': 'Confirm reset',
  'confirm.reset.description': 'Are you sure you want to reset?',
  'sign.in': 'Sign In',
  'create.account.description': 'Create an account to save your data',
  'sign.in.description': 'Sign in to access your data',
  'data.saved.locally': 'Data saved locally',
  'data.synced': 'Data synced with the server',
  'amount.updated': 'Amount updated',
  'transaction.history': 'Transaction History',
  'all.time': 'All time',
  'show.selected.month': 'Show Selected Month',
  'show.all.transactions': 'Show All Transactions',
  'view.all.transactions': 'View All Transactions',
  'no.transactions': 'No transactions',
  'add.transaction': 'Add Transaction',
  'logout.success': 'Logout successful',
  'logout.failed': 'Logout failed',
  'menu': 'Menu',
  'expense.categorized': 'Expense categorized',
  'category': 'Category',
  'monthly': 'Monthly',
  'financial.runway.with.balances': 'Financial Runway (with balances)',
  'financial.runway.without.balances': 'Financial Runway (without balances)',
  'session.check.failed': 'Session check failed',
  'back.to.dashboard': 'Back to Dashboard',
  'no.categorized.expenses': 'No categorized expenses',
  'expenses.by.category': 'Expenses by Category',
  'transaction.failed': 'Transaction failed',
  'current.bank.balance': 'Current Bank Balance',
  'current.debt.balance': 'Current Debt Balance',
  'app.name': 'Financial Management',
  'financial.analysis': 'Financial Analysis',
  'generate.analysis': 'Generate Analysis',
  'current.balance': 'Current Balance',
  'current.debt': 'Current Debt',
  'financial.projection.calculator': 'Financial Projection Calculator',
  'annual.revenue.per.customer': 'Annual Revenue per Customer (€)',
  'monthly.growth.percentage': 'Monthly Growth Rate (%)',
  'calculate.projection': 'Calculate Projection',
  'revenue.projection': 'Revenue Projection',
  'monthly.revenue': 'Monthly Revenue',
  'annual.recurring.revenue': 'Annual Recurring Revenue (ARR)',
  'annual.churn.rate': 'Annual Churn Rate (%/customers)',
} as const;

export default enTranslations;
