"use client";

import { useState } from "react";

export default function ProfileHome() {

  const [avatar, setAvatar] = useState<string | null>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  }

  return (
    <div className="max-w-3xl mx-auto">

      <div className="text-center mb-10">

        <label className="cursor-pointer">

          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">

            {avatar && (
              <img
                src={avatar}
                className="w-full h-full object-cover"
              />
            )}

          </div>

          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
          />

        </label>

        <h2 className="text-2xl font-semibold">Tesleem</h2>
        <p className="text-gray-500">seidutesleem06@gmail.com</p>

      </div>

    </div>
  );
}