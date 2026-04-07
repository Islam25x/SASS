import { Button, Text } from "../../../shared/ui";

type EmptyStateProps = {
  onAdd?: () => void;
};

function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <Text variant="body" weight="bold" className="text-gray-900">
        No transactions yet
      </Text>
      <Text variant="body" className="text-gray-500">
        Start adding transactions to track your finances
      </Text>
      <Button
        variant="primary"
        size="sm"
        onClick={onAdd}
        className="mt-2 rounded-full px-4 py-2 text-xs"
      >
        + Add Transaction
      </Button>
    </div>
  );
}

export default EmptyState;
