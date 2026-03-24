import { fmt } from "@/lib/utils";

interface CalculationBreakdownProps {
  avgOrderValue: number;
  ordersPerDay: number;
  marketplaceFee: number;
  pickupFee: number;
  foodCostPct: number;
  laborPct: number;
  rentPct: number;
  foodCostDollar: number;
  laborDollar: number;
  rentDollar: number;
  costMode: "pct" | "dollar";
  uberOrderBoost?: number;
  pickupOrderPct?: number;
  menuMarkupPct?: number;
}

const CalculationBreakdown = ({
  avgOrderValue,
  ordersPerDay,
  marketplaceFee,
  pickupFee,
  foodCostPct,
  laborPct,
  rentPct,
  foodCostDollar,
  laborDollar,
  rentDollar,
  costMode,
  uberOrderBoost = 20,
  pickupOrderPct = 30,
  menuMarkupPct = 0,
}: CalculationBreakdownProps) => {
  const uberAOV = avgOrderValue * (1 + menuMarkupPct / 100);
  const baseMonthlyOrders = ordersPerDay * 30;
  const baseGrossRevenue = avgOrderValue * baseMonthlyOrders;
  const baseFoodCost = costMode === "pct" ? baseGrossRevenue * (foodCostPct / 100) : foodCostDollar;
  const baseLaborCost = costMode === "pct" ? baseGrossRevenue * (laborPct / 100) : laborDollar;
  const baseRentCost = costMode === "pct" ? baseGrossRevenue * (rentPct / 100) : rentDollar;
  const baseOperatingCosts = baseFoodCost + baseLaborCost + baseRentCost;
  const baseNetProfit = baseGrossRevenue - baseOperatingCosts;

  const uberExtraOrders = Math.round(baseMonthlyOrders * (uberOrderBoost / 100));
  const withMonthlyOrders = baseMonthlyOrders + uberExtraOrders;
  const uberExtraRevenue = uberAOV * uberExtraOrders;
  const withGrossRevenue = baseGrossRevenue + uberExtraRevenue;
  const withFoodCost = costMode === "pct" ? withGrossRevenue * (foodCostPct / 100) : foodCostDollar * (1 + uberOrderBoost / 100);
  const withLaborCost = costMode === "pct" ? withGrossRevenue * (laborPct / 100) : laborDollar;
  const withRentCost = costMode === "pct" ? withGrossRevenue * (rentPct / 100) : rentDollar;
  const withOperatingCosts = withFoodCost + withLaborCost + withRentCost;
  const uberMarketplaceCost = uberExtraRevenue * (marketplaceFee / 100);
  const uberPickupCost = uberExtraRevenue * (pickupOrderPct / 100) * (pickupFee / 100);
  const uberFees = uberMarketplaceCost + uberPickupCost;
  const withNetProfit = withGrossRevenue - withOperatingCosts - uberFees;
  const extraProfit = withNetProfit - baseNetProfit;

  // fmt imported from utils

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-lg font-bold text-foreground mb-1">How we calculated this</h2>
      <p className="text-sm text-muted-foreground mb-8">A transparent look at every number, step by step.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <CalcCard
          step={1}
          title="Your current monthly revenue"
          rows={[
            { label: "Orders per day", value: String(ordersPerDay) },
            { label: "Days per month", value: "30" },
            { label: "Monthly orders", value: String(baseMonthlyOrders), bold: true },
            { label: "Avg order value", value: `$${avgOrderValue}` },
          ]}
          result={{ label: "Gross monthly revenue", value: fmt(baseGrossRevenue) }}
          formula={`${baseMonthlyOrders} orders × $${avgOrderValue} = ${fmt(baseGrossRevenue)}`}
        />

        {/* Card 2 */}
        <CalcCard
          step={2}
          title="Your current operating costs"
          rows={[
            { label: "Food & ingredients", value: fmt(baseFoodCost) },
            { label: "Labor & staffing", value: fmt(baseLaborCost) },
            { label: "Rent & overhead", value: fmt(baseRentCost) },
          ]}
          result={{ label: "Total operating costs", value: fmt(baseOperatingCosts) }}
          formula={`${fmt(baseFoodCost)} + ${fmt(baseLaborCost)} + ${fmt(baseRentCost)} = ${fmt(baseOperatingCosts)}`}
        />

        {/* Card 3 */}
        <CalcCard
          step={3}
          title="New orders from Uber Eats"
          rows={[
            { label: "Current monthly orders", value: String(baseMonthlyOrders) },
            { label: "Uber Eats order boost", value: `+${uberOrderBoost}%` },
            { label: "New orders added", value: `+${uberExtraOrders}`, green: true },
            ...(menuMarkupPct > 0 ? [{ label: `Menu price markup`, value: `+${menuMarkupPct}% ($${avgOrderValue} → $${uberAOV.toFixed(2)})` }] : []),
          ]}
          result={{ label: "Total monthly orders", value: String(withMonthlyOrders), green: true }}
          formula={`${baseMonthlyOrders} + ${uberExtraOrders} = ${withMonthlyOrders}`}
        />

        {/* Card 4 */}
        <CalcCard
          step={4}
          title="Uber Eats fees"
          subtitle="Fees only apply to new Uber Eats orders — your existing customers are not affected."
          rows={[
            { label: `Revenue from new orders`, value: fmt(uberExtraRevenue) },
            { label: `Marketplace fee (${marketplaceFee}%)`, value: fmt(uberMarketplaceCost) },
            { label: `Pickup fee (${pickupFee}% × ${pickupOrderPct}% of orders)`, value: fmt(uberPickupCost) },
          ]}
          result={{ label: "Total Uber fees", value: fmt(uberFees) }}
          formula={`${fmt(uberMarketplaceCost)} + ${fmt(uberPickupCost)} = ${fmt(uberFees)}`}
        />
      </div>

      {/* Final summary */}
      <div className="mt-6 rounded-xl border-2 border-uber-green bg-uber-green-light p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-uber-green text-accent-foreground text-sm font-bold">5</span>
          <h3 className="font-bold text-foreground">The bottom line</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Without Uber Eats</p>
            <p className="text-2xl font-bold text-foreground mt-1">{fmt(baseNetProfit)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">With Uber Eats</p>
            <p className="text-2xl font-bold text-uber-green mt-1">{fmt(withNetProfit)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Extra profit</p>
            <p className="text-2xl font-bold text-uber-green mt-1">{extraProfit >= 0 ? "+" : ""}{fmt(extraProfit)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <p className="text-sm text-uber-green font-semibold">{extraProfit >= 0 ? "+" : ""}{fmt(extraProfit * 12)}/year</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        *Based on average Uber Eats merchant data. The {uberOrderBoost}% order increase is adjustable — actual results vary. Uber fees only apply to orders through Uber Eats, not your existing customers.
      </p>
    </div>
  );
};

const CalcCard = ({ step, title, subtitle, rows, result, formula }: {
  step: number;
  title: string;
  subtitle?: string;
  rows: Array<{ label: string; value: string; bold?: boolean; green?: boolean }>;
  result: { label: string; value: string; green?: boolean };
  formula?: string;
}) => (
  <div className="rounded-xl border border-border p-5 flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground text-primary-foreground text-xs font-bold shrink-0">
        {step}
      </span>
      <h3 className="font-semibold text-foreground text-sm">{title}</h3>
    </div>
    {subtitle && <p className="text-xs text-muted-foreground mb-3 ml-9">{subtitle}</p>}
    <div className="ml-9 space-y-2 flex-1">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{row.label}</span>
          <span className={`text-sm font-mono ${row.bold ? "font-bold text-foreground" : row.green ? "font-semibold text-uber-green" : "font-medium text-foreground"}`}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
    <div className="ml-9 mt-4">
      <div className="border-t border-border pt-3 flex justify-between items-center">
        <span className="text-sm font-semibold text-foreground">{result.label}</span>
        <span className={`text-base font-bold font-mono ${result.green ? "text-uber-green" : "text-foreground"}`}>{result.value}</span>
      </div>
      {formula && (
        <p className="text-xs text-muted-foreground font-mono mt-1">{formula}</p>
      )}
    </div>
  </div>
);

export default CalculationBreakdown;
