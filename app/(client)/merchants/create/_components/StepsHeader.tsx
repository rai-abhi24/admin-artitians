"use client";

import { Check } from "lucide-react";

type Props = {
    steps: string[];
    current: number;
};

export function StepsHeader({ steps, current }: Props) {
    return (
        <ol className="grid grid-cols-7 gap-3">
            {steps.map((label, i) => {
                const active = i === current;
                const done = i < current;
                return (
                    <li key={label} className="flex flex-col items-center gap-2">
                        {done ? (
                            <span
                                className={
                                    "flex size-8 items-center justify-center rounded-full text-sm font-semibold border bg-emerald-600 text-white border-emerald-600"
                                }
                            >
                                <Check className="w-4 h-4" />
                            </span>
                        ) : (
                            <span
                                className={
                                    "flex size-8 items-center justify-center rounded-full text-sm font-semibold border " +
                                    (active
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted text-foreground/70 border-muted-foreground/20")
                                }
                            >
                                {i + 1}
                            </span>
                        )}
                        <span className="hidden md:block text-sm font-medium truncate" title={label}>
                            {label}
                        </span>
                    </li>
                );
            })}
        </ol >
    );
}


