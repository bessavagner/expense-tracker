# Models and Managers

## 1. Models

### 1.1 Currency
Represents a currency used in transactions.

**Fields:**

- `code`: Unique code for the currency (e.g., "BRL", "USD"). Maximum 3 characters.
- `name`: Name of the currency (e.g., "Brazilian Real", "US Dollar"). Maximum 50 characters.
- `is_active`: Indicates whether the currency is active (default: True).

**Methods:**

- `__str__`: Returns a human-readable representation of the currency in the format "<code> - <name>".

**Manager:**

- `CurrencyManager`: Provides methods to search currencies by code, list codes, and filter active currencies.

### 1.2 Category
Represents a global category for classifying transactions.

**Fields:**

- `name`: Name of the category (e.g., "Food", "Transport"). Unique and normalized to lowercase.
- `is_active`: Indicates whether the category is active (default: True).

**Methods:**

- `save`: Normalizes the category name (removes extra spaces and converts to lowercase) before saving.
- `__str__`: Returns the name of the category.

**Manager:**

- `CategoryManager`: Provides methods to search categories by name, create categories, and filter active categories.

### 1.3 CategoryUser
Links a category to a user, allowing customization (color, icon).

**Fields:**

- `user`: Foreign key to the user (settings.AUTH_USER_MODEL).
- `category`: Foreign key to the category (Category).
- `is_default`: Indicates whether the category is default for the user (default: False).
- `color`: Category color in hexadecimal format (e.g., "#FF5733"). Validated for correct format.
- `icon`: Category icon (optional). Maximum 50 characters.

**Constraints:**

- `unique_together`: Ensures that a user cannot have more than one link to the same category.

**Methods:**

- `__str__`: Returns a human-readable representation in the format "<user> - <category.name>".

### 1.4 Transaction
Represents a financial transaction.

**Fields:**

- `id`: Unique UUID as the primary key.
- `user`: Foreign key to the user (settings.AUTH_USER_MODEL).
- `description`: Description of the transaction (e.g., "Supermarket"). Free text.
- `amount`: Transaction amount. Decimal with up to 10 digits and 2 decimal places. Must be greater than or equal to 0.
- `currency`: Foreign key to the currency (Currency).
- `date`: Transaction date.
- `payment_method`: Payment method. Choices: "dinheiro", "debito", "pix".
- `transaction_type`: Transaction type. Choices: "income", "expense", "transfer".
- `category`: Foreign key to the user’s custom category (CategoryUser). Optional.
- `created_at`: Timestamp when the transaction was created (auto-filled).
- `updated_at`: Timestamp of the last update to the transaction (auto-filled).
- `is_deleted`: Indicates whether the transaction has been deleted (default: False).

**Methods:**

- `clean`: Validates the transaction:
  - Transfers cannot have a payment method.
  - Incomes and expenses must have a payment method.
  - The category must belong to the user.
- `save`: Performs the validation (`clean`) before saving.
- `__str__`: Returns a human-readable representation in the format "(<category>) <description> - <currency.code> <amount>".

**Manager:**

- `TransactionManager`: Provides methods to filter, aggregate, and manage transactions.

## 2. Managers

### 2.1 CurrencyManager
Custom manager for the Currency model.

**Methods:**

- `get_by_code(code)`: Returns a currency by code. Returns None if not found.
- `get_all_codes()`: Returns a list of all currency codes.
- `get_active_currencies()`: Returns all active currencies.

### 2.2 CategoryManager
Custom manager for the Category model.

**Methods:**

- `get_by_name(name)`: Returns a category by name (case-insensitive). Returns None if not found.
- `get_or_create_by_name(name)`: Gets or creates a category by name (case-insensitive).
- `get_active_categories()`: Returns all active categories.

### 2.3 TransactionManager
Custom manager for the Transaction model.

**Methods:**

- `for_user(user)`: Returns all transactions for a user.
- `income(user=None)`: Returns income transactions (optionally for a specific user).
- `expense(user=None)`: Returns expense transactions (optionally for a specific user).
- `transfer(user=None)`: Returns transfer transactions (optionally for a specific user).
- `by_payment_method(payment_method, user=None)`: Returns transactions by payment method (optionally for a specific user).
- `by_category(category, user=None)`: Returns transactions by category (optionally for a specific user).
- `total_amount(user=None)`: Returns the total amount of all transactions (optionally for a specific user).
- `total_income(user=None)`: Returns the total amount of income transactions (optionally for a specific user).
- `total_expense(user=None)`: Returns the total amount of expense transactions (optionally for a specific user).
- `net_balance(user=None)`: Returns the net balance (income - expenses) for a user.
- `recent_transactions(days=30, user=None)`: Returns transactions from the last `days` days (optionally for a specific user).
- `deleted_transactions(user=None)`: Returns deleted transactions (optionally for a specific user).
- `active_transactions(user=None)`: Returns non-deleted transactions (optionally for a specific user).

## Example Usage


```python
# Creating a Currency*
currency = Currency.objects.create(code="BRL", name="Brazilian Real")

# Creating a Category
category = Category.objects.create(name="Food")

# Linking a Category to a User
category_user = CategoryUser.objects.create(
    user=user,
    category=category,
    color="#FF5733",
    icon="fa-utensils"
)

# Creating a Transaction
transaction = Transaction.objects.create(
    user=user,
    description="Supermarket",
    amount=100.00,
    currency=currency,
    date="2024-03-01",
    payment_method="debito",
    transaction_type="expense",
    category=category_user
)

# Filtering Transactions
income_transactions = Transaction.objects.income(user)
total_income = Transaction.objects.total_income(user)
```
## Final Considerations

- Extensibility: The models and managers are ready for expansion (e.g., adding credit cards and installments).
- Security: Validations ensure data integrity.
- Documentation: This documentation serves as a reference for developers and future maintenance.
