import { Bell } from "lucide-react";
import Button from "./Button";
import DateRangeSelector from "./DateRangeSelector";
import Text from "./Text";

function TopHeaderBar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        shape="circle"
        className="text-black h-11 w-11 p-0 border-gray-400 border-solid border-1 hover:bg-primary-700 hover:text-white"
        aria-label="Notifications"
      >
        <Bell size={18} />
      </Button>
      <DateRangeSelector />
      <div className="flex items-center border-1 border-gray-400 rounded-3xl pe-6 border-solid">
        <img
          className="w-7 h-7 rounded-full object-cover m-2"
          src="https://avatars.githubusercontent.com/u/9919?s=280&v=4"
          alt="profile"
        />
        <div className="align-middle">
          <Text as="h3" variant="body" weight="bold" className="text-sm text-gray-900">
            Islam Salah
          </Text>
          <Text variant="caption" className="mt-[-.2rem] text-xs text-gray-400">
            islam.salah.is08@gmail.com
          </Text>
        </div>
      </div>
    </div>
  );
}

export default TopHeaderBar;
