'use client';

import { useEffect, useMemo } from 'react';

import { useRouter } from 'next/navigation';
import { Loader, TriangleAlert } from 'lucide-react';

import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';

import { useWorkspaceId } from '@/hooks/use-workspace-id';

const WorkspaceIdPage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useCreateChannelModal();

    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
        id: workspaceId,
    });
    const { data: channels, isLoading: channelsLoading } = useGetChannels({
        workspaceId,
    });
    const { data: member, isLoading: memberLoading } = useCurrentMember({
        workspaceId,
    });

    const channelId = useMemo(() => channels?.[0]?._id, [channels]);
    const isAdmin = useMemo(() => member?.role === 'admin', [member?.role]);

    useEffect(() => {
        if (
            workspaceLoading ||
            channelsLoading ||
            memberLoading ||
            !member ||
            !workspace
        )
            return;

        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open && isAdmin) {
            setOpen(true);
        }
    }, [
        channelId,
        workspaceLoading,
        channelsLoading,
        workspace,
        open,
        setOpen,
        router,
        workspaceId,
        member,
        memberLoading,
        isAdmin,
    ]);

    if (workspaceLoading || channelsLoading || memberLoading) {
        return (
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
                <Loader className="text-muted-foreground size-6 animate-spin" />
            </div>
        );
    }

    if (!workspace || !member) {
        return (
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
                <TriangleAlert className="text-muted-foreground size-6" />
                <span className="text-muted-foreground text-sm">
                    Workspace not found
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
            <TriangleAlert className="text-muted-foreground size-6" />
            <span className="text-muted-foreground text-sm">
                No channel found
            </span>
        </div>
    );
};

export default WorkspaceIdPage;
