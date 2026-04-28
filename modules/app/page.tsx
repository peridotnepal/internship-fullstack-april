import DownloadCard from "@/components/DownloadCard";
import Navbar from "@/components/Navbar";
import FuelPriceDownloader from "@/components/petroliumDownload";
import Footer from "@/components/PostsFooter";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-10">
        <h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>

        <p className="text-gray-500 mt-2">
          Select a module from the navbar above
          {/* <DownloadCard/> */}
          <Footer/>
        </p>
      </div>
    </div>
  );
}
