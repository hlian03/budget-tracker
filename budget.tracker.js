// TRANSACTION CLASS
// This represents a single transaction (income or expense)

class Transaction {
    constructor(amount, category, type) {
        this.amount = parseFloat(amount);
        this.category = category;
        this.type = type; // 'income' or 'expense'
        this.date = new Date();
        this.id = Date.now() + Math.random(); // Simple unique ID
    }

    // Format amount as currency
    getFormattedAmount() {
        return `$${this.amount.toFixed(2)}`;
    }

    // Format date
    getFormattedDate() {
        return this.date.toLocaleDateString();
    }
}

// BUDGET CLASS
// Main class that handles all budget operations
// ================================
class Budget {
    constructor() {
        // Initialize all our data
        this.transactions = [];
        this.totalIncome = 0;
        this.totalExpenses = 0;
        this.totalBudget = 0;
        this.currentBalance = 0;

        // Get HTML elements
        this.initializeElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update display
        this.updateDisplay();
    }

    // Get all the HTML elements we need
    initializeElements() {
        this.amountInput = document.getElementById('amount');
        this.categorySelect = document.getElementById('category');
        this.addIncomeBtn = document.getElementById('add-income-btn');
        this.addExpenseBtn = document.getElementById('add-expense-btn');
        this.totalBalanceEl = document.getElementById('total-balance');
        this.totalIncomeEl = document.getElementById('total-income');
        this.totalBudgetEl = document.getElementById('total-budget');
        this.totalExpensesEl = document.getElementById('total-expenses');
        this.historyList = document.getElementById('history-list');
        this.amountError = document.getElementById('amount-error');
        this.categoryError = document.getElementById('category-error');
    }

    // Set up button clicks and other events
    setupEventListeners() {
        // Income button click
        this.addIncomeBtn.addEventListener('click', () => {
            this.addIncome();
        });

        // Expense button click
        this.addExpenseBtn.addEventListener('click', () => {
            this.addExpense();
        });

        // Clear errors when user starts typing/selecting
        this.amountInput.addEventListener('input', () => {
            this.clearError('amount');
        });

        this.categorySelect.addEventListener('change', () => {
            this.clearError('category');
        });
    }

    // Validate form input
    validateInput() {
        let isValid = true;
        const amount = parseFloat(this.amountInput.value);
        const category = this.categorySelect.value;

        // Clear previous errors
        this.clearError('amount');
        this.clearError('category');

        // Check amount
        if (isNaN(amount) || amount <= 0) {
            this.showError('amount', 'Please enter a valid amount');
            isValid = false;
        }

        // Check category
        if (!category) {
            this.showError('category', 'Please select a category');
            isValid = false;
        }

        return isValid;
    }

    // Show error message
    showError(field, message) {
        const errorEl = document.getElementById(`${field}-error`);
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }

    // Clear error message
    clearError(field) {
        const errorEl = document.getElementById(`${field}-error`);
        errorEl.classList.remove('show');
    }

    // Add income transaction
    addIncome() {
        if (!this.validateInput()) return;

        const amount = parseFloat(this.amountInput.value);
        const category = this.categorySelect.value;

        // Create new transaction
        const transaction = new Transaction(amount, category, 'income');

        // Handle budget vs regular income
        if (category === 'Total Budget') {
            this.totalBudget += amount;
        } else {
            this.totalIncome += amount;
            this.currentBalance += amount;
        }

        // Add to transactions array
        this.transactions.push(transaction);

        // Update everything
        this.updateDisplay();
        this.addToHistory(transaction);
        this.clearForm();
    }

    // Add expense transaction
    addExpense() {
        if (!this.validateInput()) return;

        const amount = parseFloat(this.amountInput.value);
        const category = this.categorySelect.value;

        // Create new transaction
        const transaction = new Transaction(amount, category, 'expense');

        // Update totals
        this.totalExpenses += amount;
        this.currentBalance -= amount;

        // Add to transactions array
        this.transactions.push(transaction);

        // Update everything
        this.updateDisplay();
        this.addToHistory(transaction);
        this.clearForm();
    }

    // Update all the numbers on screen
    updateDisplay() {
        this.totalBalanceEl.textContent = `$${this.currentBalance.toFixed(2)}`;
        this.totalIncomeEl.textContent = `$${this.totalIncome.toFixed(2)}`;
        this.totalBudgetEl.textContent = `$${this.totalBudget.toFixed(2)}`;
        this.totalExpensesEl.textContent = `$${this.totalExpenses.toFixed(2)}`;
    }

    // Add transaction to history list
    addToHistory(transaction) {
        // Remove empty message if it exists
        const emptyMessage = this.historyList.querySelector('.empty-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        // Create new list item
        const listItem = document.createElement('li');
        listItem.className = 'transaction-item';

        // Set content
        const amountClass = transaction.type === 'income' ? 'income-amount' : 'expense-amount';
        const sign = transaction.type === 'income' ? '+' : '-';

        listItem.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-category">${transaction.category}</div>
                <div class="transaction-date">${transaction.getFormattedDate()}</div>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${sign}${transaction.getFormattedAmount()}
            </div>
        `;

        // Add to top of list
        this.historyList.insertBefore(listItem, this.historyList.firstChild);
    }

    // Clear the form
    clearForm() {
        this.amountInput.value = '';
        this.categorySelect.value = '';
        this.clearError('amount');
        this.clearError('category');
    }

    // Methods to get data (encapsulation)
    getCurrentBalance() {
        return this.currentBalance;
    }

    getTotalIncome() {
        return this.totalIncome;
    }

    getTotalExpenses() {
        return this.totalExpenses;
    }

    getTotalBudget() {
        return this.totalBudget;
    }

    getAllTransactions() {
        return this.transactions;
    }

    getIncomeTransactions() {
        return this.transactions.filter(t => t.type === 'income');
    }

    getExpenseTransactions() {
        return this.transactions.filter(t => t.type === 'expense');
    }
}

// ================================
// START THE APPLICATION
// ================================
document.addEventListener('DOMContentLoaded', function() {
    // Create the budget tracker
    const budgetTracker = new Budget();
    
    // Make it available globally for testing
    window.budgetTracker = budgetTracker;
    
    console.log('Budget Tracker loaded successfully!');
});

