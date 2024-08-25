import { useState } from 'react';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useAuthActions } from '@convex-dev/auth/react';

import { SignInFlow } from '../types';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface SignInCardProps {
    setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
    const { signIn } = useAuthActions();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onProviderSignIn = (value: 'github' | 'google') => {
        signIn(value);
    };

    return (
        <Card className="h-full w-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Login to continue</CardTitle>
                <CardDescription>
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5">
                    <Input
                        disabled={false}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <Input
                        disabled={false}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={false}
                    >
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        disabled={false}
                        onClick={() => onProviderSignIn('google')}
                        variant="outline"
                        size="lg"
                        className="relative w-full"
                    >
                        <FcGoogle className="absolute left-2.5 top-3 size-5" />
                        Continue with Google
                    </Button>
                    <Button
                        disabled={false}
                        onClick={() => onProviderSignIn('github')}
                        variant="outline"
                        size="lg"
                        className="relative w-full"
                    >
                        <FaGithub className="absolute left-2.5 top-3 size-5" />
                        Continue with Github
                    </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                    Don&apos;t have an account?{' '}
                    <span
                        onClick={() => setState('signUp')}
                        className="cursor-pointer text-sky-700 hover:underline"
                    >
                        Sign up
                    </span>
                </p>
            </CardContent>
        </Card>
    );
};
