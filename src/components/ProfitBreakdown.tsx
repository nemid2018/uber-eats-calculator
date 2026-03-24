import { fmt } from "@/lib/utils";

interface ProfitBreakdownProps {
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
  pickupOrderPct?: number;
  uberOrderBoost?: number;
  menuMarkupPct?: number;
}

const ProfitBreakdown = ({
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
  pickupOrderPct = 30,
  uberOrderBoost = 20,
  menuMarkupPct = 0,
}: ProfitBreakdownProps) => {
  const uberAOV = avgOrderValue * (1 + menuMarkupPct / 100);
  const baseMonthlyOrders = ordersPerDay * 30;
  const uberExtraOrders = Math.round(baseMonthlyOrders * (uberOrderBoost / 100));
  const monthlyOrders = baseMonthlyOrders + uberExtraOrders;
  const baseRevenue = avgOrderValue * baseMonthlyOrders;
  const uberExtraRevenue = uberAOV * uberExtraOrders;
  const grossRevenue = baseRevenue + uberExtraRevenue;

  // Uber fees only on new orders (at the marked-up price)
  const marketplaceCost = uberExtraRevenue * (marketplaceFee / 100);
  const pickupCost = uberExtraRevenue * (pickupOrderPct / 100) * (pickupFee / 100);
  const totalUberFees = marketplaceCost + pickupCost;
  const revenueAfterFees = grossRevenue - totalUberFees;

  const foodCost = costMode === "pct" ? grossRevenue * (foodCostPct / 100) : foodCostDollar * (1 + uberOrderBoost / 100);
  const laborCost = costMode === "pct" ? grossRevenue * (laborPct / 100) : laborDollar;
  const rentCost = costMode === "pct" ? grossRevenue * (rentPct / 100) : rentDollar;
  const totalOperatingCosts = foodCost + laborCost + rentCost;

  const netProfit = revenueAfterFees - totalOperatingCosts;
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
  const annualProfit = netProfit * 12;
  const newCustomers = Math.round(uberExtraOrders * 0.65);

  // fmt imported from utils

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-lg font-bold text-foreground mb-6">3. Your profit breakdown</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Revenue */}
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase border-b border-border pb-2">Revenue</p>
          <Stat label="GROSS MONTHLY REVENUE" value={fmt(grossRevenue)} />
          <Stat label="MONTHLY ORDERS" value={monthlyOrders.toLocaleString()} />
          <Stat label="NEW CUSTOMERS REACHED" value={`~${newCustomers}`} green />
        </div>

        {/* Costs */}
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase border-b border-border pb-2">Costs</p>
          <Stat label={`MARKETPLACE FEE (${marketplaceFee}% ON NEW ORDERS)`} value={fmt(-marketplaceCost)} />
          <Stat label={`PICKUP FEE (${pickupFee}% × ${pickupOrderPct}% OF NEW ORDERS)`} value={fmt(-pickupCost)} />
          <Stat label="FOOD & INGREDIENTS" value={fmt(-foodCost)} />
          <Stat label="LABOR & STAFFING" value={fmt(-laborCost)} />
          <Stat label="RENT & OVERHEAD" value={fmt(-rentCost)} />
        </div>

        {/* Profit */}
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase border-b border-border pb-2">Profit</p>
          <Stat label="REVENUE AFTER UBER FEES" value={fmt(revenueAfterFees)} />
          <Stat label="TOTAL OPERATING COSTS" value={fmt(-totalOperatingCosts)} />
          <div className="border-t-2 border-uber-green pt-4 space-y-4">
            <Stat label="EST. MONTHLY NET PROFIT" value={fmt(netProfit)} green large />
            <Stat label="PROFIT MARGIN" value={`${profitMargin.toFixed(1)}%`} green />
            <div className="border-t border-border pt-4">
              <Stat label="PROJECTED ANNUAL PROFIT" value={fmt(annualProfit)} green large />
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        *Estimates based on average Uber Eats merchant data. Actual results may vary. Pickup fee applied to ~{pickupOrderPct}% of orders. Operating costs are your own estimates and may differ.
      </p>
    </div>
  );
};

const Stat = ({ label, value, green, large }: { label: string; value: string; green?: boolean; large?: boolean }) => (
  <div>
    <p className="text-xs text-muted-foreground tracking-wide">{label}</p>
    <p className={`font-bold ${large ? "text-3xl" : "text-xl"} ${green ? "text-uber-green" : "text-foreground"}`}>{value}</p>
  </div>
);

export default ProfitBreakdown;
