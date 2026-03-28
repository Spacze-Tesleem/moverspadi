export default function Security() {
  return (
    <div className="max-w-2xl space-y-6">

      <h1 className="text-2xl font-semibold">Security</h1>

      <div className="bg-white rounded-xl shadow divide-y">

        <div className="p-4 flex justify-between">
          <span>Password</span>
          <button className="text-gray-500">Edit</button>
        </div>

        <div className="p-4 flex justify-between">
          <span>Authenticator App</span>
          <button className="text-gray-500">Setup</button>
        </div>

        <div className="p-4 flex justify-between">
          <span>2-Step Verification</span>
          <button className="text-gray-500">Enable</button>
        </div>

        <div className="p-4 flex justify-between">
          <span>Recovery Phone</span>
          <button className="text-gray-500">Add</button>
        </div>

      </div>

    </div>
  );
}