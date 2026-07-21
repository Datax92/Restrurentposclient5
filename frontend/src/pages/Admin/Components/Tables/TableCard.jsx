import React from 'react';
import { cn } from "@/lib/utils";
import { User, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const TableCard = ({ table, onClick }) => {
    // Status configurations
    const statusConfig = {
        "Available": {
            color: "bg-teal-500/10 border-teal-500/50 backdrop-blur-xl",
            badge: "bg-teal-100 text-teal-700 hover:bg-teal-200",
            shadow: "shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_25px_rgba(20,184,166,0.2)]",
            chair: "bg-teal-200/50 border-teal-300/50 backdrop-blur-sm"
        },
        "Occupied": {
            color: "bg-red-500/10 border-red-500/50 backdrop-blur-xl",
            badge: "bg-red-100 text-red-700 hover:bg-red-200",
            shadow: "shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]",
            chair: "bg-red-200/50 border-red-300/50 backdrop-blur-sm"
        },
        "Reserved": {
            color: "bg-amber-500/10 border-amber-500/50 backdrop-blur-xl",
            badge: "bg-amber-100 text-amber-800 hover:bg-amber-200",
            shadow: "shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]",
            chair: "bg-amber-200/50 border-amber-300/50 backdrop-blur-sm"
        }
    };

    const config = statusConfig[table.status] || statusConfig["Available"];

    // Dynamic sizing based on capacity
    const getTableDimensions = (capacity) => {
        // Base size for 2 people
        if (capacity <= 2) return { width: "w-24", height: "h-24", distribution: { top: 1, bottom: 1, left: 0, right: 0 } };
        if (capacity <= 4) return { width: "w-32", height: "h-32", distribution: { top: 2, bottom: 2, left: 0, right: 0 } };
        if (capacity <= 6) return { width: "w-48", height: "h-32", distribution: { top: 3, bottom: 3, left: 0, right: 0 } };
        if (capacity <= 8) return { width: "w-64", height: "h-32", distribution: { top: 4, bottom: 4, left: 0, right: 0 } };
        // Large table
        return { width: "w-72", height: "h-40", distribution: { top: 5, bottom: 5, left: 0, right: 0 } };
    };

    const dimensions = getTableDimensions(table.capacity);

    const renderChairRow = (count, side) => {
        if (count <= 0) return null;

        const isVertical = side === 'left' || side === 'right';
        // Base chair classes
        const chairBaseClass = cn(
            "absolute flex gap-3 justify-center items-center pointer-events-none",
            isVertical ? "flex-col h-full top-0 py-2" : "flex-row w-full left-0 px-2"
        );

        // Position specific styles
        const positionClass = {
            top: "-top-5 left-0 w-full",
            bottom: "-bottom-5 left-0 w-full",
            left: "-left-5 top-0 h-full",
            right: "-right-5 top-0 h-full"
        };

        // Individual chair style
        const individualChairClass = cn(
            "rounded-md border shadow-sm transition-colors duration-200",
            config.chair,
            isVertical ? "w-4 h-8" : "w-8 h-4",
            // If table is occupied, make some chairs look "active" visually? 
            // For now, keep uniform color based on status.
        );

        return (
            <div className={cn(chairBaseClass, positionClass[side])}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className={individualChairClass}>
                        {/* Backrest hint for detail */}
                        <div className={cn(
                            "opacity-30 bg-black/10 absolute",
                            isVertical ? "w-1 h-6 top-1 right-0.5 rounded-sm" : "h-1 w-6 bottom-0.5 left-1 rounded-sm"
                        )} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div
            onClick={() => onClick(table)}
            className="flex flex-col items-center  justify-center p-8 cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
        >
            <div className="relative">
                {/* Chairs */}
                {renderChairRow(dimensions.distribution.top, 'top')}
                {renderChairRow(dimensions.distribution.bottom, 'bottom')}
                {renderChairRow(dimensions.distribution.left, 'left')}
                {renderChairRow(dimensions.distribution.right, 'right')}

                {/* Table Surface */}
                <div className={cn(
                    "relative rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 z-10",
                    dimensions.width,
                    dimensions.height,
                    config.color,
                    config.shadow,
                    "group-hover:translate-y-[-2px]"
                )}>
                    <span className="font-bold text-foreground text-lg mb-0.5">{table.name}</span>
                    <div className="flex items-center text-xs font-medium text-muted-foreground bg-background/50 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-border/50">
                        <Users className="w-3 h-3 mr-1" />
                        {table.capacity}
                    </div>

                    {/* Status Indicator Dot */}
                    <div className={cn(
                        "absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-background shadow-sm animate-pulse shadow-teal-500/20",
                        table.status === 'Available' ? "bg-teal-500" :
                            table.status === 'Occupied' ? "bg-red-500" : "bg-amber-500"
                    )} />

                    {/* Subtle internal glow matching status color */}
                    <div className={cn(
                        "absolute inset-0 opacity-20 -z-10 blur-xl",
                        table.status === 'Available' ? "bg-teal-500" :
                            table.status === 'Occupied' ? "bg-red-500" : "bg-amber-500"
                    )} />
                </div>
            </div>

            {/* Hover Info (Optional, keeping it clean for now as per design) */}
        </div>
    );
};

export default TableCard;
