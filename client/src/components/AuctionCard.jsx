import { Link } from "react-router-dom";
function AuctionCard({ auction }) {

    return (

        <Link
    to={`/auction/${auction._id}`}
    style={{
        textDecoration: "none",
        color: "inherit",
    }}
>
        <div
            style={{
                border: "1px solid gray",
                padding: "15px",
                margin: "15px",
                borderRadius: "8px",
            }}
        >
            {auction.images?.length > 0 && (
    <img
        src={auction.images[0].url}
        alt={auction.title}
        style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "10px",
        }}
    />
)}

            <h2>{auction.title}</h2>

            <p>
                {auction.description}
            </p>

            <h3>
                ₹ {auction.currentPrice}
            </h3>

            <p>
                Category : {auction.category}
            </p>

            <p>
                Seller : {auction.seller.name}
            </p>

            <p>
                Status : {auction.status}
            </p>

        </div>
        </Link>

    );

}

export default AuctionCard;