import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import {
  mapTransactionsForTable,
  selectTransactionsInsights,
  selectTransactionsSummary,
  type TransactionRowData,
} from "../utils/transaction.selectors";
import TransactionTable from "./TransactionTable";
import TransactionsSummaryCards from "./TransactionsSummaryCards";
import AIInsightsCard from "./AIInsightsCard";
import AddTransactionModal from "./AddTransactionModal";
import { Button, Input, PageHeader } from "../../../shared/ui";
import type { TransactionsTypeUiFilter } from "../types/transactions-filter.types";
import type { Transaction } from "../types/transaction.types";

const PAGE_SIZE = 6;

function TransactionsPage() {
  const [filterType, setFilterType] = useState<TransactionsTypeUiFilter>("all");
  const { data, isLoading, isError, error } = useTransactions({ typeFilter: filterType });
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const transactions = useMemo(() => data ?? [], [data]);
  const summary = useMemo(() => selectTransactionsSummary(transactions), [transactions]);
  const insights = useMemo(() => selectTransactionsInsights(transactions), [transactions]);
  const tableRows = useMemo(
    () => mapTransactionsForTable(transactions),
    [transactions]
  );

  const filteredRows = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return tableRows.filter((row) => {
      const matchesQuery =
        !query ||
        row.merchant.toLowerCase().includes(query) ||
        (row.rawCategory ?? "").toLowerCase().includes(query);

      return matchesQuery;
    });
  }, [tableRows, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedRows: TransactionRowData[] = filteredRows.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (value: TransactionsTypeUiFilter) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleOpenDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setSelectedTransaction(null);
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Transactions"
        subtitle="Track every payment and income stream."
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search transactions..."
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "income", "expense"] as const).map((type) => (
            <Button
              key={type}
              type="button"
              onClick={() => handleFilterChange(type)}
              variant={filterType === type ? "primary" : "secondary"}
              size="sm"
              className={`rounded-full px-4 py-1 text-sm font-medium ${filterType === type ? "border-primary" : "border-gray-200 text-gray-600"
                }`}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <TransactionsSummaryCards summary={summary} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-4">
          <TransactionTable
            rows={pagedRows}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            count={transactions.length}
            onAddTransaction={() => setIsAddTransactionOpen(true)}
            onOpenDetails={handleOpenDetails}
          />

          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                variant={page === safePage ? "primary" : "secondary"}
                size="sm"
                className={`h-9 w-9 rounded-lg border text-sm font-medium ${page === safePage
                  ? "border-primary"
                  : "border-gray-200 text-gray-600"
                  }`}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>

        <div className="lg:self-start">
          <AIInsightsCard insights={insights} isLoading={isLoading} />
        </div>
      </div>

      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        mode="create"
      />
      <AddTransactionModal
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        mode="edit"
        initialData={selectedTransaction ?? undefined}
      />
    </div>
  );
}

export default TransactionsPage;
