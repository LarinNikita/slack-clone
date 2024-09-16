'use client';

import { useEffect, useState } from 'react';

import { CreateWorkspacesModal } from '@/features/workspaces/components/create-workspace-modal';

export const Modals = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <CreateWorkspacesModal />
        </>
    );
};
