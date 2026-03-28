"use client"

import { useState } from "react";

export default function PrivacyData() {
    const [settings, setSettings] = useState({
        dataSharing: true,
        emailNotifications: true
    })
    return (
        <div className="max-w-2xl space-y-6">

            <h1 className="text-2xl font-semibold">Privacy & Data</h1>

            <div className="bg-white rounded-xl shadow divide-y">

                <div className="p-4 flex justify-between items-center">

                    <span>Data Sharing</span>

                    <input
                        type="checkbox"
                        checked={settings.dataSharing}
                        onChange={() => setSettings({
                            ...settings,
                            dataSharing: !settings.dataSharing
                        })}
                    />

                </div>

                <div className="p-4 flex justify-between">
                    <span>Privacy Center</span>
                    <button className="text-gray-500">Open</button>
                </div>

                <div className="p-4 flex justify-between">
                    <span>Communication Preferences</span>
                    <button className="text-gray-500">Manage</button>
                </div>

                <div className="p-4 flex justify-between">
                    <span>Third Party Apps</span>
                    <button className="text-gray-500">View</button>
                </div>

            </div>

        </div>
    );
}