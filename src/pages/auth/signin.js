import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Signin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    } else if (status === 'unauthenticated') {
      signIn('github');
    }
  }, [status, router]);

  return null; // Render nothing while redirecting or authenticating
}
