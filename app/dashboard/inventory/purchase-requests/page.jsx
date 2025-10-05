"use client";
import { useEffect, useState } from "react";

export default function PurchaseRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    fetch("/api/purchase-requests")
      .then((res) => res.json())
      .then(setRequests);
  }, []);

  const createRequest = async () => {
    if (!remark) return alert("Enter a remark");
    const res = await fetch("/api/purchase-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remark }),
    });
    const data = await res.json();
    setRequests([data, ...requests]);
    setRemark("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Requests</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <button
          onClick={createRequest}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Request
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Remark</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r._id}>
              <td className="p-2 border">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2 border">{r.remark}</td>
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    r.status === "Approved"
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {r.status}
                </span>
              </td>
              <td className="p-2 border">
                <a
                  href={`/dashboard/inventory/purchase-requests/${r._id}`}
                  className="text-blue-600 underline"
                >
                  Open
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
