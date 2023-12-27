# Introduction
This is an example React front-end application for the Empay backend. 

# Requirements
- npm

# Compile and start

```
$ npm install
```
```
$ npm start
```

This application requires a running backend at localhost on port 8080.

# Usage help
## Login

<img src="docs/pictures/login.png" alt="Login screen"/>

### User roles
#### Administrator users
A demo administrator user is available with the following credentials: 
```
Username: admin
Password: pass123
```
Administrator users can:

- View all merchants
- Create, update and delete merchants
- View transactions belonging to any merchant

Administrator users can not:
- Create new transactions

#### Merchant users
A set of demo merchant users are available. Check the application console after startup for a 
complete list.

Example merchant user:
```
Username: nike
Password: pass123
```

Merchant users can: 

- View the merchant they are assigned to
- List transactions for their own merchant
- Create new transactions

Merchant users can not:

- View merchants other than their own
- Create, edit or delete merchants
- View transactions for merchants other than their own

## Merchants
### View and search merchants
#### View as an administrator user
All merchants are available. New merchants can be created. 
<img src="docs/pictures/admin-list-merchants.png" alt="Admin list merchants"/>

#### View as a merchant user
Only the own merchant of the current user is available.
Buttons to create new merchants, edit and delete merchants are visible but will be removed in 
future versions. 
<img src="docs/pictures/merchant-list-merchants.png" alt="Merchant list merchants"/>

### Create a new merchant
As administrator:
<img src="docs/pictures/admin-create-merchant.png" alt="Create a merchant"/>
<img src="docs/pictures/admin-merchant-created.png" alt="Merchant created"/>
<img src="docs/pictures/admin-find-created-merchant.png" alt="Find created merchant "/>

### Edit a merchant
As administrator:
<img src="docs/pictures/admin-list-merchants-edit.png" alt="Edit a merchant"/>
<img src="docs/pictures/edit-merchant.png" alt="Rename a merchant"/>
<img src="docs/pictures/edit-merchant-done.png" alt="Edit merchant done"/>

> Merchants in status **Inactive** are not allowed to make transactions.

<img src="docs/pictures/merchant-inactive.png" alt="Edit merchant done"/>

### Delete a merchant
As administrator:
<img src="docs/pictures/delete-merchant.png" alt="Delete a merchant"/>
The merchant **Nike** cannot be deleted because it has transactions.
<img src="docs/pictures/merchant-cannot-be-deleted.png" alt="Merchant cannot be deleted"/>
Merchant **Fila** however can be successfully deleted.
<img src="docs/pictures/delete-merchant-success.png" alt="Merchant deleted"/>

## Transactions

### List and search transactions
As administrator:
<img src="docs/pictures/admin-list-transactions.png" alt="Admin list transactions"/>

As merchant:
<img src="docs/pictures/merchant-list-transactions.png" alt="Admin list transactions"/>

### Create a new transaction
> Only merchant users can create transactions

<img src="docs/pictures/merchant-list-transactions-create.png" alt="Merchant list create transaction"/>

#### Charge transaction
<img src="docs/pictures/create-charge-transaction.png" alt="Create a charge transaction"/>
<img src="docs/pictures/charge-transaction-created.png"/>

> Total transaction sum of merchant **Nike** increased by 100.00. 

<img src="docs/pictures/merchant-transaction-sum-after-charge.png" />

#### Refund transaction error
Create a REFUND transaction related to the previously created CHARGE transaction.
Note that the **amount** of **200** is greater than the amount of **100** of the charge transaction.
> Field **Belongs to transaction** is mandatory for **Refund** transactions.

<img src="docs/pictures/refund-transaction-error-1.png" alt="Create refund transaction error 1"/>
Transaction is created in status **Error**.
<img src="docs/pictures/refund-transaction-error-3.png" alt="Charge transaction created error 3"/>
Expand column **Error reason** to view details about the status. 

#### Refund transaction success
Create a **REFUND** transaction related to the previously created **CHARGE** transaction. 
Note that the **amount** of **50** is **less** than the amount of **100** of the charge 
transaction.
> Field **Belongs to transaction** is mandatory for **Refund** transactions.

<img src="docs/pictures/refund-transaction-success.png"/>
Transaction is created in status **Approved**.
<img src="docs/pictures/refund-transaction-sucess-merchant-balance.png"/>
Total transaction sum of merchant **Nike** is decreased by **50**.


