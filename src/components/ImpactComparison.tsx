import { fmt } from "@/lib/utils";

interface ImpactComparisonProps {
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

const ImpactComparison = ({
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
}: ImpactComparisonProps) => {
  const uberAOV = avgOrderValue * (1 + menuMarkupPct / 100);

  // WITHOUT Uber Eats
  const baseMonthlyOrders = ordersPerDay * 30;
  const baseGrossRevenue = avgOrderValue * baseMonthlyOrders;
  const baseFoodCost = costMode === "pct" ? baseGrossRevenue * (foodCostPct / 100) : foodCostDollar;
  const baseLaborCost = costMode === "pct" ? baseGrossRevenue * (laborPct / 100) : laborDollar;
  const baseRentCost = costMode === "pct" ? baseGrossRevenue * (rentPct / 100) : rentDollar;
  const baseOperatingCosts = baseFoodCost + baseLaborCost + baseRentCost;
  const baseNetProfit = baseGrossRevenue - baseOperatingCosts;
  const baseProfitMargin = baseGrossRevenue > 0 ? (baseNetProfit / baseGrossRevenue) * 100 : 0;
  const baseAnnualProfit = baseNetProfit * 12;

  // WITH Uber Eats
  const uberExtraOrders = Math.round(baseMonthlyOrders * (uberOrderBoost / 100));
  const withMonthlyOrders = baseMonthlyOrders + uberExtraOrders;
  const uberExtraRevenue = uberAOV * uberExtraOrders;
  const withGrossRevenue = baseGrossRevenue + uberExtraRevenue;
  const withFoodCost = costMode === "pct" ? withGrossRevenue * (foodCostPct / 100) : foodCostDollar * (1 + uberOrderBoost / 100);
  const withLaborCost = costMode === "pct" ? withGrossRevenue * (laborPct / 100) : laborDollar;
  const withRentCost = costMode === "pct" ? withGrossRevenue * (rentPct / 100) : rentDollar;
  const withOperatingCosts = withFoodCost + withLaborCost + withRentCost;
  // Uber fees only on new orders (at marked-up price)
  const uberMarketplaceCost = uberExtraRevenue * (marketplaceFee / 100);
  const uberPickupCost = uberExtraRevenue * (pickupOrderPct / 100) * (pickupFee / 100);
  const uberFees = uberMarketplaceCost + uberPickupCost;
  const withNetProfit = withGrossRevenue - withOperatingCosts - uberFees;
  const withProfitMargin = withGrossRevenue > 0 ? (withNetProfit / withGrossRevenue) * 100 : 0;
  const withAnnualProfit = withNetProfit * 12;

  // Deltas
  const extraMonthlyProfit = withNetProfit - baseNetProfit;
  const extraAnnualProfit = withAnnualProfit - baseAnnualProfit;
  const extraOrders = uberExtraOrders;

  // fmt imported from utils

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-lg font-bold text-foreground mb-6">4. Overall impact of Uber Eats</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Without Uber Eats */}
        <div className="rounded-xl border border-border p-6 space-y-4">
          <p className="text-xs font-bold tracking-widest text-foreground uppercase border-b border-border pb-2">Without Uber Eats</p>
          <Stat label="MONTHLY ORDERS" value={baseMonthlyOrders.toLocaleString()} />
          <Stat label="GROSS REVENUE" value={fmt(baseGrossRevenue)} />
          <Stat label="OPERATING COSTS" value={fmt(-baseOperatingCosts)} />
          <Stat label="UBER FEES" value="$0" />
          <div className="border-t-2 border-foreground/20 pt-4 space-y-4">
            <Stat label="MONTHLY NET PROFIT" value={fmt(baseNetProfit)} large />
            <Stat label="PROFIT MARGIN" value={`${baseProfitMargin.toFixed(1)}%`} large />
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <Stat label="ANNUAL PROFIT" value={fmt(baseAnnualProfit)} large />
          </div>
        </div>

        {/* With Uber Eats */}
        <div className="rounded-xl border-2 border-uber-green bg-uber-green-light p-6 space-y-4">
          <p className="text-xs font-bold tracking-widest text-uber-green uppercase border-b border-uber-green/30 pb-2">
            With Uber Eats (+{uberOrderBoost}% Orders)
          </p>
          <Stat label="MONTHLY ORDERS" value={withMonthlyOrders.toLocaleString()} green />
          <Stat label="GROSS REVENUE" value={fmt(withGrossRevenue)} green />
          <Stat label="OPERATING COSTS" value={fmt(-withOperatingCosts)} />
          <Stat label="UBER FEES (ON NEW ORDERS)" value={fmt(-uberFees)} />
          <div className="border-t-2 border-uber-green pt-4 space-y-4">
            <Stat label="MONTHLY NET PROFIT" value={fmt(withNetProfit)} green large />
            <Stat label="PROFIT MARGIN" value={`${withProfitMargin.toFixed(1)}%`} green large />
          </div>
          <div className="bg-uber-green/10 rounded-lg p-4">
            <Stat label="ANNUAL PROFIT" value={fmt(withAnnualProfit)} green large />
          </div>
        </div>
      </div>

      {/* Extra profit banner */}
      <div className="mt-6 rounded-xl bg-uber-green p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs font-semibold tracking-widest text-accent-foreground/80 uppercase">Extra Monthly Profit</p>
          <p className="text-3xl font-bold text-accent-foreground mt-1">{extraMonthlyProfit >= 0 ? "+" : ""}{fmt(extraMonthlyProfit)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-accent-foreground/80 uppercase">Extra Annual Profit</p>
          <p className="text-3xl font-bold text-accent-foreground mt-1">{extraAnnualProfit >= 0 ? "+" : ""}{fmt(extraAnnualProfit)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-accent-foreground/80 uppercase">Extra Orders / Month</p>
          <p className="text-3xl font-bold text-accent-foreground mt-1">+{extraOrders}</p>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, green, large }: { label: string; value: string; green?: boolean; large?: boolean }) => (
  <div>
    <p className="text-xs text-muted-foreground tracking-wide">{label}</p>
    <p className={`font-bold ${large ? "text-3xl" : "text-xl"} ${green ? "text-uber-green" : "text-foreground"}`}>{value}</p>
  </div>
);

export default ImpactComparison;
