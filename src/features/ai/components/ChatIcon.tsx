import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Brain, Mic, ReceiptText, X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import ChatBot from "./ChatBot";
import VoiceLedgerModal from "./VoiceLedgerModal";
import { useVoiceLedgerFlow } from "../../../hooks/useVoiceLedgerFlow";

const NOOP = () => { };

const LAUNCHER_SIZE = 115;
const LAUNCHER_COLLAPSED_WIDTH = 175;
const LAUNCHER_EXPANDED_WIDTH = 615;
const ACTION_STAGGER_SECONDS = 0.06;

const launcherVariants: Variants = {
    collapsed: {
        width: LAUNCHER_COLLAPSED_WIDTH,
        transition: {
            type: "spring",
            stiffness: 460,
            damping: 34,
            mass: 0.65,
        },
    },
    expanded: {
        width: LAUNCHER_EXPANDED_WIDTH,
        transition: {
            type: "spring",
            stiffness: 460,
            damping: 34,
            mass: 0.65,
        },
    },
};

const actionsVariants: Variants = {
    collapsed: {
        opacity: 0,
        y: 8,
        transition: {
            duration: 0.14,
            ease: "easeOut",
            when: "afterChildren",
            staggerChildren: 0.04,
            staggerDirection: -1,
        },
        transitionEnd: { pointerEvents: "none" },
    },
    expanded: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.18,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: ACTION_STAGGER_SECONDS,
        },
        pointerEvents: "auto",
    },
};

const actionItemVariants: Variants = {
    collapsed: { opacity: 0, y: 6 },
    expanded: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.16, ease: "easeOut" },
    },
};

interface AiActionButtonProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
}

function AiActionButton({ icon: Icon, label, onClick }: AiActionButtonProps) {
    return (
        <motion.button
            type="button"
            variants={actionItemVariants}
            onClick={onClick}
            className="h-11 shrink-0 rounded-full border border-primary/20 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-150 hover:bg-primary/10 hover:text-primary"
        >
            <span className="flex items-center gap-2">
                <Icon size={16} strokeWidth={2} />
                <span>{label}</span>
            </span>
        </motion.button>
    );
}

interface PlaceholderModalProps {
    title: string;
    description: string;
    onClose: () => void;
}

function PlaceholderModal({
    title,
    description,
    onClose,
}: PlaceholderModalProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/35 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-primary/20 bg-white p-6 shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{description}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                    >
                        <X size={18} />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function ChatIcon() {
    const [active, setActive] = useState(false);
    const [voiceModalOpen, setVoiceModalOpen] = useState(false);
    const [ocrModalOpen, setOcrModalOpen] = useState(false);
    const [isPinnedOpen, setIsPinnedOpen] = useState(false);

    const launcherRef = useRef<HTMLDivElement | null>(null);
    const voiceLedgerFlow = useVoiceLedgerFlow({
        onTransactionCreated: () => {
            setVoiceModalOpen(false);
        },
    });

    const isAnyModalOpen = active || voiceModalOpen || ocrModalOpen;

    useEffect(() => {
        if (!isPinnedOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (!launcherRef.current?.contains(event.target as Node)) {
                setIsPinnedOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
        };
    }, [isPinnedOpen]);

    return (
        <>
            <AnimatePresence>
                {!isAnyModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
                    >
                        <motion.section
                            ref={launcherRef}
                            initial={false}
                            animate={isPinnedOpen ? "expanded" : "collapsed"}
                            whileHover="expanded"
                            variants={launcherVariants}
                            style={{ height: LAUNCHER_SIZE }}
                            className="relative flex items-center overflow-visible rounded-full pr-4 hover:bg-white/90 hover:shadow-lg hover:backdrop-blur"
                        >
                            <motion.div
                                variants={actionsVariants}
                                className="flex min-w-0 items-center gap-2 pl-3 pr-6" 
                            >
                                <AiActionButton
                                    icon={Brain}
                                    label="Finexa Assist"
                                    onClick={() => {
                                        setActive(true);
                                        setIsPinnedOpen(false);
                                    }}
                                />
                                <AiActionButton
                                    icon={Mic}
                                    label="Voice Ledger"
                                    onClick={() => {
                                        setVoiceModalOpen(true);
                                        setIsPinnedOpen(false);
                                    }}
                                />
                                <AiActionButton
                                    icon={ReceiptText}
                                    label="Smart Receipt"
                                    onClick={() => {
                                        setOcrModalOpen(true);
                                        setIsPinnedOpen(false);
                                    }}
                                />
                            </motion.div>

                            <div className="relative shrink-0 flex items-center justify-center">
                                <motion.span
                                    aria-hidden="true"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.4, 1, 0.4],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/40 to-primary/20"
                                />

                                <button
                                    type="button"
                                    onClick={() => setIsPinnedOpen((v) => !v)}
                                    className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white"
                                >
                                    <Brain size={40} strokeWidth={2.6} />
                                </button>
                            </div>
                        </motion.section>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {active && <ChatBot setActive={setActive} setHideIcon={NOOP} />}
                {voiceModalOpen && (
                    <VoiceLedgerModal
                        isOpen={voiceModalOpen}
                        state={voiceLedgerFlow.state}
                        transcript={voiceLedgerFlow.transcript}
                        parsedTransaction={voiceLedgerFlow.parsedTransaction}
                        error={voiceLedgerFlow.error}
                        isLoading={voiceLedgerFlow.isLoading}
                        onClose={() => {
                            voiceLedgerFlow.cancel();
                            setVoiceModalOpen(false);
                        }}
                        onStartRecording={voiceLedgerFlow.startRecording}
                        onStopRecording={() => {
                            void voiceLedgerFlow.stopRecording();
                        }}
                        onConfirm={() => {
                            void voiceLedgerFlow.confirmTransaction();
                        }}
                        onTranscriptChange={voiceLedgerFlow.updateTranscript}
                    />
                )}
                {ocrModalOpen && (
                    <PlaceholderModal
                        title="Smart Receipt"
                        description="OCR receipt extraction flow will be connected here."
                        onClose={() => setOcrModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default ChatIcon;
