"use client";
import { CreditCard, Download, CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockDues, mockTransactions } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const statusBadge: Record<string, "red" | "amber" | "blue" | "green" | "grey"> = {
  overdue: "red", due_soon: "amber", upcoming: "blue", auto_debit: "green", paid: "grey",
};

const statusIcon: Record<string, React.ElementType> = {
  overdue: AlertCircle, due_soon: Clock, upcoming: Clock, auto_debit: RefreshCw, paid: CheckCircle,
};

const spendingData = [
  { category: "Loan EMI",   amount: 18450 },
  { category: "Insurance",  amount: 24800 },
  { category: "Charging",   amount: 999 * 12 },
  { category: "Service",    amount: 4200 },
];
const COLORS = ["#1B3A6B", "#C9A84C", "#1A7A4A", "#1D6FA8"];

export default function PaymentsPage() {
  const totalDue = mockDues
    .filter((d) => d.status !== "paid" && d.status !== "auto_debit")
    .reduce((s, d) => s + d.amountRs, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-aegis-navy">Payments & Dues</h1>
        <p className="text-sm text-slate-500 mt-0.5">All vehicle financial obligations in one view</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Due Now",     value: formatCurrency(totalDue),  color: "text-status-red" },
          { label: "Overdue Items",     value: mockDues.filter(d=>d.status==="overdue").length,  color: "text-status-red" },
          { label: "Auto-debit Active", value: mockDues.filter(d=>d.isAutoDebit).length, color: "text-status-green" },
          { label: "Paid This Year",    value: formatCurrency(mockTransactions.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amountRs,0)), color: "text-aegis-navy" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </Card>
        ))}
      </div>

      {/* Dues list */}
      <Card title="All Dues" subtitle="Outstanding and upcoming vehicle payments">
        <div className="mt-2 space-y-2.5">
          {mockDues.map((due) => {
            const Icon = statusIcon[due.status] ?? Clock;
            return (
              <div key={due.id} className="flex items-center gap-4 p-3.5 border border-slate-100 rounded-xl hover:border-slate-200 transition-all">
                <div className="w-9 h-9 rounded-xl bg-aegis-light flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-aegis-navy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{due.title}</p>
                  <p className="text-xs text-slate-500">
                    {due.isAutoDebit ? "Auto-debit enabled · " : ""}
                    Due: {formatDate(due.dueDate)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-slate-800">{due.amountRs > 0 ? formatCurrency(due.amountRs) : "—"}</p>
                  <Badge variant={statusBadge[due.status]} className="mt-0.5">
                    {due.status.replace("_", " ")}
                  </Badge>
                </div>
                {due.status !== "paid" && due.status !== "auto_debit" && (
                  <button
                    onClick={() => alert(`Initiating payment for ${due.title} (Test mode)`)}
                    className="aegis-btn-primary py-1.5 px-3 text-xs flex-shrink-0"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Annual Spending Breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={spendingData} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {spendingData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly Spending — Last 6 Months">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { month: "Dec", amount: 19449 },
                { month: "Jan", amount: 18450 },
                { month: "Feb", amount: 43250 },
                { month: "Mar", amount: 19449 },
                { month: "Apr", amount: 43249 },
                { month: "May", amount: 19449 },
              ]}
              margin={{ left: -20, top: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="amount" fill="#1B3A6B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Transaction history */}
      <Card title="Transaction History">
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                {["Date", "Description", "Category", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="text-left py-2.5 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 text-xs text-slate-500">{formatDate(tx.date)}</td>
                  <td className="py-3 pr-4 text-xs font-medium text-slate-800">{tx.description}</td>
                  <td className="py-3 pr-4"><span className="text-[10px] bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">{tx.category}</span></td>
                  <td className={`py-3 pr-4 text-sm font-bold ${tx.type === "credit" ? "text-status-green" : "text-slate-800"}`}>
                    {tx.type === "credit" ? "+" : "−"}{formatCurrency(tx.amountRs)}
                  </td>
                  <td className="py-3 pr-4"><Badge variant={tx.status === "success" ? "green" : tx.status === "pending" ? "amber" : "red"}>{tx.status}</Badge></td>
                  <td className="py-3"><button className="text-slate-400 hover:text-slate-600"><Download size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
