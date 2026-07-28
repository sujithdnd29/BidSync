import { useState } from "react";
import { createAuction } from "../services/auctionService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CreateAuction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startingPrice: "",
    startTime: "",
    endTime: "",
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const handleImageChange = (e) => {
  const newImages = Array.from(e.target.files);

  setImages((prevImages) => {
    const allImages = [...prevImages, ...newImages];

    // Remove duplicate images (same name + size)
    return allImages.filter(
      (file, index, self) =>
        index ===
        self.findIndex(
          (f) => f.name === file.name && f.size === file.size
        )
    );
  });

  // Reset the input so selecting the same file again triggers onChange
  e.target.value = "";
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loading = toast.loading("Creating auction...");

    try {
      const auctionFormData = new FormData();

auctionFormData.append("title", formData.title);
auctionFormData.append("description", formData.description);
auctionFormData.append("category", formData.category);
auctionFormData.append("startingPrice", formData.startingPrice);
auctionFormData.append("startTime", formData.startTime);
auctionFormData.append("endTime", formData.endTime);

images.forEach((image) => {
    auctionFormData.append("images", image);
});

const data = await createAuction(auctionFormData);

       toast.dismiss(loading);

    toast.success("🚀 Auction Created!");
    setTimeout(() => {
    navigate(`/auction/${data.auction._id}`);
}, 700);

      

    } catch (error) {
      toast.dismiss(loading);

    toast.error(
        error.response?.data?.message ||
        "Failed to create auction."
    );

    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex justify-center py-10 px-4">

    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10">

      <h1 className="text-4xl font-bold text-gray-800">
        🚀 Create New Auction
      </h1>

      <p className="text-gray-500 mt-2 mb-8">
        List your item and start receiving bids from buyers.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Auction Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="MacBook Pro M2..."
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Description */}

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            rows="5"
            placeholder="Describe your item..."
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        {/* Category & Price */}

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Furniture">Home & Furniture</option>
              <option value="Books">Books</option>
              <option value="Sports">Sports</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Collectibles">Collectibles</option>
              <option value="Art">Art</option>
              <option value="Jewellery">Jewellery</option>
              <option value="Others">Others</option>
            </select>

          </div>

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              Starting Price (₹)
            </label>

            <input
              type="number"
              name="startingPrice"
              placeholder="1000"
              value={formData.startingPrice}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

        </div>

        {/* Date & Time */}

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              Start Time
            </label>

            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              End Time
            </label>

            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

        </div>

        {/* Images */}

        <div>

          <label className="block mb-2 font-semibold text-gray-700">
            Upload Auction Images
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-xl border border-dashed border-gray-300 p-4 file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
          />
          {images.length > 0 && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
    {images.map((image, index) => (
      <div
        key={index}
        className="relative rounded-xl overflow-hidden shadow-lg group"
      >
        <img
          src={URL.createObjectURL(image)}
          alt={`Preview ${index + 1}`}
          className="w-full h-36 object-cover"
        />

        <button
          type="button"
          onClick={() =>
            setImages((prev) => prev.filter((_, i) => i !== index))
          }
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}

        </div>

        {/* Submit */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition duration-300"
        >
          🚀 Create Auction
        </button>

      </form>

    </div>

  </div>
);
}

export default CreateAuction;