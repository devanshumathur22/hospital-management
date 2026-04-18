"use client"

import { useEffect, useState } from "react"
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  Trash2,
  Pencil
} from "lucide-react"

export default function AdminNurses(){

  const [nurses,setNurses] = useState<any[]>([])
  const [doctors,setDoctors] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [adding,setAdding] = useState(false)
  const [editingId,setEditingId] = useState<string | null>(null)

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    phone:"",
    department:"",
    experience:""
  })

  /* ================= LOAD ================= */

  useEffect(()=>{
    loadData()
  },[])

  const loadData = async () => {
    try{
      const n = await fetch("/api/nurses",{ credentials:"include" })
      const d = await fetch("/api/doctors",{ credentials:"include" })

      const nursesData = await n.json()
      const doctorsData = await d.json()

      const safeNurses = Array.isArray(nursesData)
        ? nursesData
        : nursesData?.data || []

      const safeDoctors = Array.isArray(doctorsData)
        ? doctorsData
        : doctorsData?.data || []

      setNurses(safeNurses)
      setDoctors(safeDoctors)

    }catch(err){
      console.log(err)
      setNurses([])
    }

    setLoading(false)
  }

  /* ================= ADD ================= */

  async function addNurse(){

    if(!form.name || !form.email || !form.password){
      alert("Name, email, password required")
      return
    }

    setAdding(true)

    const res = await fetch("/api/nurses",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        ...form,
        experience:Number(form.experience)
      })
    })

    const data = await res.json()

    setAdding(false)

    if(res.ok){
      await loadData()
      resetForm()
    }else{
      alert(data.error)
    }
  }

  /* ================= DELETE ================= */

  async function deleteNurse(id:string){

    if(!confirm("Delete nurse?")) return

    await fetch(`/api/nurses/${id}`,{
      method:"DELETE",
      credentials:"include"
    })

    await loadData()
  }

  /* ================= EDIT ================= */

  function startEdit(n:any){
    setEditingId(n.id)
    setForm({
      name:n.name || "",
      email:n.user?.email || "",
      password:"",
      phone:n.phone || "",
      department:n.department || "",
      experience:n.experience?.toString() || ""
    })
  }

  async function updateNurse(){

    const res = await fetch(`/api/nurses/${editingId}`,{
      method:"PATCH",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        ...form,
        experience:Number(form.experience)
      }),credentials:"include"
    })

    const data = await res.json()

    if(res.ok){
      await loadData()
      resetForm()
      setEditingId(null)
    }else{
      alert(data.error)
    }
  }

  /* ================= ASSIGN ================= */

  async function assignDoctor(nurseId:string,doctorId:string){

    await fetch("/api/admin/assign-nurse",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ nurseId, doctorId }),
      credentials:"include"
    })

    await loadData()
  }

  /* ================= RESET ================= */

  function resetForm(){
    setForm({
      name:"",
      email:"",
      password:"",
      phone:"",
      department:"",
      experience:""
    })
  }

  /* ================= UI ================= */

  if(loading){
    return <div className="p-10 text-center">Loading...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* FORM */}
      <div className="bg-white border rounded-xl p-6 space-y-5">

        <h1 className="text-xl font-semibold flex items-center gap-2">
          <UserPlus size={18}/>
          {editingId ? "Edit Nurse" : "Add Nurse"}
        </h1>

        <div className="grid sm:grid-cols-2 gap-4">

          <Input label="Name" value={form.name} onChange={(v)=>setForm({...form,name:v})}/>
          <Input label="Email" value={form.email} onChange={(v)=>setForm({...form,email:v})}/>
          {!editingId && (
            <Input label="Password" type="password" value={form.password} onChange={(v)=>setForm({...form,password:v})}/>
          )}
          <Input label="Phone" value={form.phone} onChange={(v)=>setForm({...form,phone:v})}/>
          <Input label="Department" value={form.department} onChange={(v)=>setForm({...form,department:v})}/>
          <Input label="Experience" value={form.experience} onChange={(v)=>setForm({...form,experience:v})}/>

        </div>

        <button
          onClick={editingId ? updateNurse : addNurse}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          {editingId ? "Update" : "Add"}
        </button>

      </div>

      {/* LIST */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {nurses.map((n:any)=>(

          <div key={n.id} className="bg-white border p-4 rounded-xl space-y-2">

            <p className="font-semibold">{n.name}</p>
            <p className="text-sm text-gray-500">{n.user?.email}</p>
            <p className="text-sm">Phone: {n.phone || "-"}</p>
            <p className="text-sm">Dept: {n.department || "-"}</p>

            <p className="text-sm">
              Doctor: {n.doctor?.name || "Not Assigned"}
            </p>

            {/* ASSIGN */}
            <select
              onChange={(e)=>assignDoctor(n.id,e.target.value)}
              className="border p-1 rounded text-sm w-full"
              defaultValue=""
            >
              <option value="">Assign Doctor</option>
              {doctors.map((d:any)=>(
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-2">

              <button
                onClick={()=>startEdit(n)}
                className="text-blue-600 text-sm flex items-center gap-1"
              >
                <Pencil size={14}/> Edit
              </button>

              <button
                onClick={()=>deleteNurse(n.id)}
                className="text-red-600 text-sm flex items-center gap-1"
              >
                <Trash2 size={14}/> Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}

/* INPUT */
function Input({label,value,onChange,type="text"}:any){
  return(
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full"
      />
    </div>
  )
}