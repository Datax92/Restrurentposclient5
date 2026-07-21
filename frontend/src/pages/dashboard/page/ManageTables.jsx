import React, { useEffect, useState } from 'react';
import { useTableStore } from '@/store/useTableStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Grid2x2Check, Calendar, Users, Clock, MoreVertical, Edit, Trash2, LayoutGrid, Armchair, XCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import TableCard from '../../Admin/Components/Tables/TableCard';
import AddTableModal from '../../Admin/Components/Tables/AddTableModal';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

const ManageTables = () => {
    const { tables, getTables, deleteTable, reserveTable, cancelReservation, isLoading } = useTableStore();
    const [activeZone, setActiveZone] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);

    // Booking Form State
    const [bookingForm, setBookingForm] = useState({
        bookedBy: "",
        contact: "",
        guests: 1,
        date: "",
        notes: ""
    });

    useEffect(() => {
        getTables();
    }, [getTables]);

    // Derived State: Zones
    const zones = ["All", ...new Set(tables.map(t => t.zone))];

    // Filtering
    const filteredTables = tables.filter(table => {
        const matchesZone = activeZone === "All" || table.zone === activeZone;
        const matchesSearch = table.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesZone && matchesSearch;
    });

    const handleAddClick = () => {
        setEditingTable(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (table, e) => {
        if (e) e.stopPropagation();
        setEditingTable(table);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id, e) => {
        if (e) e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this table?")) {
            await deleteTable(id);
            if (selectedTable?._id === id) setSelectedTable(null);
        }
    };

    const handleTableClick = (table) => {
        setSelectedTable(table);
        // Reset booking form
        setBookingForm({
            bookedBy: "",
            contact: "",
            guests: 1,
            date: new Date().toISOString().slice(0, 16),
            notes: ""
        });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTable) return;

        const result = await reserveTable(selectedTable._id, bookingForm);
        if (result.success) {
            alert("Table reserved successfully!");
            getTables();
        } else {
            alert("Failed to reserve: " + result.message);
        }
    };

    const handleCancelReservation = async () => {
        if (!selectedTable) return;
        if (window.confirm("Cancel this reservation?")) {
            const result = await cancelReservation(selectedTable._id);
            if (result.success) {
                getTables();
            } else {
                alert("Failed to cancel: " + result.message);
            }
        }
    };

    return (
        <div className="flex w-full h-full bg-background overflow-hidden relative">
            {/* Left Main Content */}
            <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden border-r border-border/50">
                {/* Header */}
                <div className="px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 bg-card/30 backdrop-blur-sm shrink-0">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Floor <span className="text-teal-600 dark:text-teal-400">Plan</span>
                        </h1>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em]">POS Control Center</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative w-full sm:w-auto sm:min-w-[240px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tables..."
                                className="pl-9 h-10 bg-background/50 border-border shadow-sm focus:ring-teal-500/10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Button onClick={handleAddClick} className="h-10 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm border-none">
                            <Plus className="h-4 w-4 mr-2" />
                            <span>Deploy Table</span>
                        </Button>
                    </div>
                </div>

                {/* Zone Tabs */}
                <div className="px-8 pt-6 pb-2 shrink-0">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                        {zones.map(zone => (
                            <button
                                key={zone}
                                onClick={() => setActiveZone(zone)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 border",
                                    activeZone === zone
                                        ? "bg-foreground text-background border-foreground shadow-sm"
                                        : "bg-background text-muted-foreground border-border hover:border-muted-foreground/30 hover:text-foreground"
                                )}
                            >
                                {zone}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tables Grid */}
                <div className="flex-1 w-full overflow-y-auto min-h-0 custom-scrollbar relative">
                    <div className="px-8 pb-32">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Grid2x2Check className="h-10 w-10 mb-4 opacity-20 animate-pulse" />
                                <p>Loading layout...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pt-8">
                                <div
                                    onClick={handleAddClick}
                                    className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-teal-100 dark:group-hover:bg-teal-900 transition-colors">
                                        <Plus className="h-6 w-6 text-gray-400 group-hover:text-teal-600 transition-colors" />
                                    </div>
                                    <span className="mt-3 text-sm font-medium text-gray-500 group-hover:text-teal-600">Add New Table</span>
                                </div>

                                {filteredTables.map(table => (
                                    <div key={table._id} className="relative group/card flex justify-center">
                                        <TableCard
                                            table={table}
                                            onClick={handleTableClick}
                                        />
                                        <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-20">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white dark:bg-zinc-900 shadow-md border border-border">
                                                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem onClick={(e) => handleEditClick(table, e)}>
                                                        <Edit className="h-4 w-4 mr-2" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => handleDeleteClick(table._id, e)} className="text-red-600 focus:text-red-600">
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <aside className={cn(
                "w-[400px] h-full bg-card border-l flex flex-col shadow-lg z-30 transition-all duration-300 overflow-hidden",
                selectedTable ? "translate-x-0" : "translate-x-full hidden lg:flex lg:translate-x-0 lg:w-[320px]"
            )}>
                {/* Fixed Sidebar Header */}
                <div className="p-4 border-b flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="font-semibold tracking-tight text-lg">
                            Table Control
                        </h2>
                        <p className="text-sm text-muted-foreground">Master Dashboard</p>
                    </div>
                    {selectedTable && (
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTable(null)} className="rounded-md">
                            <XCircle className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    )}
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar relative">
                    <div className="p-4 space-y-6">
                        {selectedTable ? (
                            <div className="space-y-6 pb-6">
                                {/* Table Info Card */}
                                <div className="bg-card p-6 rounded-md border text-center relative overflow-hidden flex flex-col items-center">
                                    <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-3">
                                        <Armchair className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-1">{selectedTable.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedTable.zone} • {selectedTable.capacity} Seats
                                    </p>
                                    <Badge variant="outline" className={cn(
                                        "mt-3 px-3 py-1 rounded-md font-medium capitalize",
                                        selectedTable.status === 'Available' ? "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50" :
                                            selectedTable.status === 'Occupied' ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50" :
                                                "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50"
                                    )}>
                                        {selectedTable.status}
                                    </Badge>
                                </div>

                                {/* Active Session vs Booking Form */}
                                {selectedTable.status === 'Occupied' ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-semibold">Current Session</span>
                                        </div>
                                        <div className="rounded-md border p-4 space-y-3 bg-muted/20">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Customer</span>
                                                <span className="font-medium">{selectedTable.currentSession?.customerName || "Walk-in Guest"}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Arrival</span>
                                                <span className="font-medium">{selectedTable.currentSession?.startTime || "10 mins ago"}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm pt-2 border-t">
                                                <span className="text-muted-foreground">Running Total</span>
                                                <span className="font-medium text-primary">Rs. 1,250</span>
                                            </div>
                                        </div>
                                        <Button className="w-full rounded-md">
                                            Manage Order
                                        </Button>
                                    </div>
                                ) : selectedTable.status === 'Reserved' ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-semibold">Reservation Details</span>
                                        </div>
                                        <div className="rounded-md border p-4 space-y-3 bg-muted/20">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Guest</span>
                                                <span className="font-medium">{selectedTable.reservation?.bookedBy}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Contact</span>
                                                <span className="font-medium">{selectedTable.reservation?.contact}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Arrival</span>
                                                <span className="font-medium">
                                                    {selectedTable.reservation?.date ? format(new Date(selectedTable.reservation.date), 'p | MMM do') : "N/A"}
                                                </span>
                                            </div>
                                            {selectedTable.reservation?.notes && (
                                                <div className="pt-3 mt-3 border-t">
                                                    <p className="text-xs text-muted-foreground italic">"{selectedTable.reservation.notes}"</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            <Button className="w-full rounded-md">
                                                Check-in Guest
                                            </Button>
                                            <Button onClick={handleCancelReservation} variant="outline" className="w-full rounded-md text-destructive hover:text-destructive/90">
                                                Cancel Reservation
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Plus className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-semibold">New Reservation</span>
                                        </div>
                                        <form onSubmit={handleBookingSubmit} className="space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Guest Name</Label>
                                                <Input
                                                    placeholder="Enter full name"
                                                    className="rounded-md"
                                                    value={bookingForm.bookedBy}
                                                    onChange={e => setBookingForm({ ...bookingForm, bookedBy: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Contact Number</Label>
                                                <Input
                                                    placeholder="+92 XXX XXXXXXX"
                                                    className="rounded-md"
                                                    value={bookingForm.contact}
                                                    onChange={e => setBookingForm({ ...bookingForm, contact: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Heads</Label>
                                                    <Input
                                                        type="number"
                                                        className="rounded-md"
                                                        value={bookingForm.guests}
                                                        onChange={e => setBookingForm({ ...bookingForm, guests: parseInt(e.target.value) })}
                                                        min={1} max={selectedTable.capacity}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Arrival</Label>
                                                    <Input
                                                        type="datetime-local"
                                                        className="rounded-md text-xs"
                                                        value={bookingForm.date}
                                                        onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Special Notes</Label>
                                                <Input
                                                    placeholder="Allergies, occasions..."
                                                    className="rounded-md"
                                                    value={bookingForm.notes}
                                                    onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                                                />
                                            </div>
                                            <Button type="submit" className="w-full rounded-md mt-2">
                                                Confirm Reservation
                                            </Button>
                                        </form>
                                    </div>
                                )}

                                {/* Admin Actions Toolbar */}
                                <div className="pt-4 border-t space-y-2">
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-md border-dashed flex items-center justify-center gap-2"
                                        onClick={(e) => handleEditClick(selectedTable, e)}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Modify Asset Layout
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center justify-center gap-2"
                                        onClick={(e) => handleDeleteClick(selectedTable._id, e)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove from Floor
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-center opacity-50">
                                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center mb-4">
                                    <LayoutGrid className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground">No Selection</h3>
                                <p className="text-xs text-muted-foreground mt-1">Select a table to configure details</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Modal */}
            <AddTableModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tableToEdit={editingTable}
            />
        </div>
    );
};

export default ManageTables;