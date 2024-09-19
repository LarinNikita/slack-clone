import {
    MutableRefObject,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

import 'quill/dist/quill.snow.css';
import { Delta, Op } from 'quill/core';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';
import { ImageIcon, Smile } from 'lucide-react';
import Quill, { type QuillOptions } from 'quill';

import { cn } from '@/lib/utils';

import { Hint } from './hint';

import { Button } from './ui/button';
import { EmojiPopover } from './emoji-popover';

type EditorValue = {
    image: File | null;
    body: string;
};

interface EditorProps {
    variant?: 'create' | 'update';
    onSubmit: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
}

const Editor = ({
    variant = 'create',
    onSubmit,
    onCancel,
    placeholder = 'Write something...',
    defaultValue = [],
    disabled = false,
    innerRef,
}: EditorProps) => {
    const [text, setText] = useState<string>('');
    const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);

    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const disabledRef = useRef(disabled);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement('div'),
        );

        const options: QuillOptions = {
            theme: 'snow',
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: 'Enter',
                            handler: () => {
                                //TODO submit form
                                return;
                            },
                        },
                        shift_enter: {
                            key: 'Enter',
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(
                                    quill.getSelection()?.index || 0,
                                    '\n',
                                );
                            },
                        },
                    },
                },
            },
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        });

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);

            if (container) {
                container.innerHTML = '';
            }

            if (quillRef.current) {
                quillRef.current = null;
            }

            if (innerRef) {
                innerRef.current = null;
            }
        };
    }, [innerRef]);

    const toggleToolbar = () => {
        setIsToolbarVisible(current => !current);
        const toolbarElement =
            containerRef.current?.querySelector('.ql-toolbar');

        if (toolbarElement) {
            toolbarElement.classList.toggle('hidden');
        }
    };

    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current;

        quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
    };

    //* Переменная isEmpty возвращает true, если текст считается пустым после удаления HTML-тегов и убирая пробелы, в противно случае false, если он не пустой.
    const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:shadow-sm focus-visible:border-slate-300">
                <div ref={containerRef} className="ql-custom h-full" />
                <div className="z-[5] flex px-2 pb-2">
                    <Hint
                        label={
                            isToolbarVisible
                                ? 'Hide formatting'
                                : 'Show formatting'
                        }
                    >
                        <Button
                            disabled={disabled}
                            size="iconSm"
                            variant="ghost"
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className="size-4" />
                        </Button>
                    </Hint>
                    <EmojiPopover hint="Emoji" onEmojiSelect={onEmojiSelect}>
                        <Button
                            disabled={disabled}
                            size="iconSm"
                            variant="ghost"
                        >
                            <Smile className="size-4" />
                        </Button>
                    </EmojiPopover>
                    {variant === 'create' && (
                        <Hint label="Image">
                            <Button
                                disabled={disabled}
                                size="iconSm"
                                variant="ghost"
                                onClick={() => {}}
                            >
                                <ImageIcon className="size-4" />
                            </Button>
                        </Hint>
                    )}
                    {variant === 'update' && (
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button
                                disabled={disabled}
                                size="sm"
                                variant="outline"
                                onClick={() => {}}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={disabled || isEmpty}
                                size="sm"
                                className="bg-[#007a5a] text-white hover:bg-[#007a5a]/80"
                                onClick={() => {}}
                            >
                                Save
                            </Button>
                        </div>
                    )}
                    {variant === 'create' && (
                        <Button
                            disabled={disabled || isEmpty}
                            onClick={() => {}}
                            size="iconSm"
                            className={cn(
                                'ml-auto',
                                isEmpty
                                    ? 'text-muted-foreground bg-white hover:bg-white'
                                    : 'bg-[#007a5a] text-white hover:bg-[#007a5a]/80',
                            )}
                        >
                            <MdSend className="size-4" />
                        </Button>
                    )}
                </div>
            </div>
            {variant === 'create' && (
                <div
                    className={cn(
                        'text-muted-foreground flex justify-end p-2 text-[10px] opacity-0 transition',
                        !isEmpty && 'opacity-100',
                    )}
                >
                    <p>
                        <strong>Shift + Return</strong> to add a new line
                    </p>
                </div>
            )}
        </div>
    );
};

export default Editor;
