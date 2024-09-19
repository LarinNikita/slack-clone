'use client';

import { Loader, TriangleAlert } from 'lucide-react';

import { useGetChannel } from '@/features/channels/api/use-get-channel';

import { useChannelId } from '@/hooks/use-channel-id';

import { Header } from './header';
import { ChatInput } from './chat-input';

const ChannelIdPage = () => {
    const channelId = useChannelId();

    const { data: channel, isLoading: channelLoading } = useGetChannel({
        id: channelId,
    });

    if (channelLoading) {
        return (
            <div className="flex h-full flex-1 items-center justify-center">
                <Loader className="text-muted-foreground size-5 animate-spin" />
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-2">
                <TriangleAlert className="text-muted-foreground size-5" />
                <span className="text-muted-foreground text-sm">
                    Channel not found
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <Header title={channel.name} />
            <div className="flex-1"></div>
            <ChatInput placeholder={`Message # ${channel.name}`} />
        </div>
    );
};

export default ChannelIdPage;
