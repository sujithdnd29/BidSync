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

        <div>

            <h1>All Auctions</h1>

            {auctions.map((auction) => (

                <AuctionCard
                    key={auction._id}
                    auction={auction}
                />

            ))}

        </div>

    );

}

export default Home;