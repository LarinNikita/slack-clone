import { useState } from 'react';

import { useCreateChannel } from '../api/use-create-channel';

import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { useCreateChannelModal } from '../store/use-create-channel-modal';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export const CreateChannelModal = () => {
    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useCreateChannel();

    const [open, setOpen] = useCreateChannelModal();

    const [name, setName] = useState<string>('');

    const handleClose = () => {
        setName('');
        setOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, '-').toLocaleLowerCase();
        setName(value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate(
            {
                name,
                workspaceId,
            },
            {
                onSuccess: id => {
                    //TODO redirect to new channel page
                    handleClose();
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        value={name}
                        disabled={isPending}
                        onChange={handleChange}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="e.g. plan-budget"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending} type="submit">
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
