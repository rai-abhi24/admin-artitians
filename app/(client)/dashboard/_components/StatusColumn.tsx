import { Badge } from "@/components/ui/badge";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Eye,
} from "lucide-react";
import { MerchantSummary } from "@/types/dashboard";
import { MerchantStatus } from "@/types/merchant";

const StatusColumn = ({
    status,
    merchants,
    openDetailsDialog,
}: {
    status: MerchantStatus;
    merchants: MerchantSummary[];
    getStatusColor: (status: MerchantStatus) => string;
    openDetailsDialog: (id: string) => void;
}) => {
    const statusConfig = {
        pending: {
            title: "Pending",
            subtitle: "New prospects",
            color: "text-blue-600",
        },
        processing: {
            title: "Processing",
            subtitle: "Under review",
            color: "text-orange-600",
        },
        onboarded: {
            title: "Onboarded",
            subtitle: "Successfully onboarded",
            color: "text-green-600",

        },
        approved: {
            title: "Approved",
            subtitle: "Active merchants",
            color: "text-emerald-600",

        },
        rejected: {
            title: "Rejected",
            subtitle: "Not approved",
            color: "text-red-600",

        }
    };
    const config = statusConfig[status];

    return (
        <div className="space-y-2 mt-5">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className={`font-bold text-lg ${config.color}`}>{config.title}</h4>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {merchants.slice(0, 5).map((m) => (
                    <div key={m._id} className="rounded-lg relative border p-4 bg-background hover-elevate transition-all">
                        <div className="flex items-start justify-between">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <h4 className="font-medium truncate" title={m.businessName}>{m.businessName}</h4>
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">

                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={"outline"} className={`capitalize`}>{m.entityType && <span className="capitalize">{String(m.entityType).replaceAll("_", " ")}</span>}</Badge>
                            </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            {m.email && (
                                <div className="flex items-center gap-1 text-muted-foreground truncate" title={m.email}>
                                    <Mail className="h-3 w-3" /> {m.email}
                                </div>
                            )}
                            {m.phone && (
                                <div className="flex items-center gap-1 text-muted-foreground truncate" title={m.phone}>
                                    <Phone className="h-3 w-3" /> {m.phone}
                                </div>
                            )}
                            {m.city && (
                                <div className="flex items-center gap-1 text-muted-foreground truncate col-span-2" title={m.city}>
                                    <MapPin className="h-3 w-3" /> {m.city}
                                </div>
                            )}
                        </div>
                        <div className="mt-3 text-[11px] text-muted-foreground">Added {new Date(m.createdAt).toLocaleDateString()}</div>
                        <Eye className="absolute bottom-4 right-4 h-5 w-5 text-muted-foreground hover:text-primary hover:scale-125 transition-all ease-initial cursor-pointer" onClick={() => openDetailsDialog(m._id)} />
                    </div>
                ))}

                {merchants.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No {status} merchants</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusColumn;