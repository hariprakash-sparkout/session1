import Landing from "@/components/Landing";
import Navbar from "@/components/navbar";
export default function Home() {
  return (
    <main className=" ">
      <div className="w-full">
        <Navbar />
      </div>
      <div>
      <Landing />
      </div>
      
    </main>
  );
}
