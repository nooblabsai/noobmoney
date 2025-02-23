export type Language = 'en' | 'el';

export type TranslationKey =
  | 'dashboard'
  | 'transactions'
  | 'settings'
  | 'logout'
  | 'dark.mode'
  | 'light.mode'
  | 'system'
  | 'theme'
  | 'language'
  | 'english'
  | 'greek'
  | 'add.transaction'
  | 'edit.transaction'
  | 'delete.transaction'
  | 'amount'
  | 'date'
  | 'category'
  | 'note'
  | 'type'
  | 'income'
  | 'expense'
  | 'expenses'
  | 'save'
  | 'cancel'
  | 'confirm.delete'
  | 'confirm.delete.message'
  | 'yes.delete'
  | 'no.cancel'
  | 'transaction.added'
  | 'transaction.updated'
  | 'transaction.deleted'
  | 'error.occurred'
  | 'monthly.expenses'
  | 'monthly.income'
  | 'total.expenses'
  | 'total.income'
  | 'balance'
  | 'expense.categories'
  | 'income.categories'
  | 'no.transactions'
  | 'add.first.transaction'
  | 'loading'
  | 'loading.failed'
  | 'error.loading'
  | 'retry'
  | 'welcome'
  | 'get.started'
  | 'welcome.message'
  | 'welcome.cta'
  | 'recurring.transactions'
  | 'add.recurring'
  | 'edit.recurring'
  | 'delete.recurring'
  | 'frequency'
  | 'start.date'
  | 'end.date'
  | 'no.end.date'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'confirm.delete.recurring'
  | 'confirm.delete.recurring.message'
  | 'recurring.added'
  | 'recurring.updated'
  | 'recurring.deleted'
  | 'next.occurrence'
  | 'last.occurrence'
  | 'occurrences'
  | 'infinite'
  | 'sync.status'
  | 'last.synced'
  | 'syncing'
  | 'sync.error'
  | 'sync.success'
  | 'load.data'
  | 'save.data'
  | 'data.loaded'
  | 'data.saved'
  | 'confirm.load'
  | 'confirm.load.message'
  | 'confirm.save'
  | 'confirm.save.message'
  | 'yes.load'
  | 'yes.save'
  | 'financial.analysis'
  | 'analyze'
  | 'analysis.loading'
  | 'analysis.error'
  | 'api.key.required'
  | 'enter.api.key'
  | 'api.key'
  | 'api.key.save'
  | 'api.key.saved'
  | 'spending.patterns'
  | 'saving.opportunities'
  | 'budget.recommendations'
  | 'export.pdf'
  | 'export.success'
  | 'export.error'
  | 'current.balance'
  | 'current.debt'
  | 'financial.projection.calculator'
  | 'annual.revenue.per.customer'
  | 'monthly.growth.percentage'
  | 'calculate.projection'
  | 'revenue.projection'
  | 'monthly.revenue'
  | 'annual.recurring.revenue'
  | 'annual.churn.rate'
  | 'starting.customers'
  | 'projection.period'
  | 'months'
  | 'number.of.customers'
  | 'error'
  | 'success'
  | 'fill.required'
  | 'income.added'
  | 'expense.added'
  | 'enter.amount'
  | 'enter.description'
  | 'pick.date'
  | 'processing'
  | 'add.income'
  | 'add.expense'
  | 'login_required'
  | 'save.failed'
  | 'invalid.credentials'
  | 'login.success'
  | 'account.creation.failed'
  | 'account.created'
  | 'login.failed'
  | 'welcome.back'
  | 'create.account'
  | 'auth.signin.description'
  | 'auth.signup.description'
  | 'loading.description'
  | 'load.data.description'
  | 'email'
  | 'password'
  | 'enter.email'
  | 'enter.password'
  | 'saving'
  | 'saving.description'
  | 'account.exists'
  | 'confirm.save.description'
  | 'reset.data'
  | 'confirm.reset'
  | 'confirm.reset.description'
  | 'reset'
  | 'sign.in'
  | 'create.account.description'
  | 'sign.in.description'
  | 'data.saved.locally'
  | 'data.synced'
  | 'amount.updated'
  | 'transaction.history'
  | 'all.time'
  | 'show.selected.month'
  | 'show.all.transactions'
  | 'view.all.transactions'
  | 'logout.success'
  | 'logout.failed'
  | 'menu'
  | 'expense.categorized'
  | 'financial.runway.with.balances'
  | 'financial.runway.without.balances'
  | 'session.check.failed'
  | 'back.to.dashboard'
  | 'no.categorized.expenses'
  | 'expenses.by.category'
  | 'transaction.failed'
  | 'current.bank.balance'
  | 'current.debt.balance'
  | 'app.name'
  | 'generate.analysis'
  | 'select.month'
  | 'balance.for'
  | 'monthly.recurring.income'
  | 'monthly.recurring.expenses'
  | 'annual.total.revenue'
  | 'annual.total.expenses'
  | 'annual.total.profit.loss'
  | 'annual.recurring.income'
  | 'annual.recurring.expenses'
  | 'annual.recurring.difference'
  | 'show.annual.stats'
  | 'hide.annual.stats'
  | 'data.loaded.success'
  | 'pdf.exported'
  | 'pdf.exported.success'
  | 'pdf.export.failed'
  | 'pdf.export.failed.description'
  | 'data.reset'
  | 'data.reset.success'
  | 'description'
  | 'edit'
  | 'delete'
  | 'all';