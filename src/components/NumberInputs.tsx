import { Slider } from "@/components/ui/slider";
import EditableValue from "@/components/EditableValue";
interface NumberInputsProps {
  avgOrderValue: number;
  setAvgOrderValue: (v: number) => void;
  ordersPerDay: number;
  setOrdersPerDay: (v: number) => void;
  foodCostPct: number;
  setFoodCostPct: (v: number) => void;
  laborPct: number;
  setLaborPct: (v: number) => void;
  rentPct: number;
  setRentPct: (v: number) => void;
  foodCostDollar: number;
  setFoodCostDollar: (v: number) => void;
  laborDollar: number;
  setLaborDollar: (v: number) => void;
  rentDollar: number;
  setRentDollar: (v: number) => void;
  costMode: "pct" | "dollar";
  setCostMode: (m: "pct" | "dollar") => void;
  pickupOrderPct: number;
  setPickupOrderPct: (v: number) => void;
  uberOrderBoost: number;
  setUberOrderBoost: (v: number) => void;
  boostMode: "pct" | "orders";
  setBoostMode: (m: "pct" | "orders") => void;
  uberExtraOrdersInput: number;
  setUberExtraOrdersInput: (v: number) => void;
  menuMarkupPct: number;
  setMenuMarkupPct: (v: number) => void;
}

const NumberInputs = ({
  avgOrderValue, setAvgOrderValue,
  ordersPerDay, setOrdersPerDay,
  foodCostPct, setFoodCostPct,
  laborPct, setLaborPct,
  rentPct, setRentPct,
  foodCostDollar, setFoodCostDollar,
  laborDollar, setLaborDollar,
  rentDollar, setRentDollar,
  costMode, setCostMode,
  pickupOrderPct, setPickupOrderPct,
  uberOrderBoost, setUberOrderBoost,
  boostMode, setBoostMode,
  uberExtraOrdersInput, setUberExtraOrdersInput,
  menuMarkupPct, setMenuMarkupPct,
}: NumberInputsProps) => {
  const showPickupOnRight = costMode === "pct";

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-lg font-bold text-foreground mb-6">2. Set your numbers</h2>
      <div className="grid md:grid-cols-2 gap-8 md:gap-x-16">
        {/* Row 1: Column headers */}
        <div className="h-7 flex items-center">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Revenue</p>
        </div>
        <div className="h-7 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Your Monthly Costs</p>
          <button
            onClick={() => setCostMode(costMode === "pct" ? "dollar" : "pct")}
            className="flex rounded-full bg-secondary overflow-hidden text-xs cursor-pointer"
          >
            <span className={`px-3 py-1 transition-colors ${costMode === "pct" ? "bg-uber-green text-accent-foreground" : "text-muted-foreground"}`}>%</span>
            <span className={`px-3 py-1 transition-colors ${costMode === "dollar" ? "bg-uber-green text-accent-foreground" : "text-muted-foreground"}`}>$</span>
          </button>
        </div>

        {/* Row 2: AOV | Food cost */}
        <div>
          <div className="flex justify-between items-center mb-3 h-7">
            <span className="text-sm text-muted-foreground">AVERAGE ORDER VALUE</span>
            <EditableValue value={avgOrderValue} onChange={setAvgOrderValue} prefix="$" min={1} max={500} />
          </div>
          <Slider value={[avgOrderValue]} onValueChange={([v]) => setAvgOrderValue(v)} min={5} max={100} step={1} />
        </div>
        <div>
          {costMode === "pct" ? (
            <CostSliderPct label="FOOD & INGREDIENTS" value={foodCostPct} onChange={setFoodCostPct} max={100} />
          ) : (
            <CostSliderDollar label="FOOD & INGREDIENTS" value={foodCostDollar} onChange={setFoodCostDollar} />
          )}
        </div>

        {/* Row 3: Orders | Pickup split (% mode) or Labor ($ mode) */}
        <div>
          <div className="flex justify-between items-center mb-3 h-7">
            <span className="text-sm text-muted-foreground">ESTIMATED ORDERS PER DAY</span>
            <EditableValue value={ordersPerDay} onChange={setOrdersPerDay} min={1} max={1000} />
          </div>
          <Slider value={[ordersPerDay]} onValueChange={([v]) => setOrdersPerDay(v)} min={1} max={200} step={1} />
        </div>
        <div>
          {costMode === "pct" ? (
            <>
              <div className="flex justify-between items-center mb-3 h-7">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">{pickupOrderPct}%</span>
                  <span className="text-sm text-muted-foreground">PICKUP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">DELIVERY</span>
                  <span className="text-lg font-bold text-foreground">{100 - pickupOrderPct}%</span>
                </div>
              </div>
              <Slider value={[pickupOrderPct]} onValueChange={([v]) => setPickupOrderPct(v)} min={0} max={100} step={1} />
            </>
          ) : (
            <CostSliderDollar label="LABOR & STAFFING" value={laborDollar} onChange={setLaborDollar} />
          )}
        </div>

        {/* Row 4 ($ mode only): Pickup split | Rent */}
        {costMode === "dollar" && (
          <>
            <div>
              <div className="flex justify-between items-center mb-3 h-7">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">{pickupOrderPct}%</span>
                  <span className="text-sm text-muted-foreground">PICKUP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">DELIVERY</span>
                  <span className="text-lg font-bold text-foreground">{100 - pickupOrderPct}%</span>
                </div>
              </div>
              <Slider value={[pickupOrderPct]} onValueChange={([v]) => setPickupOrderPct(v)} min={0} max={100} step={1} />
            </div>
            <CostSliderDollar label="RENT & OVERHEAD" value={rentDollar} onChange={setRentDollar} />
          </>
        )}
      </div>

      {/* Uber Eats Menu Price Markup - full width */}
      <div className="mt-8 pt-8 border-t border-border">
        <div className="flex justify-between items-center mb-3 h-7">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">UBER EATS MENU PRICE MARKUP</span>
          </div>
          <EditableValue value={menuMarkupPct} onChange={setMenuMarkupPct} suffix="%" min={0} max={200} />
        </div>
        <Slider
          value={[Math.min(menuMarkupPct, 50)]}
          onValueChange={([v]) => setMenuMarkupPct(v)}
          min={0}
          max={50}
          step={1}
        />
        <p className="text-xs text-muted-foreground mt-2">
          e.g. A $10 item in-store becomes ${(10 * (1 + menuMarkupPct / 100)).toFixed(2)} on Uber Eats
        </p>
      </div>

      {/* Uber Eats Order Boost - full width */}
      <div className="mt-8 pt-8 border-t border-border">
        <div className="flex justify-between items-center mb-3 h-7">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">UBER EATS ORDER BOOST</span>
            <button
              onClick={() => setBoostMode(boostMode === "pct" ? "orders" : "pct")}
              className="flex rounded-full bg-secondary overflow-hidden text-xs cursor-pointer"
            >
              <span className={`px-3 py-1 transition-colors ${boostMode === "pct" ? "bg-uber-green text-accent-foreground" : "text-muted-foreground"}`}>%</span>
              <span className={`px-3 py-1 transition-colors ${boostMode === "orders" ? "bg-uber-green text-accent-foreground" : "text-muted-foreground"}`}>#</span>
            </button>
            <span className="text-sm text-muted-foreground">{boostMode === "pct" ? "% INCREASE" : "ORDERS PER DAY"}</span>
          </div>
          {boostMode === "pct" ? (
            <EditableValue value={uberOrderBoost} onChange={setUberOrderBoost} suffix="%" min={0} max={10000} />
          ) : (
            <EditableValue value={uberExtraOrdersInput} onChange={setUberExtraOrdersInput} suffix=" orders/day" min={0} max={100000} />
          )}
        </div>
        {boostMode === "pct" ? (
          <Slider
            value={[Math.min(uberOrderBoost, 100)]}
            onValueChange={([v]) => setUberOrderBoost(v)}
            min={0}
            max={100}
            step={1}
          />
        ) : (
          <Slider
            value={[Math.min(uberExtraOrdersInput, 100)]}
            onValueChange={([v]) => setUberExtraOrdersInput(v)}
            min={0}
            max={100}
            step={1}
          />
        )}
      </div>
    </div>
  );
};

const CostSliderPct = ({ label, value, onChange, max }: {
  label: string; value: number; onChange: (v: number) => void; max: number;
}) => (
  <div>
    <div className="flex items-center justify-between mb-3 h-7">
      <span className="text-sm text-muted-foreground">{label}</span>
      <EditableValue value={value} onChange={onChange} suffix="%" min={0} max={max} />
    </div>
    <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={0} max={max} step={1} />
  </div>
);

const CostSliderDollar = ({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void;
}) => (
  <div>
    <div className="flex items-center justify-between mb-3 h-7">
      <span className="text-sm text-muted-foreground">{label}</span>
      <EditableValue value={value} onChange={onChange} prefix="$" min={0} max={20000} />
    </div>
    <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={0} max={20000} step={100} />
  </div>
);

export default NumberInputs;
