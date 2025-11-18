import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <h1 className='mb-4 text-3xl'>Homescreen</h1>
      <div className='space-x-4'>
        <Link href='/register'>
          <Button variant='outline'>Daftar</Button>
        </Link>
        <Link href='/login'>
          <Button>Login</Button>
        </Link>
      </div>
    </main>
  );
}
