'use client';

import { useEffect, useMemo } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import VerificationInput from 'react-verification-input';

import { useJoin } from '@/features/workspaces/api/use-join';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';

import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

const JoinPage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useJoin();
    const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

    const isMember = useMemo(() => data?.isMember, [data?.isMember]);

    useEffect(() => {
        if (isMember) {
            router.push(`/workspace/${workspaceId}`);
        }
    }, [isMember, router, workspaceId]);

    const handleComplete = (value: string) => {
        mutate(
            { workspaceId, joinCode: value },
            {
                onSuccess: id => {
                    router.replace(`/workspace/${id}`);
                    toast.success('Workspace joined');
                },
                onError: () => {
                    toast.error('Failed to join workspace');
                },
            },
        );
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader className="text-muted-foreground size-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-md">
            <Image src="/logo.png" alt="Logo" width={60} height={60} />
            <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
                <div className="flex flex-col items-center justify-center gap-y-2">
                    <h1 className="text-2xl font-bold">Join {data?.name}</h1>
                    <p className="text-md text-muted-foreground">
                        Enter the workspace code to join an existing workspace.
                    </p>
                </div>
                <VerificationInput
                    onComplete={handleComplete}
                    length={6}
                    autoFocus
                    classNames={{
                        container: cn(
                            'flex gap-x-2',
                            isPending && 'opacity-50 cursor-not-allowed',
                        ),
                        character:
                            'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
                        characterInactive: 'bg-muted',
                        characterSelected: 'bg-white text-black',
                        characterFilled: 'bg-white text-black',
                    }}
                />
            </div>
            <div className="flex gap-x-4">
                <Button size="lg" variant="outline" asChild>
                    <Link href="/">Back to homepage</Link>
                </Button>
            </div>
        </div>
    );
};

export default JoinPage;
