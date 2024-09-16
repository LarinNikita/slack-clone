import { LucideIcon } from 'lucide-react';
import { IconTree } from 'react-icons/lib';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarButtonProps {
    icon: LucideIcon | IconTree;
    label: string;
    isActive?: boolean;
}

export const SidebarButton = ({
    icon: Icon,
    label,
    isActive,
}: SidebarButtonProps) => {
    return (
        <div className="group flex cursor-pointer flex-col items-center gap-y-0.5">
            <Button
                variant="transparent"
                className={cn(
                    'group-hover:bg-accent/20 size-9 p-2',
                    isActive && 'bg-accent/20',
                )}
            >
                {/* @ts-ignore */}
                <Icon className="size-5 text-white transition-all group-hover:scale-110" />
            </Button>
            <span className="group-hover:text-accent text-[11px] text-white">
                {label}
            </span>
        </div>
    );
};
