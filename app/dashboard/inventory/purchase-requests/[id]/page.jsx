"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function RequestDetailsPage() {
  const params = useParams();
  const [request, setRequest] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetch(`/api/purchase-requests/${params.id}`)
      .then((res) => res.json())
      .then(setRequest);

    fetch("/api/items")
      .then((res) => res.json())
      .then(setItems);
  }, [params.id]);

  const addItem = async () => {
    if (!selectedItem || !quantity) return alert("Select item & quantity");
    const res = await fetch(`/api/purchase-requests/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: selectedItem, quantity }),
    });
    const data = await res.json();
    setRequest(data);
    setSelectedItem("");
    setQuantity("");
  };

  const approveRequest = async () => {
    const res = await fetch(`/api/purchase-requests/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    });
    const data = await res.json();
    setRequest(data);
  };

  if (!request) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Request</h1>

      <p>
        <strong>Remark:</strong> {request.remark}
      </p>
      <p>
        <strong>Status:</strong> {request.status}
      </p>

      {request.status === "Pending" && (
        <div className="my-4 flex gap-2">
          <select
            className="border p-2 rounded w-1/2"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name} ({i.unit})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            className="border p-2 rounded w-1/4"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button
            onClick={addItem}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      )}

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Item</th>
            <th className="p-2 border">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {request.items.map((it, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{it.item?.name}</td>
              <td className="p-2 border">{it.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {request.status === "Pending" && (
        <button
          onClick={approveRequest}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Approve Request
        </button>
      )}
    </div>
  );
}
