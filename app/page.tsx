import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default async function Home() {
  const { data: testData, error } = await supabase.from("test").select("*");
  console.log(testData, error);

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <h1 className='text-2xl'>Testing Supabase Connection...</h1>
      <p>
        Check your terminal console (where you run `npm run dev`) to see the
        result.
      </p>

      {/* Tampilkan hasil di browser untuk visualisasi */}
      <div className='mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800'>
        <h2 className='font-bold'>Result from Supabase:</h2>
        <pre className='text-sm mt-2'>
          {error
            ? `Error: ${error.message}`
            : JSON.stringify(testData, null, 2)}
        </pre>
      </div>
    </main>
  );
}
