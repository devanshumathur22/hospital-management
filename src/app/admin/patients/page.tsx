"use client";

import { useEffect, useState } from "react";

export default function AdminPatients() {

  const [patients,setPatients] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const fetchPatients = async()=>{

      try{

        const res = await fetch("/api/patients");
        const data = await res.json();

        console.log("PATIENTS:",data);

        setPatients(data || []);

      }catch(err){

        console.log("Fetch error:",err);

      }

      setLoading(false);

    }

    fetchPatients();

  },[])


  const deletePatient = async(id:string)=>{

    if(!confirm("Delete this patient?")) return;

    await fetch(`/api/patients/${id}`,{
      method:"DELETE"
    })

    setPatients(prev =>
      prev.filter(p => p.id !== id)
    )

  }


  if(loading){
    return <p className="p-8">Loading patients...</p>
  }


  return(

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Patients
      </h1>

      <div className="bg-white shadow rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Age</th>
              <th className="p-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {patients.map((p:any)=>(

              <tr
              key={p.id}
              className="border-t hover:bg-gray-50"
              >

                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.email}</td>
                <td className="p-4">{p.phone}</td>
                <td className="p-4">{p.age}</td>

                <td className="p-4">

                  <button
                  onClick={()=>deletePatient(p.id)}
                  className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}