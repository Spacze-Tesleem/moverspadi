"use client";

import { useState } from "react";
import ProfileHome from "@/src/modules/customer/components/profile/ProfileHome";
import PersonalInfo from "@/src/modules/customer/components/profile/PersonalInfo";
import Security from "@/src/modules/customer/components/profile/Security";
import PrivacyData from "@/src/modules/customer/components/profile/PrivacyData";


export default function ProfileView() {
    const [activeTab, setActiveTab] = useState("home");

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar */}
            <div className="w-64 bg-white border-r p-6 space-y-4">

                <button
                    onClick={() => setActiveTab("home")}
                    className={`block w-full text-left p-3 rounded-lg ${activeTab === "home" ? "bg-gray-100 font-semibold" : ""
                        }`}
                >
                    Home
                </button>

                <button
                    onClick={() => setActiveTab("personal")}
                    className={`block w-full text-left p-3 rounded-lg ${activeTab === "personal" ? "bg-gray-100 font-semibold" : ""
                        }`}
                >
                    Personal Info
                </button>

                <button
                    onClick={() => setActiveTab("security")}
                    className={`block w-full text-left p-3 rounded-lg ${activeTab === "security" ? "bg-gray-100 font-semibold" : ""
                        }`}
                >
                    Security
                </button>

                <button
                    onClick={() => setActiveTab("privacy")}
                    className={`block w-full text-left p-3 rounded-lg ${activeTab === "privacy" ? "bg-gray-100 font-semibold" : ""
                        }`}
                >
                    Privacy & Data
                </button>

            </div>

            {/* Content */}
            <div className="flex-1 p-10">

                {activeTab === "home" && <ProfileHome />}
                {activeTab === "personal" && <PersonalInfo />}
                {activeTab === "security" && <Security />}
                {activeTab === "privacy" && <PrivacyData />}

            </div>
        </div>
    );
}