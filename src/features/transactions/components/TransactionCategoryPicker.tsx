import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button, Input } from "../../../shared/ui";
import type { TransactionCategory } from "../domain/category.types";

type TransactionCategoryPickerProps = {
  options: TransactionCategory[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
  onCreateCategory: (name: string) => Promise<void>;
  isLoading?: boolean;
  isCreating?: boolean;
  errorMessage?: string;
};

function TransactionCategoryPicker({
  options,
  selectedCategoryId,
  onSelect,
  onCreateCategory,
  isLoading = false,
  isCreating = false,
  errorMessage,
}: TransactionCategoryPickerProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleStartCreate = () => {
    setIsAddingCategory(true);
    setLocalError(null);
  };

  const handleCancelCreate = () => {
    if (isCreating) {
      return;
    }

    setIsAddingCategory(false);
    setNewCategoryName("");
    setLocalError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setLocalError("Category name is required.");
      return;
    }

    setLocalError(null);
    try {
      await onCreateCategory(trimmedName);
      setIsAddingCategory(false);
      setNewCategoryName("");
    } catch {
      // Parent component handles the request error state.
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = option.id === selectedCategoryId;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`rounded-xl border px-3 py-3 text-left transition ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-surface hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-text-secondary">{option.name}</p>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isSelected ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              </div>
            </button>
          );
        })}

        {!isAddingCategory && (
          <button
            type="button"
            onClick={handleStartCreate}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            <Plus size={16} />
            Add Category
          </button>
        )}
      </div>

      {isLoading && (
        <div className="rounded-xl border border-border bg-surface px-3 py-3 text-sm text-gray-500">
          Loading categories...
        </div>
      )}

      {!isLoading && options.length === 0 && !isAddingCategory && (
        <div className="rounded-xl border border-dashed border-border bg-surface px-3 py-4 text-sm text-gray-500">
          No categories found for this type yet. Add one to continue.
        </div>
      )}

      {isAddingCategory && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-xl border border-border bg-surface px-3 py-3"
        >
          <Input
            id="newCategoryName"
            value={newCategoryName}
            onChange={(event) => {
              setNewCategoryName(event.target.value);
              setLocalError(null);
            }}
            placeholder="Category name"
            autoFocus
            error={localError ?? undefined}
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCancelCreate}
              disabled={isCreating}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isCreating}
              className="rounded-lg"
            >
              Create Category
            </Button>
          </div>
        </form>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default TransactionCategoryPicker;
