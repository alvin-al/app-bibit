import PublicNavbar from "@/components/PublicNavbar";

export default async function Home() {
  return (
    <main>
      <div className='top-0 sticky z-10'>
        <PublicNavbar />
      </div>
      <h1 className='mb-4 text-2xl min-h-screen p-8'>Homescreen</h1>
    </main>
  );
}
