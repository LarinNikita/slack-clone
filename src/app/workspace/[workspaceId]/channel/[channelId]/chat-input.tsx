import { useRef, useState } from 'react';

import Quill from 'quill';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

import { useCreateMessage } from '@/features/messages/api/use-create-message';

import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ChatInputProps {
    placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
    const [editorKey, setEditorKey] = useState<number>(0);
    const [isPending, setIsPending] = useState<boolean>(false);
    const editorRef = useRef<Quill | null>(null);

    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();

    const { mutate: createMessage } = useCreateMessage();

    const handleSubmit = async ({
        body,
        image,
    }: {
        body: string;
        image: File | null;
    }) => {
        try {
            setIsPending(true);

            await createMessage(
                {
                    workspaceId,
                    channelId,
                    body,
                },
                {
                    throwError: true,
                },
            );

            //* Rerender editor to clear content after submission
            setEditorKey(prevKey => prevKey + 1);
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="w-full px-5">
            <Editor
                key={editorKey}
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={editorRef}
            />
        </div>
    );
};
