import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

interface EditableValueProps {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min: number;
  max: number;
  className?: string;
}

const EditableValue = ({ value, onChange, prefix = "", suffix = "", min, max, className = "text-lg" }: EditableValueProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);
  // Ref ensures we always read the latest value when entering edit mode,
  // even if the slider moved since the last render.
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (editing) {
      setDraft(String(valueRef.current));
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [editing]);

  const commit = () => {
    const num = Math.min(max, Math.max(min, Number(draft) || 0));
    onChange(num);
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className={`${className} font-bold text-foreground cursor-pointer hover:text-uber-green transition-colors`}
      >
        {prefix}{value.toLocaleString()}{suffix}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="relative flex items-center border border-border rounded-lg overflow-hidden">
        {prefix && <span className="text-sm text-muted-foreground pl-2">{prefix}</span>}
        <input
          ref={inputRef}
          type="number"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          onBlur={commit}
          className="w-20 px-2 py-1.5 text-lg font-bold text-foreground bg-card focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && <span className="text-sm text-muted-foreground pr-2">{suffix}</span>}
      </div>
      <button
        onClick={commit}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-uber-green text-accent-foreground hover:opacity-90 transition-opacity"
      >
        <Check className="w-4 h-4" />
      </button>
    </div>
  );
};

export default EditableValue;
