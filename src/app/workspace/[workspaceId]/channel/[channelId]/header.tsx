import React, { useState } from 'react';

import { toast } from 'sonner';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';

import { useUpdateChannel } from '@/features/channels/api/use-update-channel';
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel';

import { useConfirm } from '@/hooks/use-confirm';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useCurrentMember } from '@/features/members/api/use-current-member';

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    const router = useRouter();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure?',
        'This action cannot be undone.',
    );

    const [value, setValue] = useState<string>(title);
    const [editOpen, setEditOpen] = useState(false);

    const { data: member } = useCurrentMember({ workspaceId });
    const { mutate: updateChannel, isPending: updatingChannel } =
        useUpdateChannel();
    const { mutate: removeChannel, isPending: removingChannel } =
        useRemoveChannel();

    const handleEditOpen = (value: boolean) => {
        if (member?.role !== 'admin') return;

        setEditOpen(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, '-').toLocaleLowerCase();
        setValue(value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateChannel(
            { id: channelId, name: value },
            {
                onSuccess: () => {
                    toast.success('Channel updated');
                    setEditOpen(false);
                },
                onError: () => {
                    toast.error('Failed to update channel');
                },
            },
        );
    };

    const handleDelete = async () => {
        const ok = await confirm();

        if (!ok) return;

        removeChannel(
            {
                id: channelId,
            },
            {
                onSuccess: () => {
                    toast.success('Channel deleted');
                    router.push(`/workspace/${workspaceId}`);
                },
                onError: () => {
                    toast.error('Failed to delete channel');
                },
            },
        );
    };

    return (
        <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="w-auto overflow-hidden px-2 text-lg font-semibold"
                    >
                        <span className="truncate"># {title}</span>
                        <FaChevronDown className="ml-2 size-2.5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="overflow-hidden bg-gray-50 p-0">
                    <DialogHeader className="border-b bg-white p-4">
                        <DialogTitle># {title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-2 px-4 pb-4">
                        <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                            <DialogTrigger asChild>
                                <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            Channel name
                                        </p>
                                        {member?.role === 'admin' && (
                                            <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                                                Edit
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm"># {title}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Rename this channel
                                    </DialogTitle>
                                </DialogHeader>
                                <form
                                    className="space-y-4"
                                    onSubmit={handleSubmit}
                                >
                                    <Input
                                        value={value}
                                        disabled={updatingChannel}
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                        minLength={3}
                                        maxLength={80}
                                        placeholder="e.g. plan-budget"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                variant="outline"
                                                disabled={updatingChannel}
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            disabled={updatingChannel}
                                            type="submit"
                                        >
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {member?.role === 'admin' && (
                            <button
                                onClick={handleDelete}
                                disabled={removingChannel}
                                className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50"
                            >
                                <TrashIcon className="size-4" />
                                <p className="text-sm font-semibold">
                                    Delete channel
                                </p>
                            </button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
