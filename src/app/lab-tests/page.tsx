import { labTests } from "@/data/labTests"

export default function LabTestsPage() {
  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Lab Tests
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {labTests.map((test, i) => (
          <div
            key={i}
            className="border p-6 rounded-lg space-y-3"
          >
            <h2 className="font-semibold text-lg">
              {test.name}
            </h2>

            <p>{test.description}</p>

            <p>Price: ₹{test.price}</p>

            <p>Report: {test.reportTime}</p>

            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Book Test
            </button>

          </div>
        ))}

      </div>

    </div>
  )
}