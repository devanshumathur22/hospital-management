import { labTests } from "@/data/labTests"

export default function TestPage({ params }: { params: { slug: string } }) {

const test = labTests.find(t => t.slug === params.slug)

if (!test) {
return <div>Test not found</div>
}

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
{test.name}
</h1>

<p className="mb-4">
{test.description}
</p>

<p>Price: ₹{test.price}</p>
<p>Report Time: {test.reportTime}</p>

<button className="mt-6 bg-green-600 text-white px-6 py-2 rounded">
Book Test
</button>

</div>

)

}