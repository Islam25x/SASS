
import { Bell, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Text } from "../../../shared/ui";

function Header() {
    const [isRangeOpen, setIsRangeOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState("month");
    const rangeRef = useRef<HTMLDivElement | null>(null);

    const rangeOptions = useMemo(() => {
        const now = new Date();
        const formatLong = (date: Date) =>
            date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
            });
        const formatShort = (date: Date) =>
            date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        return [
            { value: "today", label: "Today", range: formatLong(now) },
            { value: "week", label: "This week", range: `${formatShort(startOfWeek)} - Now` },
            { value: "month", label: "This month", range: `${formatShort(startOfMonth)} - Now` },
            { value: "year", label: "This year", range: `${formatShort(startOfYear)} - Now` },
        ];
    }, []);

    const activeRange = rangeOptions.find((option) => option.value === selectedRange);

    useEffect(() => {
        if (!isRangeOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (!rangeRef.current?.contains(event.target as Node)) {
                setIsRangeOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isRangeOpen]);

    return (
        <section>
            <div className="flex justify-between my-4 mx-4">
                <div className="left h-4">
                    <Text as="h1" variant="title" weight="bold" className="text-3xl">
                        Welcome back , Islam Salah
                    </Text>
                    <Text variant="body" className="text-gray-600 text-sm">
                        Welcome to your dashboard
                    </Text>
                </div>
                <div className="right flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        shape="circle"
                        className="border-gray-400 border-solid border-1 text-black h-11 w-11 p-0 hover:bg-primary-700 hover:text-white"
                        aria-label="Notifications"
                    >
                        <Bell size={18} />
                    </Button>
                    <div
                        ref={rangeRef}
                        className="relative"
                        onKeyDown={(event) => {
                            if (event.key === "Escape") setIsRangeOpen(false);
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setIsRangeOpen((open) => !open)}
                            aria-haspopup="listbox"
                            aria-expanded={isRangeOpen}
                            className="flex items-center gap-3 rounded-3xl border border-gray-300 bg-white/80 px-4 py-2 text-left shadow-sm transition hover:border-primary/60 hover:bg-white"
                        >
                            <div className="flex flex-col leading-tight">
                                <Text as="span" variant="body" weight="medium" className="text-slate-900">
                                    {activeRange?.label ?? "This month"}
                                </Text>
                                <Text as="span" variant="caption" className="text-slate-500">
                                    {activeRange?.range ?? "Apr 1 - Now"}
                                </Text>
                            </div>
                            <ChevronDown
                                size={18}
                                className={`text-slate-500 transition ${isRangeOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {isRangeOpen && (
                            <div
                                role="listbox"
                                className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                            >
                                {rangeOptions.map((option) => {
                                    const isActive = option.value === selectedRange;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            role="option"
                                            aria-selected={isActive}
                                            onClick={() => {
                                                setSelectedRange(option.value);
                                                setIsRangeOpen(false);
                                            }}
                                            className={`flex w-full flex-col gap-1 rounded-xl px-3 py-2 text-left transition ${
                                                isActive
                                                    ? "bg-primary-50 text-primary-700"
                                                    : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                        >
                                            <span className="text-sm font-semibold">{option.label}</span>
                                            <span className="text-xs text-slate-500">{option.range}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className=" flex border-1 border-gray-400 rounded-3xl pe-10 border-solid">
                        <img className="w-7 h-7 rounded-full object-cover m-2" src="https://avatars.githubusercontent.com/u/9919?s=280&v=4" alt="profile" />
                        <div className="align-middle">
                            <Text as="h3" variant="body" weight="medium">
                                Islam Salah
                            </Text>
                            <Text variant="caption" className="text-sm text-gray-400 mt-[-.4rem]">
                                islam.salah.is08@gmail.com
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Header
