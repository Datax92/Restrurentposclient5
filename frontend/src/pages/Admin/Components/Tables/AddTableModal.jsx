import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Armchair, Layers, Users, MapPin, CheckCircle2 } from 'lucide-react';
import { useTableStore } from '@/store/useTableStore';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

const AddTableModal = ({ isOpen, onClose, tableToEdit = null }) => {
    const { createTable, updateTable, isLoading } = useTableStore();

    // Zones - could be dynamic later
    const ZONES = ["Indoor", "Outdoor", "VIP", "Terrace", "Bar"];
    const STATUSES = ["Available", "Occupied", "Reserved"];

    const [formData, setFormData] = useState({
        name: "",
        capacity: 4,
        zone: "Indoor",
        status: "Available"
    });

    useEffect(() => {
        if (tableToEdit) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                name: tableToEdit.name,
                capacity: tableToEdit.capacity,
                zone: tableToEdit.zone,
                status: tableToEdit.status
            });
        } else {
            setFormData({ name: "", capacity: 4, zone: "Indoor", status: "Available" });
        }
    }, [tableToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let result;
        if (tableToEdit) {
            result = await updateTable(tableToEdit._id, formData);
        } else {
            result = await createTable(formData);
        }

        if (result.success) {
            onClose();
        } else {
            alert(result.message || "Operation failed");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border sm:rounded-lg bg-background">
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col h-full"
                        >
                            <DialogHeader className="p-6 pb-4 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                                        <Armchair className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-semibold text-foreground tracking-tight">
                                            {tableToEdit ? "Edit Table" : "Add New Table"}
                                        </DialogTitle>
                                        <p className="text-sm text-muted-foreground">Configure floor plan layout</p>
                                    </div>
                                </div>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="space-y-4">
                                    {/* Table Name */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="name" className="text-sm font-medium">Table Name / ID</Label>
                                            <span className="text-[10px] font-medium text-primary px-2 py-0.5 rounded-md uppercase border bg-primary/5">Required</span>
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                placeholder="e.g. Table 01"
                                                className="pl-9 rounded-md h-10"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Capacity */}
                                        <div className="space-y-2">
                                            <Label htmlFor="capacity" className="text-sm font-medium">Capacity</Label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="capacity"
                                                    type="number"
                                                    min="1"
                                                    className="pl-9 rounded-md h-10"
                                                    value={formData.capacity}
                                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Zone Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="zone" className="text-sm font-medium">Zone Setting</Label>
                                            <div className="relative">
                                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                                <select
                                                    id="zone"
                                                    className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-8 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                                                    value={formData.zone}
                                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                                >
                                                    {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9 6 6 6-6"></path></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-sm font-medium">Current Status</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {STATUSES.map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, status: s })}
                                                    className={cn(
                                                        "h-10 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all border",
                                                        formData.status === s 
                                                            ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                                            : "bg-background text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground"
                                                    )}
                                                >
                                                    {formData.status === s && <CheckCircle2 className="w-4 h-4" />}
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="pt-4 sm:justify-end items-center gap-2">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={onClose} 
                                        disabled={isLoading}
                                        className="rounded-md"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={isLoading} 
                                        className="rounded-md min-w-[120px]"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>{tableToEdit ? "Update Table" : "Add Table"}</>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};

export default AddTableModal;
