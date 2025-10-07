"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { useSession } from "next-auth/react";
export default function PurchaseRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [department, setDepartment] = useState("");
  const [remark, setRemark] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const { data: session, status } = useSession();

  async function fetchRequests() {
    let url = "/api/purchase-requests";
    const params = [];
    if (dateFilter) params.push(`date=${dateFilter}`);
    if (sortBy) params.push(`sort=${sortBy}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    const res = await fetch(url);
    const data = await res.json();
    setRequests(data);
  }

  useEffect(() => {
    fetchRequests();
  }, [dateFilter, sortBy]);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/purchase-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requester: session.user.email, // replace with logged-in user id
        department,
        remark,
      }),
    });
    if (res.ok) {
      setDepartment("");
      setRemark("");
      fetchRequests();
    }
  }

  async function approveRequest(id) {
    const res = await fetch("/api/purchase-requests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approver: "APPROVER_USER_ID" }),
    });
    if (res.ok) fetchRequests();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Requests</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-6 border p-4 rounded"
      >
        <input
          type="text"
          placeholder="Department"
          className="border p-2 w-full"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <textarea
          placeholder="Remark"
          className="border p-2 w-full"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Request
        </button>
      </form>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2"
        >
          <option value="">Sort By</option>
          <option value="name">Requester Name</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Request ID</th>
            <th className="border p-2">Requester</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Approved By</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td className="border p-2">{req._id.slice(-6)}</td>
              <td className="border p-2 text-blue-600">
                <Link
                  href={`/dashboard/inventory/purchase-requests/${req._id}`}
                >
                  {req.requester_email || "Unknown"}
                  {/* {console.log(req)} */}
                </Link>
              </td>
              <td className="border p-2">{req.department}</td>
              <td className="border p-2">
                {new Date(req.createdAt).toLocaleDateString()}
              </td>
              <td className="border p-2">{req.status}</td>
              <td className="border p-2">{req.approver?.name || "-"}</td>
              <td className="border p-2">
                {req.status === "Pending" && (
                  <button
                    onClick={() => approveRequest(req._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
