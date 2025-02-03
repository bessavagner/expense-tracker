# Expense Tracker - Documentation

## Project Overview

**Expense Tracker** is a web application designed to help users manage their personal finances. The system allows users to record financial transactions, categorize expenses and income, and supports different payment methods such as cash, debit, and Pix. In the future, the project will include features for credit card transactions and installment payments.

The backend of the application is built with **Django**, using **PostgreSQL** as the database. User authentication is managed by **django-allauth**, which also supports email-based authentication. The project is being developed with a focus on scalability, security, and ease of use.

## Current Project Status

Currently, the project is in the data modeling and backend development phase. The main models and functionalities implemented include:

1. **Data Models**:
   - **`Currency`**: Represents currencies used in transactions.
   - **`Category`**: Global categories for classifying transactions.
   - **`CategoryUser`**: Links categories to users, allowing customization (color, icon).
   - **`Transaction`**: Records financial transactions, supporting income, expenses, and transfers.

2. **Custom Managers**:
   - **`CurrencyManager`**: Methods for managing currencies.
   - **`CategoryManager`**: Methods for managing categories.
   - **`TransactionManager`**: Methods for filtering, aggregating, and managing transactions.

3. **Implemented Features**:
   - User authentication with `django-allauth`.
   - Transaction validations (e.g., transfers cannot have a payment method).
   - Normalization of category names.
   - Unit tests for models and managers.

4. **Next Steps**:
   - Development of basic views to list, create, edit, and delete transactions.
   - Implementation of credit card and installment payment functionalities.
   - Creation of a REST API for integration with a modern frontend (e.g., React, Vue.js).

For more details, refer to the specific sections in docs/\[app name\]