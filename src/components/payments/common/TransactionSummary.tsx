
// Fix typecasting for bank/biller payees
// For bankName property
bankName && (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">Bank Name</span>
    <span>
      {payee.type === "bank" || payee.type === "payroll" 
        ? payee.bankName 
        : "-"}
    </span>
  </div>
),

// For accountNumber property 
accountNumber && (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">Account Number</span>
    <span>
      {payee.type === "bank" || payee.type === "payroll"
        ? '••••' + payee.accountNumber.slice(-4)
        : "-"}
    </span>
  </div>
),
