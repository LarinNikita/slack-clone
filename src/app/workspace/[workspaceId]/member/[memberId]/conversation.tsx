import { Loader } from 'lucide-react';

import { Id } from '../../../../../../convex/_generated/dataModel';

import { useGetMember } from '@/features/members/api/use-get-member';
import { useGetMessages } from '@/features/messages/api/use-get-messages';

import { useMemberId } from '@/hooks/use-member-id';

import { Header } from './header';
import { ChatInput } from './chat-input';

import { MessageList } from '@/components/message-list';

interface ConversationProps {
    id: Id<'conversations'>;
}

export const Conversation = ({ id }: ConversationProps) => {
    const memberId = useMemberId();

    const { data: member, isLoading: memberLoading } = useGetMember({
        id: memberId,
    });
    const { results, status, loadMore } = useGetMessages({
        conversationId: id,
    });

    if (memberLoading || status === 'LoadingFirstPage') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader className="text-muted-foreground size-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <Header
                memberName={member?.user.name}
                memberImage={member?.user.image}
                onClick={() => {}}
            />
            <MessageList
                data={results}
                variant="conversation"
                memberImage={member?.user.image}
                memberName={member?.user.name}
                loadMore={loadMore}
                isLoadingMore={status === 'LoadingMore'}
                canLoadMore={status === 'CanLoadMore'}
            />
            <ChatInput
                placeholder={`Message ${member?.user.name}`}
                conversationId={id}
            />
        </div>
    );
};
