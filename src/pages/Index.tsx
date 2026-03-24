import { useState } from "react";
import PlanCard, { type Plan } from "@/components/PlanCard";
import NumberInputs from "@/components/NumberInputs";
import ProfitBreakdown from "@/components/ProfitBreakdown";
import ImpactComparison from "@/components/ImpactComparison";
import CalculationBreakdown from "@/components/CalculationBreakdown";
import EditableValue from "@/components/EditableValue";
import { Slider } from "@/components/ui/slider";

const plans: Plan[] = [
  {
    id: "plus",
    name: "Plus",
    tagline: "Grow sales",
    introRate: "0% intro rate for 30 days",
    marketplaceFee: 25,
    marketplaceFeeLabel: "Marketplace Fee",
    pickupFee: 7,
    features: [],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Maximize your sales",
    introRate: "0% intro rate for 30 days",
    marketplaceFee: 30,
    marketplaceFeeLabel: "Marketplace Fee",
    pickupFee: 7,
    features: [],
  },
  {
    id: "self-delivery",
    name: "Self-delivery",
    tagline: "Use your own staff",
    marketplaceFee: 15,
    marketplaceFeeLabel: "Self-delivery Fee",
    pickupFee: 7,
    features: [],
  },
  {
    id: "custom",
    name: "Custom",
    tagline: "Enter your own rates",
    marketplaceFee: 20,
    marketplaceFeeLabel: "Custom Fee",
    pickupFee: 7,
    features: [],
    isCustom: true,
  },
];

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState("plus");
  const [avgOrderValue, setAvgOrderValue] = useState(25);
  const [ordersPerDay, setOrdersPerDay] = useState(20);
  const [foodCostPct, setFoodCostPct] = useState(30);
  const [laborPct, setLaborPct] = useState(0);
  const [rentPct, setRentPct] = useState(0);
  const [foodCostDollar, setFoodCostDollar] = useState(12000);
  const [laborDollar, setLaborDollar] = useState(0);
  const [rentDollar, setRentDollar] = useState(0);
  const [costMode, setCostMode] = useState<"pct" | "dollar">("pct");
  const [pickupOrderPct, setPickupOrderPct] = useState(30);
  const [customMarketplaceFee, setCustomMarketplaceFee] = useState(20);
  const [customPickupFee, setCustomPickupFee] = useState(7);
  const [uberOrderBoost, setUberOrderBoost] = useState(20);
  const [boostMode, setBoostMode] = useState<"pct" | "orders">("pct");
  const [uberExtraOrdersInput, setUberExtraOrdersInput] = useState(10);
  const [menuMarkupPct, setMenuMarkupPct] = useState(0);

  const activePlan = selectedPlan === "custom"
    ? { ...plans.find((p) => p.id === "custom")!, marketplaceFee: customMarketplaceFee, pickupFee: customPickupFee }
    : plans.find((p) => p.id === selectedPlan)!;

  const baseMonthlyOrders = ordersPerDay * 30;
  const effectiveBoostPct = boostMode === "pct"
    ? uberOrderBoost
    : baseMonthlyOrders > 0 ? ((uberExtraOrdersInput * 30) / baseMonthlyOrders) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-xl font-bold text-foreground">Uber&nbsp;Eats</span>
          <span className="text-sm text-muted-foreground">Merchant Profit Calculator</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Section 1: Plan Selection */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-lg font-bold text-foreground mb-6">1. Choose your plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan === plan.id}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>

          {/* Custom fee sliders */}
          {selectedPlan === "custom" && (
            <div className="mt-6 rounded-lg bg-secondary p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Custom Marketplace Fee</span>
                    <EditableValue value={customMarketplaceFee} onChange={setCustomMarketplaceFee} suffix="%" min={0} max={30} className="text-xl" />
                  </div>
                  <Slider value={[customMarketplaceFee]} onValueChange={([v]) => setCustomMarketplaceFee(v)} min={0} max={30} step={1} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Custom Pickup Fee</span>
                    <EditableValue value={customPickupFee} onChange={setCustomPickupFee} suffix="%" min={0} max={10} className="text-xl" />
                  </div>
                  <Slider value={[customPickupFee]} onValueChange={([v]) => setCustomPickupFee(v)} min={0} max={10} step={1} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Inputs */}
        <NumberInputs
          avgOrderValue={avgOrderValue}
          setAvgOrderValue={setAvgOrderValue}
          ordersPerDay={ordersPerDay}
          setOrdersPerDay={setOrdersPerDay}
          foodCostPct={foodCostPct}
          setFoodCostPct={setFoodCostPct}
          laborPct={laborPct}
          setLaborPct={setLaborPct}
          rentPct={rentPct}
          setRentPct={setRentPct}
          foodCostDollar={foodCostDollar}
          setFoodCostDollar={setFoodCostDollar}
          laborDollar={laborDollar}
          setLaborDollar={setLaborDollar}
          rentDollar={rentDollar}
          setRentDollar={setRentDollar}
          costMode={costMode}
          setCostMode={setCostMode}
          pickupOrderPct={pickupOrderPct}
          setPickupOrderPct={setPickupOrderPct}
          uberOrderBoost={uberOrderBoost}
          setUberOrderBoost={setUberOrderBoost}
          boostMode={boostMode}
          setBoostMode={setBoostMode}
          uberExtraOrdersInput={uberExtraOrdersInput}
          setUberExtraOrdersInput={setUberExtraOrdersInput}
          menuMarkupPct={menuMarkupPct}
          setMenuMarkupPct={setMenuMarkupPct}
        />

        {/* Section 3: Breakdown */}
        <ProfitBreakdown
          avgOrderValue={avgOrderValue}
          ordersPerDay={ordersPerDay}
          marketplaceFee={activePlan.marketplaceFee}
          pickupFee={activePlan.pickupFee}
          foodCostPct={foodCostPct}
          laborPct={laborPct}
          rentPct={rentPct}
          foodCostDollar={foodCostDollar}
          laborDollar={laborDollar}
          rentDollar={rentDollar}
          costMode={costMode}
          pickupOrderPct={pickupOrderPct}
          uberOrderBoost={effectiveBoostPct}
          menuMarkupPct={menuMarkupPct}
        />

        {/* Section 4: Impact Comparison */}
        <ImpactComparison
          avgOrderValue={avgOrderValue}
          ordersPerDay={ordersPerDay}
          marketplaceFee={activePlan.marketplaceFee}
          pickupFee={activePlan.pickupFee}
          foodCostPct={foodCostPct}
          laborPct={laborPct}
          rentPct={rentPct}
          foodCostDollar={foodCostDollar}
          laborDollar={laborDollar}
          rentDollar={rentDollar}
          costMode={costMode}
          pickupOrderPct={pickupOrderPct}
          uberOrderBoost={effectiveBoostPct}
          menuMarkupPct={menuMarkupPct}
        />

        {/* Section 5: Calculation Breakdown */}
        <CalculationBreakdown
          avgOrderValue={avgOrderValue}
          ordersPerDay={ordersPerDay}
          marketplaceFee={activePlan.marketplaceFee}
          pickupFee={activePlan.pickupFee}
          foodCostPct={foodCostPct}
          laborPct={laborPct}
          rentPct={rentPct}
          foodCostDollar={foodCostDollar}
          laborDollar={laborDollar}
          rentDollar={rentDollar}
          costMode={costMode}
          pickupOrderPct={pickupOrderPct}
          uberOrderBoost={effectiveBoostPct}
          menuMarkupPct={menuMarkupPct}
        />
      </main>

    </div>
  );
};

export default Index;
