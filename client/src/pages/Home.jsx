import { useEffect, useState } from "react";

import { getAllAuctions } from "../services/auctionService";

import AuctionCard from "../components/AuctionCard";

function Home() {

    const [auctions, setAuctions] = useState([]);

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

      <div className="flex justify-between items-center mt-16 mb-8">

    <div>

        <h2 className="text-4xl font-bold text-slate-900">
            Live Auctions
        </h2>

        <p className="text-gray-500 mt-2">
            Explore ongoing and upcoming auctions.
        </p>

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
            className="
            px-5 py-2 rounded-full  bg-white shadow hover:bg-blue-600  hover:text-white transition-all duration-300
            "
        >
            {category}
        </button>

    ))}

</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {auctions.map((auction) => (

          <AuctionCard
            key={auction._id}
            auction={auction}
          />

        ))}

      </div>

    </section>

  </div>
);
}

export default Home;