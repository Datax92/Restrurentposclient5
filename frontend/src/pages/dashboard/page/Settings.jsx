import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    User, Lock, Bell, Palette, Monitor, Moon, Sun,
    Shield, ChevronRight, Check, LogOut, Store,
} from 'lucide-react';
import { toast } from 'sonner';

const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold text-sm tracking-tight">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const ThemeCard = ({ value, label, icon: Icon, current, onClick }) => (
    <button
        onClick={() => onClick(value)}
        className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 flex-1',
            current === value
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/40 hover:bg-muted/50'
        )}
    >
        <Icon className={cn('w-5 h-5', current === value ? 'text-primary' : 'text-muted-foreground')} />
        <span className={cn('text-xs font-medium', current === value ? 'text-primary' : 'text-muted-foreground')}>
            {label}
        </span>
        {current === value && (
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
        )}
    </button>
);

const Toggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="text-sm font-medium">{label}</p>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none',
                enabled ? 'bg-primary' : 'bg-muted'
            )}
        >
            <span
                className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
                    enabled ? 'translate-x-6' : 'translate-x-1'
                )}
            />
        </button>
    </div>
);

const Settings = () => {
    const { authUser, logout } = useAuthStore();
    const { theme, setTheme } = useThemeStore();

    const [notifications, setNotifications] = useState({
        newOrders: true,
        kitchenAlerts: true,
        lowInventory: false,
        dailyReport: true,
    });

    const handleSaveProfile = (e) => {
        e.preventDefault();
        toast.success('Profile settings saved — backend integration required to persist.');
    };

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar bg-background">
            <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

                {/* Page Header */}
                <div className="space-y-1 pb-2">
                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage your account preferences and system configuration.</p>
                </div>

                {/* Profile */}
                <Section title="Profile" icon={User}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                            {authUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="font-semibold">{authUser?.name || 'User'}</p>
                            <p className="text-sm text-muted-foreground">{authUser?.email || '—'}</p>
                            <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {authUser?.role || 'staff'}
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs">Full Name</Label>
                                <Input id="name" defaultValue={authUser?.name || ''} placeholder="Your name" className="h-9" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs">Email</Label>
                                <Input id="email" defaultValue={authUser?.email || ''} placeholder="you@example.com" className="h-9" disabled />
                            </div>
                        </div>
                        <Button type="submit" size="sm" className="mt-2">Save Changes</Button>
                    </form>
                </Section>

                {/* Appearance / Theme */}
                <Section title="Appearance" icon={Palette}>
                    <p className="text-xs text-muted-foreground mb-4">Choose how Tasty Station looks on your device.</p>
                    <div className="flex gap-3">
                        <ThemeCard value="light"  label="Light"  icon={Sun}     current={theme} onClick={setTheme} />
                        <ThemeCard value="dark"   label="Dark"   icon={Moon}    current={theme} onClick={setTheme} />
                        <ThemeCard value="system" label="System" icon={Monitor} current={theme} onClick={setTheme} />
                    </div>
                </Section>

                {/* Notifications */}
                <Section title="Notifications" icon={Bell}>
                    <div className="divide-y divide-border">
                        <Toggle
                            enabled={notifications.newOrders}
                            onChange={(v) => setNotifications({ ...notifications, newOrders: v })}
                            label="New Order Alerts"
                            description="Play a sound and show a badge when a new order arrives."
                        />
                        <Toggle
                            enabled={notifications.kitchenAlerts}
                            onChange={(v) => setNotifications({ ...notifications, kitchenAlerts: v })}
                            label="Kitchen Alerts"
                            description="Notify when kitchen marks an order as ready."
                        />
                        <Toggle
                            enabled={notifications.lowInventory}
                            onChange={(v) => setNotifications({ ...notifications, lowInventory: v })}
                            label="Low Inventory Warnings"
                            description="Receive alerts when stock falls below threshold."
                        />
                        <Toggle
                            enabled={notifications.dailyReport}
                            onChange={(v) => setNotifications({ ...notifications, dailyReport: v })}
                            label="Daily Summary Report"
                            description="Receive an end-of-day sales summary."
                        />
                    </div>
                </Section>

                {/* Restaurant Info */}
                <Section title="Restaurant Info" icon={Store}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Restaurant Name</Label>
                            <Input defaultValue="Tasty Station" className="h-9" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Phone</Label>
                            <Input defaultValue="555-991-2781" className="h-9" />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-xs">Address</Label>
                            <Input defaultValue="123 Culinary Street, Food City" className="h-9" />
                        </div>
                    </div>
                    <Button size="sm" className="mt-4" onClick={() => toast.success('Restaurant info saved.')}>Save Info</Button>
                </Section>

                {/* Security */}
                <Section title="Security" icon={Shield}>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Change Password</p>
                                    <p className="text-xs text-muted-foreground">Update your login credentials</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                </Section>

                {/* Danger Zone */}
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Sign out of this device</p>
                            <p className="text-xs text-muted-foreground">You will be redirected to the login page.</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={logout}
                            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
