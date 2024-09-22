import { useMemberId } from '@/hooks/use-member-id';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useGetMember } from '@/features/members/api/use-get-member';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { Loader } from 'lucide-react';
import { Header } from './header';

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
        </div>
    );
};
