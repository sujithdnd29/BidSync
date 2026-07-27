import { useState } from "react";
import { createAuction } from "../services/auctionService";

function CreateAuction() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startingPrice: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createAuction(formData);

      alert(data.message);

      console.log(data);

    } catch (error) {
      alert(error.response?.data?.message || "Failed to create auction");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <h1>Create Auction</h1>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
      />

      <br /><br />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <br /><br />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
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

      <br /><br />

      <input
        type="number"
        name="startingPrice"
        placeholder="Starting Price"
        value={formData.startingPrice}
        onChange={handleChange}
      />

      <br /><br />

      <label>Start Time</label>
      <br />

      <input
        type="datetime-local"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
      />

      <br /><br />

      <label>End Time</label>
      <br />

      <input
        type="datetime-local"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit">
        Create Auction
      </button>

    </form>
  );
}

export default CreateAuction;