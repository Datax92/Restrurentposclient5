import React, { useEffect, useState, useCallback, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import useReportStore from "@/store/useReportStore";
import {
    TrendingUp, Users, Package, DollarSign, Calendar,
    ArrowUpRight, RefreshCcw, Download, FileText, Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

/* ─── PDF helpers (no external lib needed — browser print-to-PDF) ─── */
const printElementAsPDF = (elementId, filename) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${filename}</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; }
                body { padding: 24px; color: #111; background: #fff; }
                h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
                p.sub { color: #666; font-size: 13px; margin-bottom: 20px; }
                .meta { display: flex; gap: 24px; margin-bottom: 20px; }
                .stat { background: #f4f4f5; border-radius: 8px; padding: 12px 18px; min-width: 140px; }
                .stat .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: .05em; }
                .stat .value { font-size: 22px; font-weight: 700; margin-top: 2px; }
                table { width: 100%; border-collapse: collapse; font-size: 13px; }
                thead th { background: #18181b; color: #fff; padding: 10px 12px; text-align: left; font-size: 12px; }
                tbody tr:nth-child(even) { background: #f9f9f9; }
                tbody td { padding: 9px 12px; border-bottom: 1px solid #eee; }
                .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
                .paid   { background: #dcfce7; color: #15803d; }
                .cash   { background: #dbeafe; color: #1d4ed8; }
                .card   { background: #fef9c3; color: #854d0e; }
                .online { background: #fae8ff; color: #7e22ce; }
                footer { margin-top: 24px; font-size: 11px; color: #aaa; text-align: center; }
                @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            </style>
        </head>
        <body>${el.innerHTML}</body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, 400);
};


const COLORS = ["#0d9488", "#ca8a04", "#7c3aed", "#dc2626", "#0284c7", "#16a34a"];

/* ═══════════════════════════════════════════════════════ */
const AdminReports = () => {
    const {
        salesData, cashierData, topItemsData, ordersData, profitLossData,
        isLoading,
        fetchSalesReports, fetchCashierCollections,
        fetchTopSellingItems, fetchProfitLoss, fetchOrdersReport
    } = useReportStore();

    const [filter, setFilter]         = useState("monthly");
    const [startDate, setStartDate]   = useState("");
    const [endDate, setEndDate]       = useState("");
    const [useCustom, setUseCustom]   = useState(false);
    const [activeTab, setActiveTab]   = useState("sales");

    /* Load all data */
    const loadAll = useCallback((f, s, e) => {
        const sd = s || undefined;
        const ed = e || undefined;
        fetchSalesReports(f, sd, ed);
        fetchCashierCollections(f, sd, ed);
        fetchTopSellingItems(f, sd, ed);
        fetchProfitLoss(f, sd, ed);
        fetchOrdersReport(f, sd, ed);
    }, [fetchSalesReports, fetchCashierCollections, fetchTopSellingItems, fetchProfitLoss, fetchOrdersReport]);

    useEffect(() => {
        loadAll(filter, "", "");
    }, []);

    const handlePresetFilter = (f) => {
        setFilter(f);
        setUseCustom(false);
        setStartDate("");
        setEndDate("");
        loadAll(f, "", "");
    };


    const handleCustomApply = () => {
        if (!startDate || !endDate) return toast.error("Please select both start and end dates");
        if (new Date(startDate) > new Date(endDate)) return toast.error("Start date must be before end date");
        setUseCustom(true);
        loadAll(filter, startDate, endDate);
        toast.success("Report filtered successfully!");
    };

    /* ── PDF download helpers ── */
    const dateLabel = useCustom
        ? `${startDate} → ${endDate}`
        : filter.charAt(0).toUpperCase() + filter.slice(1);

    const downloadReport = (tabId) => {
        printElementAsPDF(`print-${tabId}`, `Report_${tabId}_${dateLabel}.pdf`);
    };

    /* Stats */
    const totalSalesRevenue = salesData.reduce((s, d) => s + d.totalSales, 0);
    const totalOrders       = salesData.reduce((s, d) => s + d.orderCount, 0);
    const totalItemsSold    = topItemsData.reduce((s, d) => s + d.totalQuantity, 0);

    return (
        <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">

            {/* ─── Header ─── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Filter by period or custom date range — then download as PDF.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadAll(filter, useCustom ? startDate : "", useCustom ? endDate : "")}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        <RefreshCcw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => downloadReport(activeTab)}
                        className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white"
                    >
                        <Download className="size-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* ─── Filter Bar ─── */}
            <Card className="p-4">
                <div className="flex flex-col gap-4">
                    {/* Preset buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground mr-1">Quick:</span>
                        {["daily", "weekly", "monthly", "yearly"].map((f) => (
                            <button
                                key={f}
                                onClick={() => handlePresetFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                                    filter === f && !useCustom
                                        ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900"
                                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                                }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>


                    {/* Custom date range */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">Custom:</span>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-40 h-8 text-sm"
                            />
                            <span className="text-muted-foreground text-sm">to</span>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-40 h-8 text-sm"
                            />
                            <Button size="sm" onClick={handleCustomApply} className="h-8 gap-1">
                                <Filter className="size-3" /> Apply
                            </Button>
                        </div>
                        {useCustom && (
                            <Badge variant="secondary" className="text-xs">
                                Custom: {startDate} → {endDate}
                            </Badge>
                        )}
                    </div>
                </div>
            </Card>

            {/* ─── Summary Cards ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue",  value: `Rs ${profitLossData.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: "blue" },
                    { label: "Net Profit",      value: `Rs ${profitLossData.profit?.toLocaleString() || 0}`,       icon: TrendingUp, color: "teal" },
                    { label: "Total Orders",    value: profitLossData.orderCount || 0,                             icon: Calendar,   color: "amber" },
                    { label: "Items Sold",      value: totalItemsSold,                                             icon: Package,    color: "purple" },
                ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} className={`border-l-4 border-l-${color}-500`}>
                        <CardHeader className="pb-2 pt-4 px-4">
                            <CardDescription className="flex items-center gap-1.5 text-xs">
                                <Icon className="size-3.5" /> {label}
                            </CardDescription>
                            <CardTitle className="text-xl mt-1">{value}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3 px-4">
                            <div className={`flex items-center text-xs text-${color}-500`}>
                                <ArrowUpRight className="size-3 mr-1" /> {dateLabel} period
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ─── Tabs ─── */}
            <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="sales">Sales Trends</TabsTrigger>
                        <TabsTrigger value="collections">Collections</TabsTrigger>
                        <TabsTrigger value="items">Top Items</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="pl">P&amp;L</TabsTrigger>
                    </TabsList>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReport(activeTab)}
                        className="gap-2 hidden md:flex"
                    >
                        <FileText className="size-4" /> Download This Tab
                    </Button>
                </div>

                {/* ── Sales Trends ── */}
                <TabsContent value="sales">
                    {/* Hidden print target */}
                    <div id="print-sales" className="hidden">
                        <h1>Sales Trend Report</h1>
                        <p className="sub">Period: {dateLabel} — Generated {new Date().toLocaleString()}</p>
                        <div className="meta">
                            <div className="stat"><div className="label">Revenue</div><div className="value">Rs {totalSalesRevenue.toLocaleString()}</div></div>
                            <div className="stat"><div className="label">Orders</div><div className="value">{totalOrders}</div></div>
                        </div>
                        <table>
                            <thead><tr><th>Period</th><th>Revenue (Rs)</th><th>Orders</th></tr></thead>
                            <tbody>
                                {salesData.map((row) => (
                                    <tr key={row._id}>
                                        <td>{row._id}</td>
                                        <td>Rs {row.totalSales?.toLocaleString()}</td>
                                        <td>{row.orderCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <footer>Tasty Station POS — Confidential</footer>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Overview</CardTitle>
                            <CardDescription>Sales for: <strong>{dateLabel}</strong></CardDescription>
                        </CardHeader>
                        <CardContent className="h-[380px]">
                            {salesData.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-muted-foreground">No data for this period</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                        <XAxis dataKey="_id" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs ${v}`} />
                                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="totalSales" name="Revenue" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="orderCount" name="Orders" stroke="#ca8a04" strokeWidth={2} dot={{ r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Collections ── */}
                <TabsContent value="collections">
                    <div id="print-collections" className="hidden">
                        <h1>Cashier Collections Report</h1>
                        <p className="sub">Period: {dateLabel} — Generated {new Date().toLocaleString()}</p>
                        <table>
                            <thead><tr><th>Cashier</th><th>Email</th><th>Orders</th><th>Total Collected</th></tr></thead>
                            <tbody>
                                {cashierData.map((c) => (
                                    <tr key={c._id}>
                                        <td>{c.cashierName}</td>
                                        <td>{c.cashierEmail}</td>
                                        <td>{c.orderCount}</td>
                                        <td>Rs {c.totalCollected?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <footer>Tasty Station POS — Confidential</footer>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Cashier Performance</CardTitle>
                                <CardDescription>Period: {dateLabel}</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[320px]">
                                {cashierData.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">No data</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={cashierData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                            <XAxis dataKey="cashierName" stroke="#888" fontSize={11} />
                                            <YAxis stroke="#888" fontSize={11} />
                                            <Tooltip />
                                            <Bar dataKey="totalCollected" name="Collected" radius={[4, 4, 0, 0]}>
                                                {cashierData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Collection Summary</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Cashier</TableHead>
                                            <TableHead className="text-right">Orders</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cashierData.length === 0 ? (
                                            <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No data</TableCell></TableRow>
                                        ) : cashierData.map((c) => (
                                            <TableRow key={c._id}>
                                                <TableCell className="font-medium">{c.cashierName}</TableCell>
                                                <TableCell className="text-right">{c.orderCount}</TableCell>
                                                <TableCell className="text-right font-bold">Rs {c.totalCollected?.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ── Top Items ── */}
                <TabsContent value="items">
                    <div id="print-items" className="hidden">
                        <h1>Top Selling Items Report</h1>
                        <p className="sub">Period: {dateLabel} — Generated {new Date().toLocaleString()}</p>
                        <table>
                            <thead><tr><th>#</th><th>Item</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
                            <tbody>
                                {topItemsData.map((item, i) => (
                                    <tr key={item._id}>
                                        <td>{i + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.totalQuantity}</td>
                                        <td>Rs {item.totalRevenue?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <footer>Tasty Station POS — Confidential</footer>
                    </div>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Top Selling Items</CardTitle>
                                    <CardDescription>Period: {dateLabel}</CardDescription>
                                </div>
                                <Badge variant="outline">Top {topItemsData.length}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Qty Sold</TableHead>
                                        <TableHead className="text-right">Revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topItemsData.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10">No data for this period</TableCell></TableRow>
                                    ) : topItemsData.map((item, i) => (
                                        <TableRow key={item._id}>
                                            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="secondary">{item.totalQuantity}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-teal-600">Rs {item.totalRevenue?.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Orders List ── */}
                <TabsContent value="orders">
                    <div id="print-orders" className="hidden">
                        <h1>Orders Report</h1>
                        <p className="sub">Period: {dateLabel} — Generated {new Date().toLocaleString()}</p>
                        <div className="meta">
                            <div className="stat"><div className="label">Total Orders</div><div className="value">{ordersData.length}</div></div>
                            <div className="stat"><div className="label">Total Revenue</div><div className="value">Rs {ordersData.reduce((s,o)=>s+(o.totalAmount||0),0).toLocaleString()}</div></div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Type</th>
                                    <th>Table</th>
                                    <th>Payment</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersData.map((o) => (
                                    <tr key={o._id}>
                                        <td style={{fontFamily:'monospace',fontSize:'11px'}}>{o.orderId || o._id?.slice(-8)}</td>
                                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                        <td>{o.clientName || '—'}</td>
                                        <td>{o.type}</td>
                                        <td>{o.table?.name || '—'}</td>
                                        <td><span className={`badge ${o.paymentMethod?.toLowerCase()}`}>{o.paymentMethod}</span></td>
                                        <td>Rs {o.totalAmount?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <footer>Tasty Station POS — Confidential</footer>
                    </div>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Orders List</CardTitle>
                                    <CardDescription>All completed orders — Period: {dateLabel}</CardDescription>
                                </div>
                                <Badge>{ordersData.length} orders</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[480px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Payment</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ordersData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                                                    No orders found for this period
                                                </TableCell>
                                            </TableRow>
                                        ) : ordersData.map((o) => (
                                            <TableRow key={o._id}>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    {o.orderId?.split("-").pop().slice(-8) || o._id?.slice(-8)}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(o.createdAt).toLocaleDateString()}<br />
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{o.clientName || "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant={o.type === "Dine-in" ? "default" : "secondary"} className="text-xs">
                                                        {o.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs">{o.paymentMethod}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-bold">Rs {o.totalAmount?.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── P&L ── */}
                <TabsContent value="pl">
                    <div id="print-pl" className="hidden">
                        <h1>Profit &amp; Loss Statement</h1>
                        <p className="sub">Period: {dateLabel} — Generated {new Date().toLocaleString()}</p>
                        <div className="meta">
                            <div className="stat"><div className="label">Revenue</div><div className="value">Rs {profitLossData.totalRevenue?.toLocaleString()}</div></div>
                            <div className="stat"><div className="label">COGS</div><div className="value">Rs {profitLossData.totalCost?.toLocaleString()}</div></div>
                            <div className="stat"><div className="label">Gross Profit</div><div className="value">Rs {profitLossData.profit?.toLocaleString()}</div></div>
                            <div className="stat"><div className="label">Orders</div><div className="value">{profitLossData.orderCount}</div></div>
                        </div>
                        <table>
                            <thead><tr><th>Metric</th><th>Value</th></tr></thead>
                            <tbody>
                                <tr><td>Total Revenue</td><td>Rs {profitLossData.totalRevenue?.toLocaleString()}</td></tr>
                                <tr><td>Cost of Goods Sold</td><td>Rs {profitLossData.totalCost?.toLocaleString()}</td></tr>
                                <tr><td>Gross Profit</td><td>Rs {profitLossData.profit?.toLocaleString()}</td></tr>
                                <tr><td>Total Orders</td><td>{profitLossData.orderCount}</td></tr>
                                <tr><td>Avg Order Value</td><td>Rs {profitLossData.orderCount > 0 ? (profitLossData.totalRevenue / profitLossData.orderCount).toFixed(2) : "0.00"}</td></tr>
                                <tr><td>Profit Margin</td><td>{profitLossData.totalRevenue > 0 ? ((profitLossData.profit / profitLossData.totalRevenue)*100).toFixed(1) : "0"}%</td></tr>
                            </tbody>
                        </table>
                        <footer>Tasty Station POS — Confidential</footer>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Profit &amp; Loss Statement</CardTitle>
                            <CardDescription>Period: {dateLabel}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1 p-5 rounded-xl bg-teal-50 dark:bg-teal-950/30">
                                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Revenue</p>
                                    <p className="text-4xl font-bold text-teal-700">Rs {profitLossData.totalRevenue?.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Total money coming in</p>
                                </div>
                                <div className="space-y-1 p-5 rounded-xl bg-rose-50 dark:bg-rose-950/30">
                                    <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">COGS</p>
                                    <p className="text-4xl font-bold text-rose-700">-Rs {profitLossData.totalCost?.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Based on item cost prices</p>
                                </div>
                                <div className="space-y-1 p-5 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Gross Profit</p>
                                    <p className={`text-4xl font-bold ${(profitLossData.profit || 0) >= 0 ? "text-blue-700" : "text-red-700"}`}>
                                        Rs {profitLossData.profit?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Revenue minus cost</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="rounded-xl overflow-hidden border">
                                <div className="p-4 bg-muted/50 flex justify-between items-center">
                                    <span className="font-semibold">Financial Breakdown</span>
                                    <Badge>Period: {dateLabel}</Badge>
                                </div>
                                <div className="p-4 space-y-3">
                                    {[
                                        ["Total Orders",       profitLossData.orderCount],
                                        ["Average Order Value", `Rs ${profitLossData.orderCount > 0 ? (profitLossData.totalRevenue / profitLossData.orderCount).toFixed(2) : "0.00"}`],
                                        ["Profit Margin",      `${profitLossData.totalRevenue > 0 ? ((profitLossData.profit / profitLossData.totalRevenue)*100).toFixed(1) : "0"}%`],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex justify-between items-center py-2 border-b border-dashed last:border-0">
                                            <span className="text-muted-foreground text-sm">{label}</span>
                                            <span className="font-semibold">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminReports;
