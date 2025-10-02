"use client";
import { useState, useEffect } from "react";

export default function PurchaseRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState(1);

  const fetchRequests = async () => {
    const res = await fetch("/api/purchase-requests");
    const data = await res.json();
    setRequests(data);
  };

  const fetchItems = async () => {
    const res = await fetch(`/api/items?search=${search}`);
    const data = await res.json();
    setItems(data.items || []);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [search]);

  const createRequest = async () => {
    const res = await fetch("/api/purchase-requests", {
      method: "POST",
      body: JSON.stringify({ requester: "USER_ID" }), // replace with session id
    });
    const data = await res.json();
    setRequests([...requests, data]);
  };

  const addItem = async (itemId) => {
    if (!selectedRequest) return;
    await fetch(`/api/purchase-requests/${selectedRequest._id}`, {
      method: "PUT",
      body: JSON.stringify({
        items: [...selectedRequest.items, { item: itemId, quantity }],
      }),
    });
    fetchRequests();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Purchase Requests</h1>

      {/* Create Request */}
      <button
        onClick={createRequest}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        New Purchase Request
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Requests List */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">My Requests</h2>
          <ul className="space-y-2">
            {requests.map((req) => (
              <li
                key={req?._id || Math.random()}
                onClick={() => setSelectedRequest(req)}
                className={`p-3 border rounded cursor-pointer hover:bg-gray-100 ${
                  selectedRequest?._id === req?._id ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex justify-between">
                  <span>
                    Request #{req?._id ? req._id.slice(-5) : "Draft"} –{" "}
                    {req?.status || "Unknown"}
                  </span>
                  <span>
                    {req?.createdAt
                      ? new Date(req.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Items Search & Add */}
        {selectedRequest && (
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-semibold mb-4">
              Add Items to Request #
              {selectedRequest?._id ? selectedRequest._id.slice(-5) : "—"}
            </h2>
            {selectedRequest.status === "Approved" ? (
              <p className="text-red-600">
                This request has been approved. You cannot add more items.
              </p>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border p-2 w-full rounded mb-4"
                />
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <li
                      key={item._id}
                      className="p-3 border rounded flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.sku}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="w-16 border rounded p-1"
                        />
                        <button
                          onClick={() => addItem(item._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Add
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
