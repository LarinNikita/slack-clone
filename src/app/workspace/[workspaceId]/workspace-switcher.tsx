import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';

import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const WorkspaceSwitcher = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [_open, setOpen] = useCreateWorkspaceModal();

    const { data: workspaces, isLoading: workspacesLoading } =
        useGetWorkspaces();
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
        id: workspaceId,
    });

    const filteredWorkspaces = workspaces?.filter(
        workspace => workspace?._id !== workspaceId,
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="relative size-9 overflow-hidden bg-[#ababad] text-xl font-semibold text-slate-800 hover:bg-[#ababad]/80">
                    {workspaceLoading ? (
                        <Loader className="size-5 shrink-0 animate-spin" />
                    ) : (
                        workspace?.name.charAt(0).toUpperCase()
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-64">
                <DropdownMenuItem
                    onClick={() => router.push(`/workspace/${workspaceId}`)}
                    className="cursor-pointer flex-col items-start justify-start capitalize"
                >
                    {workspace?.name}
                    <span className="text-muted-foreground text-xs">
                        Active workspace
                    </span>
                </DropdownMenuItem>
                {filteredWorkspaces?.map(workspace => (
                    <DropdownMenuItem
                        key={workspace._id}
                        className="cursor-pointer overflow-hidden capitalize"
                        onClick={() =>
                            router.push(`/workspace/${workspace._id}`)
                        }
                    >
                        <div className="relative mr-2 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-lg font-semibold text-white">
                            {workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="truncate">{workspace.name}</p>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    <div className="relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#f2f2f2] text-lg font-semibold text-slate-800">
                        <Plus className="size-5 shrink-0" />
                    </div>
                    Create a new workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
