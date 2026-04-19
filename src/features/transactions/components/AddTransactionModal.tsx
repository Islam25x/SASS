import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { CalendarDays, DollarSign, ReceiptText, Wallet, X } from "lucide-react";
import { Button, Input } from "../../../shared/ui";
import { ApiError } from "../../../shared/api/api-error";
import { useAddTransaction } from "../../../hooks/useAddTransaction";
import { useCategories } from "../../../hooks/useCategories";
import { useCreateCategory } from "../../../hooks/useCreateCategory";
import { useUpdateTransaction } from "../../../hooks/useUpdateTransaction";
import { useDeleteTransaction } from "../../../hooks/useDeleteTransaction";
import {
  findCategoryByName,
  selectCategoriesByType,
} from "../application/category.selectors";
import type {
  AddTransactionInput,
  AddTransactionType,
} from "../domain/add-transaction.types";
import type { Transaction } from "../domain/transaction.types";
import TransactionCategoryPicker from "./TransactionCategoryPicker";

type AddTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: Transaction;
};

type AddTransactionFormState = {
  transactionName: string;
  amount: string;
  type: AddTransactionType;
  categoryId: string;
  occurredAt: string;
};

type AddTransactionErrors = Partial<Record<keyof AddTransactionFormState, string>>;

type NoticeState = {
  tone: "error" | "success";
  message: string;
} | null;

function formatNowForDateTimeLocal(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  const hours = `${now.getHours()}`.padStart(2, "0");
  const minutes = `${now.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function createInitialState(): AddTransactionFormState {
  return {
    transactionName: "",
    amount: "",
    type: "Expense",
    categoryId: "",
    occurredAt: formatNowForDateTimeLocal(),
  };
}

function formatDateTimeLocal(value?: string): string {
  if (!value) {
    return formatNowForDateTimeLocal();
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return formatNowForDateTimeLocal();
  }

  const year = parsedDate.getFullYear();
  const month = `${parsedDate.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsedDate.getDate()}`.padStart(2, "0");
  const hours = `${parsedDate.getHours()}`.padStart(2, "0");
  const minutes = `${parsedDate.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function createEditState(initialData: Transaction): AddTransactionFormState {
  return {
    transactionName: initialData.description,
    amount: `${initialData.amount}`,
    type: initialData.type,
    categoryId: "",
    occurredAt: formatDateTimeLocal(initialData.date),
  };
}

function AddTransactionModal({
  isOpen,
  onClose,
  mode,
  initialData,
}: AddTransactionModalProps) {
  const addTransactionMutation = useAddTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();
  const categoriesQuery = useCategories({ enabled: isOpen });
  const createCategoryMutation = useCreateCategory();
  const [formState, setFormState] = useState<AddTransactionFormState>(createInitialState);
  const [errors, setErrors] = useState<AddTransactionErrors>({});
  const [notice, setNotice] = useState<NoticeState>(null);
  const refetchCategories = categoriesQuery.refetch;

  const allCategories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );

  const categoryOptions = useMemo(
    () => selectCategoriesByType(allCategories, formState.type),
    [allCategories, formState.type],
  );
  const selectedCategory = useMemo(
    () => allCategories.find((category) => category.id === formState.categoryId) ?? null,
    [allCategories, formState.categoryId],
  );
  const isEditMode = mode === "edit";
  const isSubmitting =
    addTransactionMutation.isPending ||
    updateTransactionMutation.isPending ||
    deleteTransactionMutation.isPending;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (isEditMode && initialData) {
      setFormState(createEditState(initialData));
      setErrors({});
      setNotice(null);
      return;
    }

    setFormState(createInitialState());
    setErrors({});
    setNotice(null);
  }, [initialData, isEditMode, isOpen]);

  useEffect(() => {
    if (!formState.categoryId) {
      return;
    }

    if (!categoryOptions.some((option) => option.id === formState.categoryId)) {
      setFormState((currentState) => ({
        ...currentState,
        categoryId: "",
      }));
    }
  }, [categoryOptions, formState.categoryId]);

  useEffect(() => {
    if (!isOpen || !isEditMode || !initialData || formState.categoryId) {
      return;
    }

    const matchingCategory = allCategories.find(
      (category) =>
        category.categoryType === initialData.type &&
        category.name.trim().toLowerCase() === initialData.category.trim().toLowerCase(),
    );

    if (!matchingCategory) {
      return;
    }

    setFormState((currentState) => ({
      ...currentState,
      categoryId: matchingCategory.id,
    }));
  }, [allCategories, formState.categoryId, initialData, isEditMode, isOpen]);

  const handleCreateCategory = useCallback(
    async (name: string) => {
      setNotice(null);

      try {
        const createdCategory = await createCategoryMutation.mutateAsync({
          name,
          type: formState.type,
        });

        const refreshedCategories = (await refetchCategories()).data ?? [];

        const nextCategory =
          createdCategory ??
          findCategoryByName(refreshedCategories, name, formState.type);

        if (!nextCategory) {
          throw new ApiError(
            "Category was created but could not be selected automatically.",
            500,
            "INVALID_RESPONSE",
          );
        }

        setErrors((currentErrors) => ({ ...currentErrors, categoryId: undefined }));
        setFormState((currentState) => ({
          ...currentState,
          categoryId: nextCategory.id,
        }));
      } catch (error) {
        const message =
          error instanceof ApiError || error instanceof Error
            ? error.message
            : "Failed to create category. Please try again.";

        setNotice({
          tone: "error",
          message,
        });

        throw error;
      }
    },
    [createCategoryMutation, formState.type, refetchCategories],
  );

  if (!isOpen) {
    return null;
  }

  const resetState = () => {
    setFormState(createInitialState());
    setErrors({});
    setNotice(null);
    addTransactionMutation.reset();
    updateTransactionMutation.reset();
    deleteTransactionMutation.reset();
    createCategoryMutation.reset();
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetState();
    onClose();
  };

  const validate = (): boolean => {
    const nextErrors: AddTransactionErrors = {};
    const parsedAmount = Number(formState.amount);

    if (!formState.transactionName.trim()) {
      nextErrors.transactionName = "Transaction name is required.";
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = "Amount must be greater than zero.";
    }

    if (!formState.categoryId.trim()) {
      nextErrors.categoryId = "Please choose a category.";
    }

    if (!formState.occurredAt) {
      nextErrors.occurredAt = "Date and time are required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setNotice(null);
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    setFormState((currentState) => ({ ...currentState, [name]: value }));
  };

  const handleTypeChange = (type: AddTransactionType) => {
    setNotice(null);
    setErrors((currentErrors) => ({
      ...currentErrors,
      type: undefined,
      categoryId: undefined,
    }));
    setFormState((currentState) => ({
      ...currentState,
      type,
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setNotice(null);
    setErrors((currentErrors) => ({ ...currentErrors, categoryId: undefined }));
    setFormState((currentState) => ({
      ...currentState,
      categoryId,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!validate()) {
      return;
    }

    const payload: AddTransactionInput = {
      transactionName: formState.transactionName,
      amount: Number(formState.amount),
      type: formState.type,
      categoryId: formState.categoryId,
      categoryType: selectedCategory?.categoryType ?? formState.type,
      occurredAt: formState.occurredAt,
    };

    try {
      if (isEditMode && initialData) {
        await updateTransactionMutation.mutateAsync({
          transactionId: initialData.id,
          input: payload,
        });
      } else {
        await addTransactionMutation.mutateAsync(payload);
      }
      resetState();
      onClose();
    } catch (error) {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Failed to add transaction. Please try again.";

      setNotice({
        tone: "error",
        message,
      });
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !initialData) {
      return;
    }

    setNotice(null);

    try {
      await deleteTransactionMutation.mutateAsync(initialData.id);
      resetState();
      onClose();
    } catch (error) {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Failed to delete transaction. Please try again.";

      setNotice({
        tone: "error",
        message,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-transaction-title"
        className="w-full max-w-[520px] overflow-hidden rounded-3xl border border-border bg-surface text-text-secondary shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-border bg-primary/5 px-5 py-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Transactions
              </p>
              <h2 id="add-transaction-title" className="mt-1.5 text-lg font-semibold text-text-primary">
                {isEditMode ? "Edit transaction" : "Add a new transaction"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {isEditMode
                  ? "Review transaction details, update them, or remove the transaction."
                  : "Record a new income or expense without leaving the page."}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              shape="circle"
              size="md"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border border-border bg-surface text-gray-500 hover:bg-gray-100 hover:text-text-primary"
              aria-label="Close add transaction modal"
            >
              <X size={18} />
            </Button>
          </div>
        </div>

        <form className="max-h-[80vh] overflow-y-auto px-4 py-3" onSubmit={handleSubmit}>
          <div className="space-y-3">
            {notice && (
              <div
                className={`rounded-xl border px-3 py-3 text-sm ${notice.tone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                aria-live="polite"
              >
                {notice.message}
              </div>
            )
            }

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                id="transactionName"
                name="transactionName"
                label="Transaction Name"
                placeholder="Groceries, salary, taxi..."
                value={formState.transactionName}
                onChange={handleInputChange}
                error={errors.transactionName}
                containerClassName="space-y-2"
                inputClassName="h-10 rounded-xl"
              />

              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                label="Amount"
                placeholder="0.00"
                value={formState.amount}
                onChange={handleInputChange}
                error={errors.amount}
                containerClassName="space-y-2"
                inputClassName="h-10 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Type</label>
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-gray-100 p-1.5">
                  {([
                    {
                      value: "Expense",
                      label: "Expense",
                      icon: <ReceiptText size={16} />,
                    },
                    {
                      value: "Income",
                      label: "Income",
                      icon: <Wallet size={16} />,
                    },
                  ] as const).map((option) => {
                    const isActive = formState.type === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleTypeChange(option.value)}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive
                          ? "bg-primary text-white shadow-sm"
                          : "bg-transparent text-gray-600 hover:bg-surface"
                          }`}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Input
                id="occurredAt"
                name="occurredAt"
                type="datetime-local"
                label="Date & Time"
                value={formState.occurredAt}
                onChange={handleInputChange}
                error={errors.occurredAt}
                containerClassName="space-y-2"
                inputClassName="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                <DollarSign size={16} className="text-primary" />
                <span>Category</span>
              </div>
              <TransactionCategoryPicker
                options={categoryOptions}
                selectedCategoryId={formState.categoryId}
                onSelect={handleCategoryChange}
                onCreateCategory={handleCreateCategory}
                isLoading={categoriesQuery.isLoading}
                isCreating={createCategoryMutation.isPending}
                errorMessage={
                  categoriesQuery.isError
                    ? categoriesQuery.error?.message ?? "Failed to load categories."
                    : undefined
                }
              />
              {errors.categoryId && (
                <p className="text-xs text-rose-500">{errors.categoryId}</p>
              )}
            </div>

            <div className="rounded-xl border border-primary/10 bg-primary/5 px-3 py-3 text-sm text-gray-500">
              <div className="flex items-center gap-2 text-text-secondary">
                <CalendarDays size={16} className="text-primary" />
                <span>The transaction name will be sent to the backend as notes.</span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-3 sm:flex-row sm:justify-end">
              {!isEditMode && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-xl px-4"
                >
                  Cancel
                </Button>
              )}
              {isEditMode && (
                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  onClick={() => {
                    void handleDelete();
                  }}
                  disabled={isSubmitting}
                  className="rounded-xl px-4"
                >
                  {deleteTransactionMutation.isPending ? "Deleting..." : "Delete Transaction"}
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={addTransactionMutation.isPending || updateTransactionMutation.isPending}
                className="rounded-xl px-4"
              >
                {isEditMode
                  ? updateTransactionMutation.isPending
                    ? "Saving..."
                    : "Confirm Edit"
                  : addTransactionMutation.isPending
                    ? "Adding..."
                    : "Add Transaction"}
              </Button>
            </div>
          </div >
        </form >
      </section >
    </div >
  );
}

export default AddTransactionModal;
