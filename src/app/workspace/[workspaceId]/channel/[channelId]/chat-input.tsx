import { useRef } from 'react';

import Quill from 'quill';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ChatInputProps {
    placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
    const editorRef = useRef<Quill | null>(null);

    return (
        <div className="w-full px-5">
            <Editor
                placeholder={placeholder}
                onSubmit={() => {}}
                disabled={false}
                innerRef={editorRef}
            />
        </div>
    );
};
