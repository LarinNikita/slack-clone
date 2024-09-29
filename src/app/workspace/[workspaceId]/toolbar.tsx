import { useState } from 'react';

import { Info, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';

import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command';

export const Toolbar = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const { data } = useGetWorkspace({ id: workspaceId });
    const { data: channels } = useGetChannels({ workspaceId });
    const { data: members } = useGetMembers({ workspaceId });

    const [open, setOpen] = useState<boolean>(false);

    const onChannelClick = (channelId: string) => {
        setOpen(false);

        router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    };

    const onMemberClick = (memberId: string) => {
        setOpen(false);

        router.push(`/workspace/${workspaceId}/member/${memberId}`);
    };

    return (
        <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
            <div className="flex-1" />
            <div className="max-[642px] min-w-[280px] shrink grow-[2]">
                <Button
                    onClick={() => setOpen(true)}
                    size="sm"
                    className="bg-accent/25 hover:bg-accent/25 h-7 w-full justify-start px-2"
                >
                    <Search className="mr-2 size-4 text-white" />
                    <span className="text-xs text-white">
                        Search {data?.name}
                    </span>
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Search for channels or members..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Channels">
                            {channels?.map(channel => (
                                <CommandItem
                                    key={channel._id}
                                    onSelect={() => onChannelClick(channel._id)}
                                >
                                    {channel.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Members">
                            {members?.map(member => (
                                <CommandItem
                                    key={member._id}
                                    onSelect={() => onMemberClick(member._id)}
                                >
                                    {member.user.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
            <div className="ml-auto flex flex-1 items-center justify-end">
                <Button variant="transparent" size="iconSm">
                    <Info className="size-5 text-white" />
                </Button>
            </div>
        </nav>
    );
};
