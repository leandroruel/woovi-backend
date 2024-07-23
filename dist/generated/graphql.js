export var TransactionState;
(function (TransactionState) {
    TransactionState["Done"] = "done";
    TransactionState["Pending"] = "pending";
})(TransactionState || (TransactionState = {}));
/** Represents the type of a transaction. */
export var TransactionType;
(function (TransactionType) {
    TransactionType["Deposit"] = "deposit";
    TransactionType["Transfer"] = "transfer";
    TransactionType["Withdraw"] = "withdraw";
})(TransactionType || (TransactionType = {}));
export var UserEnum;
(function (UserEnum) {
    UserEnum["Female"] = "Female";
    UserEnum["Male"] = "Male";
})(UserEnum || (UserEnum = {}));
export var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["Admin"] = "Admin";
    UserRoleEnum["User"] = "User";
})(UserRoleEnum || (UserRoleEnum = {}));
