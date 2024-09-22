'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { AlertTriangle, Loader } from 'lucide-react';

import { Id } from '../../../../../../convex/_generated/dataModel';

import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation';

import { useMemberId } from '@/hooks/use-member-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { Conversation } from './conversation';

const MemberIdPage = () => {
    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();

    const [conversationId, setConversationId] =
        useState<Id<'conversations'> | null>(null);

    const { mutate, isPending } = useCreateOrGetConversation();

    useEffect(() => {
        mutate(
            {
                memberId,
                workspaceId,
            },
            {
                onSuccess: data => {
                    setConversationId(data);
                },
                onError: () => {
                    toast.error('Failed to create or get conversation');
                },
            },
        );
    }, [memberId, workspaceId, mutate]);

    if (isPending) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader className="text-muted-foreground size-6 animate-spin" />
            </div>
        );
    }

    if (!conversationId) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <AlertTriangle className="text-muted-foreground size-6" />
                <p className="text-muted-foreground text-sm">
                    Conversation not found
                </p>
            </div>
        );
    }

    return <Conversation id={conversationId} />;
};

export default MemberIdPage;
