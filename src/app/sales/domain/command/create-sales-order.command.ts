/**
 * Maps to CreateSalesOrderResource. accountId travels as a query param,
 * so it's not part of the body command.
 */
export interface CreateSalesOrderCommand {
  branchId: string;
}
