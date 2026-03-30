"use client";

interface ToggleIconProps {
  hidden: boolean;
  onToggle: () => void;
}

export default function ToggleIcon({ hidden, onToggle }: ToggleIconProps) {
  return (
    <button
      onClick={onToggle}
      title={hidden ? "Restore" : "Remove"}
      className={`print:hidden absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 ${
        hidden ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
      }`}
    >
      <span className="text-[9px] font-bold leading-none">{hidden ? "+" : "×"}</span>
    </button>
  );
}
