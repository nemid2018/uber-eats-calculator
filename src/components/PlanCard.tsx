import { cn } from "@/lib/utils";

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  introRate?: string;
  marketplaceFee: number;
  marketplaceFeeLabel: string;
  pickupFee: number;
  features: Array<{ text: string; bold?: string }>;
  isCustom?: boolean;
}

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  onSelect: (id: string) => void;
}

const PlanCard = ({ plan, selected, onSelect }: PlanCardProps) => {
  return (
    <button
      onClick={() => onSelect(plan.id)}
      className={cn(
        "text-left rounded-xl border-2 p-6 transition-all cursor-pointer w-full h-full",
        selected
          ? "border-uber-green bg-uber-green-light shadow-sm"
          : "border-border bg-card hover:border-muted-foreground/30"
      )}
    >
      <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>

      {plan.isCustom ? (
        <div className="mt-6">
          <p className="text-lg font-bold text-uber-green">Set your own fees</p>
          <p className="text-2xl text-uber-green mt-1">↓</p>
        </div>
      ) : (
        <>
          {plan.introRate && (
            <p className="text-sm text-uber-green mt-3 font-medium">{plan.introRate}</p>
          )}
          <p className="text-4xl font-bold text-foreground mt-2">{plan.marketplaceFee}%</p>
          <p className="text-sm text-muted-foreground">{plan.marketplaceFeeLabel}</p>
          <p className="text-xl font-bold text-foreground mt-4">{plan.pickupFee}%</p>
          <p className="text-sm text-muted-foreground">Pickup Fee</p>
        </>
      )}
    </button>
  );
};

export default PlanCard;
