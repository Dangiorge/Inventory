"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function PurchaseRequestDetails() {
  const { id } = useParams();

  const [mockRequest, setMockRequest] = useState();

  // // Mock inventory list
  // const inventory = [
  //   { _id: "ITEM001", name: "Ambu Bag Child", unit: "Each" },
  //   { _id: "ITEM002", name: "Rectal Catheter 28G", unit: "Each" },
  //   { _id: "ITEM003", name: "Suction Catheter FG-12", unit: "Each" },
  //   { _id: "ITEM004", name: "Syringe 10ml", unit: "Each" },
  // ];

  const [request, setRequest] = useState(null);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [inventory, setInventory] = useState(null);
  const [categories, setCategories] = useState(null);

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/purchase-requests/${id}`);
      const data = await res.json();
      console.log(data);
      setRequest(data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      console.log(data);
      setInventory(data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchCategories = async () => {
    const res = await fetch("/api/categories/sort");
    const data = await res.json();
    setCategories(data);
  };

  // Simulate API fetch
  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchRequest();
  }, []);

  // Add item to the request
  const addItem = () => {
    if (!selectedItem || quantity < 1) return;

    const itemData = inventory.find((i) => i._id === selectedItem);
    if (!itemData) return;

    const newItem = { ...itemData, quantity };

    setRequest((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setSelectedItem("");
    setQuantity(1);
  };

  if (!request && !inventory) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Request Info */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-bold mb-2">
          Purchase Request #{request._id.slice(-6)}
        </h2>
        <p>
          <strong>Requester:</strong> {request.requester.name} (
          {request.requester.email})
        </p>
        <p>
          <strong>Department:</strong> {request.department}
        </p>
        <p>
          <strong>Remark:</strong> {request.remark}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded text-sm ${
              request.status === "Approved"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {request.status}
          </span>
        </p>
      </div>

      {/* Add Items */}
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3">Add Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="">-- Select Item --</option>
            {/* {inventory.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} ({item.unit})
              </option>
            ))} */}
          </select>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-md p-2"
            placeholder="Quantity"
          />
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white shadow rounded-xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Code</th>
              <th className="p-2 text-left">Item Name</th>
              <th className="p-2 text-left">Unit</th>
              <th className="p-2 text-left">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {request.items.length > 0 ? (
              request.items.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{item._id}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.unit}</td>
                  <td className="p-2">{item.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 text-center" colSpan={4}>
                  No items added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
