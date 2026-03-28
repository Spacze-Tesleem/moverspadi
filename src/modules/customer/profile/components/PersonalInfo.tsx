"use client"

import { useState } from "react"

export default function PersonalInfo() {

    const [editing, setEditing] = useState(false)

    const [user, setUser] = useState({
        name: "Tesleem",
        email: "seidutesleem06@gmail.com",
        phone: ""
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    return (

        <div className="max-w-2xl space-y-8">

            <h1 className="text-2xl font-semibold">Personal Information</h1>

            <div className="bg-white p-6 rounded-xl shadow space-y-6">

                <div>
                    <label className="text-sm text-gray-500">Name</label>

                    <input
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full mt-1 border rounded-lg p-2"
                    />

                </div>

                <div>
                    <label className="text-sm text-gray-500">Email</label>

                    <input
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full mt-1 border rounded-lg p-2"
                    />

                </div>

                <div>
                    <label className="text-sm text-gray-500">Phone</label>

                    <input
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="+234..."
                        className="w-full mt-1 border rounded-lg p-2"
                    />

                </div>

                <div className="flex gap-3">

                    {!editing ? (

                        <button
                            onClick={() => setEditing(true)}
                            className="bg-black text-white px-5 py-2 rounded-lg"
                        >
                            Edit
                        </button>

                    ) : (

                        <>
                            <button
                                onClick={() => setEditing(false)}
                                className="bg-green-600 text-white px-5 py-2 rounded-lg"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setEditing(false)}
                                className="border px-5 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </>

                    )}

                </div>

            </div>

        </div>

    )
}   