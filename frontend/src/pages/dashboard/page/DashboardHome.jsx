import React, { useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    DollarSign,
    Users,
    Package,
    Clock,
    BarChart3,
    PieChart as PieChartIcon,
    Activity,
    Loader2,
    Wallet,
    Warehouse,
    AlertTriangle,
    PackageX,
    UserCheck,
    BadgeDollarSign,
    Banknote,
    Receipt,
    CheckCircle2,
    XCircle,
    Armchair,
    Printer
} from 'lucide-react'
import { PieChartDashboard } from '../components/PieChartDashboard'
import { ChartRadarDotsDashboard } from '../components/ChartRadarDotsDashboard'
import OrderTable from '../components/OrderTable'
import { useOrderStore } from '@/store/useOrderStore'
import { useNavigate } from 'react-router-dom'

const DashboardHome = () => {
    const { stats, recentOrders, getStats, isLoading } = useOrderStore();
    const navigate = useNavigate();

    useEffect(() => {
        getStats();
    }, [getStats]);

    const dashboardRef = useRef(null);

    const handlePrint = async () => {
        if (!dashboardRef.current) return;
        const toastId = toast.loading("Generating PDF Report...");
        
        const originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = function (el, pseudoElt) {
            const style = originalGetComputedStyle(el, pseudoElt);
            return new Proxy(style, {
                get(target, prop) {
                    const val = Reflect.get(target, prop);
                    if (typeof val === 'function') {
                        return val.bind(target); // Fixes 'Illegal invocation' error
                    }
                    if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
                        return 'rgb(249, 250, 251)'; // dashboard is light background
                    }
                    return val;
                }
            });
        };

        try {
            const element = dashboardRef.current;
            const canvas = await html2canvas(element, {
                scale: 1.5,
                useCORS: true,
                backgroundColor: null,
                logging: false,
                ignoreElements: (el) => el.classList.contains('no-print')
            });
            const imgData = canvas.toDataURL("image/png");
            
            const pdfWidth = 210; // A4 width in mm
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [pdfWidth, pdfHeight]
            });
            
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Dashboard_Report_${Date.now()}.pdf`);
            toast.success("Report downloaded as PDF", { id: toastId });
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Failed to generate PDF", { id: toastId });
        } finally {
            window.getComputedStyle = originalGetComputedStyle;
        }
    };

    const quickActions = [
        { title: "New Sale", icon: <ShoppingBag className="h-4 w-4" />, color: "bg-transparent border border-teal-500", path: "/orders" },
        { title: "Manage Menu", icon: <Package className="h-4 w-4" />, color: "bg-transparent border border-teal-500", path: "/dishes" },
        { title: "Tables", icon: <Activity className="h-4 w-4" />, color: "bg-transparent border border-teal-500", path: "/tables" },
        { title: "Customers", icon: <Users className="h-4 w-4" />, color: "bg-transparent border border-teal-500", path: "/customers" }
    ];

    if (isLoading && !stats) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const formatCurrency = (value) => `Rs ${Math.round(value || 0).toLocaleString()}`;
    const printDate = new Date().toLocaleString('en-PK', {
        dateStyle: 'full',
        timeStyle: 'short'
    });

    return (
        <div ref={dashboardRef} className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 dashboard-print-area">

            {/* ===== PRINT HEADER (only visible when printing) ===== */}
            <div className="print-header hidden">
                <h1>🍽️ Tasty Station POS</h1>
                <p className="print-subtitle">Dashboard Statistics Report</p>
                <p className="print-date">Generated: {printDate}</p>
            </div>

            {/* Quick Actions + Print Button */}
            <div className="mb-6 no-print">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 font-medium text-sm"
                    >
                        <Printer className="h-4 w-4" />
                        Download PDF
                    </button>
                </div>
                <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(action.path)}
                            className={`${action.color} text-primary dark:text-white rounded-full px-6 py-4 flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground shadow-sm transition-all duration-300 active:scale-95`}
                        >
                            {action.icon}
                            <span className="font-medium text-sm whitespace-nowrap">{action.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== SECTION 1: Revenue & Orders ===== */}
            <div className="mb-8 print-section">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 print-section-title">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                    Revenue & Orders
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print-stats-grid">
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(stats?.totalRevenue)}
                        icon={<DollarSign className="h-5 w-5" />}
                        period="All Time"
                        colorClass="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        iconBg="bg-emerald-500/10"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats?.totalOrders || '0'}
                        icon={<ShoppingBag className="h-5 w-5" />}
                        period="Cumulative"
                        colorClass="bg-blue-500/10 text-blue-600 border-blue-500/20"
                        iconBg="bg-blue-500/10"
                    />
                    <StatCard
                        title="Avg Order Value"
                        value={formatCurrency(stats?.avgOrderValue)}
                        icon={<BarChart3 className="h-5 w-5" />}
                        period="Per Order"
                        colorClass="bg-violet-500/10 text-violet-600 border-violet-500/20"
                        iconBg="bg-violet-500/10"
                    />
                    <StatCard
                        title="Pending Orders"
                        value={stats?.pendingOrders || '0'}
                        icon={<Clock className="h-5 w-5" />}
                        period="Action Required"
                        colorClass="bg-orange-500/10 text-orange-600 border-orange-500/20"
                        iconBg="bg-orange-500/10"
                    />
                </div>

                {/* Sub-row: Completed & Cancelled */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 print-stats-grid print-stats-grid-2">
                    <StatCard
                        title="Completed Orders"
                        value={stats?.completedOrders || '0'}
                        icon={<CheckCircle2 className="h-5 w-5" />}
                        period="All Time"
                        colorClass="bg-green-500/10 text-green-600 border-green-500/20"
                        iconBg="bg-green-500/10"
                    />
                    <StatCard
                        title="Cancelled Orders"
                        value={stats?.cancelledOrders || '0'}
                        icon={<XCircle className="h-5 w-5" />}
                        period="All Time"
                        colorClass="bg-red-500/10 text-red-600 border-red-500/20"
                        iconBg="bg-red-500/10"
                    />
                </div>
            </div>

            {/* ===== SECTION 2: Inventory Stats ===== */}
            <div className="mb-8 print-section">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 print-section-title">
                    <Warehouse className="h-5 w-5 text-indigo-500" />
                    Inventory Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print-stats-grid">
                    <StatCard
                        title="Total Items"
                        value={stats?.totalInventoryItems || '0'}
                        icon={<Package className="h-5 w-5" />}
                        period="In Stock"
                        colorClass="bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                        iconBg="bg-indigo-500/10"
                    />
                    <StatCard
                        title="Low Stock Items"
                        value={stats?.lowStockCount || '0'}
                        icon={<AlertTriangle className="h-5 w-5" />}
                        period="Needs Reorder"
                        colorClass="bg-amber-500/10 text-amber-600 border-amber-500/20"
                        iconBg="bg-amber-500/10"
                        isWarning={stats?.lowStockCount > 0}
                    />
                    <StatCard
                        title="Out of Stock"
                        value={stats?.outOfStockCount || '0'}
                        icon={<PackageX className="h-5 w-5" />}
                        period="Urgent"
                        colorClass="bg-red-500/10 text-red-600 border-red-500/20"
                        iconBg="bg-red-500/10"
                        isWarning={stats?.outOfStockCount > 0}
                    />
                    <StatCard
                        title="Inventory Value"
                        value={formatCurrency(stats?.totalInventoryValue)}
                        icon={<Wallet className="h-5 w-5" />}
                        period="Current Worth"
                        colorClass="bg-cyan-500/10 text-cyan-600 border-cyan-500/20"
                        iconBg="bg-cyan-500/10"
                    />
                </div>
            </div>

            {/* ===== SECTION 3: Staff & Salary ===== */}
            <div className="mb-8 print-section">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 print-section-title">
                    <Users className="h-5 w-5 text-sky-500" />
                    Staff & Salary
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print-stats-grid">
                    <StatCard
                        title="Total Staff"
                        value={stats?.totalStaff || '0'}
                        icon={<Users className="h-5 w-5" />}
                        period="All Roles"
                        colorClass="bg-sky-500/10 text-sky-600 border-sky-500/20"
                        iconBg="bg-sky-500/10"
                    />
                    <StatCard
                        title="Active Staff"
                        value={stats?.activeStaff || '0'}
                        icon={<UserCheck className="h-5 w-5" />}
                        period="Currently Active"
                        colorClass="bg-teal-500/10 text-teal-600 border-teal-500/20"
                        iconBg="bg-teal-500/10"
                    />
                    <StatCard
                        title="Avg Salary / Staff"
                        value={formatCurrency(stats?.avgMonthlySalary)}
                        icon={<Banknote className="h-5 w-5" />}
                        period="Per Month"
                        colorClass="bg-purple-500/10 text-purple-600 border-purple-500/20"
                        iconBg="bg-purple-500/10"
                    />
                    <StatCard
                        title="Total Monthly Salary"
                        value={formatCurrency(stats?.totalMonthlySalary)}
                        icon={<BadgeDollarSign className="h-5 w-5" />}
                        period="Monthly Expense"
                        colorClass="bg-rose-500/10 text-rose-600 border-rose-500/20"
                        iconBg="bg-rose-500/10"
                    />
                </div>
            </div>

            {/* ===== SECTION 4: Tables & Clients ===== */}
            <div className="mb-8 print-section">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 print-section-title">
                    <Armchair className="h-5 w-5 text-pink-500" />
                    Tables & Clients
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 print-stats-grid print-stats-grid-5">
                    <StatCard
                        title="Total Tables"
                        value={stats?.tableStats?.total || '0'}
                        icon={<Armchair className="h-5 w-5" />}
                        period="All Zones"
                        colorClass="bg-pink-500/10 text-pink-600 border-pink-500/20"
                        iconBg="bg-pink-500/10"
                    />
                    <StatCard
                        title="Available"
                        value={stats?.tableStats?.available || '0'}
                        icon={<CheckCircle2 className="h-5 w-5" />}
                        period="Ready"
                        colorClass="bg-green-500/10 text-green-600 border-green-500/20"
                        iconBg="bg-green-500/10"
                    />
                    <StatCard
                        title="Occupied"
                        value={stats?.tableStats?.occupied || '0'}
                        icon={<Activity className="h-5 w-5" />}
                        period="In Use"
                        colorClass="bg-orange-500/10 text-orange-600 border-orange-500/20"
                        iconBg="bg-orange-500/10"
                    />
                    <StatCard
                        title="Reserved"
                        value={stats?.tableStats?.reserved || '0'}
                        icon={<Clock className="h-5 w-5" />}
                        period="Booked"
                        colorClass="bg-blue-500/10 text-blue-600 border-blue-500/20"
                        iconBg="bg-blue-500/10"
                    />
                    <StatCard
                        title="Total Clients"
                        value={stats?.totalClients || '0'}
                        icon={<Users className="h-5 w-5" />}
                        period="Registered"
                        colorClass="bg-violet-500/10 text-violet-600 border-violet-500/20"
                        iconBg="bg-violet-500/10"
                    />
                </div>
            </div>

            {/* ===== SECTION 5: Profit Summary (Highlighted) ===== */}
            <div className="mb-8 print-section">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 print-section-title">
                    <Receipt className="h-5 w-5 text-emerald-500" />
                    Profit Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print-stats-grid print-stats-grid-3">
                    {/* Cost of Goods Sold */}
                    <Card className="print-profit-card profit-negative border border-red-500/30 bg-gradient-to-br from-red-500/5 to-red-500/10 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 stat-card-title">
                                    Cost of Goods Sold
                                </CardTitle>
                                <div className="p-2 rounded-full bg-red-500/10 stat-card-icon">
                                    <TrendingDown className="h-5 w-5 text-red-500" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 profit-value-negative stat-card-value">
                                {formatCurrency(stats?.totalCostOfGoodsSold)}
                            </h3>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 stat-card-period">
                                Based on menu item cost prices
                            </p>
                        </CardFooter>
                    </Card>

                    {/* Gross Profit */}
                    <Card className={`print-profit-card ${(stats?.grossProfit || 0) >= 0 ? 'profit-positive' : 'profit-negative'} border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 shadow-sm hover:shadow-md transition-shadow`}>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 stat-card-title">
                                    Gross Profit
                                </CardTitle>
                                <div className="p-2 rounded-full bg-emerald-500/10 stat-card-icon">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <h3 className={`text-2xl font-bold stat-card-value ${(stats?.grossProfit || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400 profit-value-positive' : 'text-red-600 dark:text-red-400 profit-value-negative'}`}>
                                {formatCurrency(stats?.grossProfit)}
                            </h3>
                            <Badge variant="outline" className={`mt-1 border-none text-xs ${(stats?.grossProfit || 0) >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                Revenue − COGS
                            </Badge>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 stat-card-period">
                                Before salary deductions
                            </p>
                        </CardFooter>
                    </Card>

                    {/* Net Profit (Total Profit) */}
                    <Card className={`print-profit-card profit-highlight ${(stats?.netProfit || 0) >= 0 ? 'profit-positive' : 'profit-negative'} border shadow-lg hover:shadow-xl transition-shadow ${(stats?.netProfit || 0) >= 0 
                        ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-teal-500/15' 
                        : 'border-red-500/40 bg-gradient-to-br from-red-500/10 to-rose-500/15'}`}>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 stat-card-title">
                                    💰 Total Profit (Net)
                                </CardTitle>
                                <div className={`p-2 rounded-full stat-card-icon ${(stats?.netProfit || 0) >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                    {(stats?.netProfit || 0) >= 0 
                                        ? <TrendingUp className="h-5 w-5 text-emerald-500" />
                                        : <TrendingDown className="h-5 w-5 text-red-500" />
                                    }
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <h3 className={`text-3xl font-extrabold stat-card-value ${(stats?.netProfit || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400 profit-value-positive' : 'text-red-600 dark:text-red-400 profit-value-negative'}`}>
                                {formatCurrency(stats?.netProfit)}
                            </h3>
                            <Badge variant="outline" className={`mt-1 border-none text-xs ${(stats?.netProfit || 0) >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                Revenue − COGS − Salaries
                            </Badge>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 stat-card-period">
                                Final bottom-line profit
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Top Clients */}
            {stats?.topClients && stats.topClients.length > 0 && (
                <div className="mb-8 print-section">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 print-section-title">
                        <Users className="h-5 w-5 text-violet-500" />
                        Top Clients
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 print-clients-grid">
                        {stats.topClients.map((client, idx) => (
                            <Card key={client._id || idx} className="print-client-card border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="pt-4 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="client-avatar w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                            {client.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{client.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Spent: {formatCurrency(client.totalSpent)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Orders Table */}
            <div className="orders-table-section">
                <OrderTable orders={recentOrders} />
            </div>

            {/* Charts Section */}
            <div className="mt-8 charts-section">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <PieChartIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <PieChartDashboard />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ChartRadarDotsDashboard />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ===== PRINT FOOTER (only visible when printing) ===== */}
            <div className="print-footer hidden">
                <p>Tasty Station POS — Confidential Business Report</p>
                <p>This report was auto-generated from the dashboard. For internal use only.</p>
            </div>
        </div>
    )
}

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, period, colorClass, iconBg, isWarning }) => (
    <Card className={`print-stat-card ${colorClass} border shadow-sm hover:shadow-md transition-shadow`}>
        <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 stat-card-title">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-full ${iconBg} stat-card-icon`}>
                    {icon}
                </div>
            </div>
        </CardHeader>
        <CardContent className="pb-2">
            <h3 className={`text-2xl font-bold text-gray-900 dark:text-white stat-card-value ${isWarning ? 'animate-pulse' : ''}`}>
                {value}
            </h3>
        </CardContent>
        <CardFooter className="pt-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 stat-card-period">
                {period}
            </p>
        </CardFooter>
    </Card>
);

export default DashboardHome