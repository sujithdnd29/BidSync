import { useEffect, useState } from "react";

import { getAllAuctions } from "../services/auctionService";
import toast from "react-hot-toast";

import AuctionCard from "../components/AuctionCard";

function Home() {

    const [auctions, setAuctions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");
const [sortBy, setSortBy] = useState("newest");

    const fetchAuctions = async () => {

        try {

            const data = await getAllAuctions();

            setAuctions(data.auctions);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchAuctions();

    }, []);
    const filteredAuctions = [...auctions]
  .filter((auction) =>
    auction.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .filter((auction) =>
    selectedCategory === "All"
      ? true
      : auction.category === selectedCategory
  )
  .sort((a, b) => {
    switch (sortBy) {
      case "priceLow":
        return a.currentPrice - b.currentPrice;

      case "priceHigh":
        return b.currentPrice - a.currentPrice;

      case "endingSoon":
        return (
          new Date(a.endTime) -
          new Date(b.endTime)
        );

      case "newest":
      default:
        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
    }
  });

   return (
  <div className="bg-slate-50 min-h-screen">

    {/* Hero Section */}
   <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white py-24 px-8 text-center shadow-xl">

    <h1 className="text-5xl md:text-6xl font-extrabold">
        Bid. Win. Own.
    </h1>

    <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
        Discover thousands of live auctions.
        Find amazing products and compete with bidders
        from around the world.
    </p>

    <button
    onClick={() =>
        document
            .getElementById("live-auctions")
            ?.scrollIntoView({
                behavior: "smooth",
            })
    }
    className="
        mt-10
        bg-white
        text-blue-700
        px-8
        py-4
        rounded-xl
        font-bold
        hover:scale-105
        transition-all
        duration-300
        shadow-lg
    "
>
    Browse Auctions →
</button>

</section>

    {/* Auctions */}
    <section className="max-w-7xl mx-auto px-6 pb-16">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-16 mb-8">

  <div  id="live-auctions"
    className="mt-20 scroll-mt-24">
    <h2 className="text-4xl font-bold text-slate-900">
      Live Auctions
    </h2>

    <p className="text-gray-500 mt-2">
      Explore ongoing and upcoming auctions.
    </p>
  </div>

  <div className="flex flex-col sm:flex-row gap-3">

    <input
      type="text"
      placeholder="🔍 Search auctions..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none w-72"
    />

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
    >
      <option value="newest">Newest</option>
      <option value="priceLow">Price: Low → High</option>
      <option value="priceHigh">Price: High → Low</option>
      <option value="endingSoon">Ending Soon</option>
    </select>

  </div>

</div>

    


<div className="flex flex-wrap gap-3 mb-10">

    {[
        "Electronics",
        "Fashion",
        "Books",
        "Sports",
        "Vehicles",
        "Home"
    ].map((category) => (

       <button
    key={category}
    onClick={() => setSelectedCategory(category)}
    className={`px-5 py-2 rounded-full transition-all duration-300 shadow

    ${
        selectedCategory === category
        ? "bg-blue-600 text-white"
        : "bg-white hover:bg-blue-600 hover:text-white"
    }
    `}
>
    {category}
</button>
    ))}

</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

       {filteredAuctions.length > 0 ? (
  filteredAuctions.map((auction) => (
    <AuctionCard
      key={auction._id}
      auction={auction}
    />
  ))
) : (
  <div className="col-span-full text-center py-20">
    <h3 className="text-2xl font-semibold text-gray-700">
      No auctions found
    </h3>

    <p className="text-gray-500 mt-3">
      Try another search or category.
    </p>
  </div>
)}

      </div>

    </section>

  </div>
);
}

export default Home;