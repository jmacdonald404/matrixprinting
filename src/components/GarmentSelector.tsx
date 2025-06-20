export default function GarmentSelector() {
    return (
      <div>
        <label className="block mb-1 font-semibold">Choose a Garment</label>
        <select className="w-full border p-2 rounded">
          <option value="tshirt">T-Shirt</option>
          <option value="hoodie">Hoodie</option>
          <option value="hat">Hat</option>
        </select>
      </div>
    )
  }
  