const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', tour: 'Jeju Island Adventure' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', tour: 'Seoul City Exploration' },
  { id: 3, name: 'Peter Jones', email: 'peter@example.com', phone: '345-678-9012', tour: 'Jeju Island Adventure' },
  { id: 4, name: 'Susan Lee', email: 'susan@example.com', phone: '456-789-0123', tour: 'Busan Beach Tour' },
];

export default function CustomersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          + Add New Customer
        </button>
      </div>
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Assigned Tour</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b">
                <td className="px-4 py-2">{customer.name}</td>
                <td className="px-4 py-2">{customer.email}</td>
                <td className="px-4 py-2">{customer.phone}</td>
                <td className="px-4 py-2">{customer.tour}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-500 hover:underline mr-2">Edit</button>
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
