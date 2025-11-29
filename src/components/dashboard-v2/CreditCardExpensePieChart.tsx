import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/utils/formatters";
import { getCardNetworkLogo } from "@/lib/cardNetworks";

// Soothing, distinct color palette for pie chart
const COLORS = [
  "#6366f1", // Indigo - calm and professional
  "#8b5cf6", // Purple - creative and distinct
  "#06b6d4", // Cyan - fresh and modern
  "#10b981", // Emerald - positive and balanced
  "#f59e0b", // Amber - warm and attention-grabbing
  "#ec4899", // Pink - vibrant yet soft
  "#14b8a6", // Teal - sophisticated
  "#f97316", // Orange - energetic
  "#a855f7", // Violet - elegant
];

interface PaymentSourceData {
  cardNetwork: string | null;
  lastFourDigits: string | null;
  bankName: string | null;
  paymentMethod: string;
  value: number;
}

interface CreditCardExpensePieChartProps {
  data: PaymentSourceData[];
}

// Helper to construct display label
const getDisplayLabel = (source: PaymentSourceData): string => {
  const digits = source.lastFourDigits || "XXXX";

  // For cards with network
  if (source.cardNetwork) {
    return `${digits}`;
  }

  // For bank accounts or UPI
  if (source.bankName) {
    return `${source.bankName} ${digits}`;
  }

  // Fallback
  return `${digits}`;
};

// Helper to get card network for logo display
const getNetworkForLogo = (source: PaymentSourceData): string | null => {
  if (!source.cardNetwork) return null;

  const network = source.cardNetwork.toLowerCase();
  const networkMap: Record<string, string> = {
    'visa': 'visa',
    'mastercard': 'mastercard',
    'amex': 'amex',
    'rupay': 'rupay',
    'diners': 'diners',
  };

  return networkMap[network] || null;
};

const CreditCardExpensePieChart = ({ data }: CreditCardExpensePieChartProps) => {
  // Transform data to include display labels
  const chartData = data.map((source) => ({
    ...source,
    displayLabel: getDisplayLabel(source),
    network: getNetworkForLogo(source),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const source = payload[0].payload;
      const logoUrl = source.network ? getCardNetworkLogo(source.network) : null;

      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            {logoUrl && (
              <img src={logoUrl} alt={source.displayLabel} className="h-5 w-auto" />
            )}
            <p className="text-sm font-semibold">{source.displayLabel}</p>
          </div>
          <p className="text-sm text-primary">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, payload }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const logoUrl = payload.network ? getCardNetworkLogo(payload.network) : null;

    if (logoUrl) {
      // Show logo + digits + percentage
      return (
        <g>
          <image
            x={x - 15}
            y={y - 18}
            width="30"
            height="20"
            href={logoUrl}
          />
          <text
            x={x}
            y={y + 5}
            fill="black"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-xs font-semibold"
          >
            {payload.displayLabel}
          </text>
          <text
            x={x}
            y={y + 18}
            fill="black"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-xs"
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        </g>
      );
    }

    // Text label without logo (for banks/UPI)
    return (
      <g>
        <text
          x={x}
          y={y - 5}
          fill="black"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          className="text-xs font-semibold"
        >
          {payload.displayLabel}
        </text>
        <text
          x={x}
          y={y + 8}
          fill="black"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          className="text-xs"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const source = chartData[index];
          const logoUrl = source.network ? getCardNetworkLogo(source.network) : null;

          return (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {logoUrl && (
                <img src={logoUrl} alt={source.displayLabel} className="h-4 w-auto" />
              )}
              <span className="text-sm">{source.displayLabel}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Expense by Credit Card</CardTitle>
        <CardDescription>Spending breakdown by card (This Month)</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No credit card expenses this month
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditCardExpensePieChart;
