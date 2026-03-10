"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Stethoscope,
  Briefcase,
  Heart,
  Brain,
  Bone,
  Sparkles,
  Smile,
  Baby,
  Activity,
  Scan
} from "lucide-react";

const specializations = [
  { name: "Cardiologist", icon: Heart },
  { name: "Neurologist", icon: Brain },
  { name: "Orthopedic", icon: Bone },
  { name: "Dermatologist", icon: Sparkles },
  { name: "Dentist", icon: Smile },
  { name: "Pediatrician", icon: Baby },
  { name: "Psychiatrist", icon: Activity },
  { name: "Radiologist", icon: Scan }
];

export default function AddDoctor() {

  const [loading,setLoading] = useState(false)

  const [form,setForm] = useState({
    name:"",
    specialization:"",
    experience:""
  });

  const [suggestions,setSuggestions] = useState<any[]>([]);

  const handleSpecialization = (value:string)=>{

    setForm({...form,specialization:value});

    const filtered = specializations.filter((item)=>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered);
  };

  const handleSubmit = async (e:any)=>{
    e.preventDefault();

    setLoading(true)

    await fetch("/api/doctors",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(form)
    });

    setLoading(false)

    alert("Doctor Added Successfully")

    setForm({
      name:"",
      specialization:"",
      experience:""
    });

    setSuggestions([]);
  };

  return(

    <div className="p-10 flex justify-center bg-gray-50 min-h-screen">

      <motion.div
        initial={{opacity:0, y:30}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.4}}
        className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 border"
      >

        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Stethoscope size={22}/> Add Doctor
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Doctor Name */}

          <div>

            <label className="text-sm text-gray-500">
              Doctor Name
            </label>

            <div className="relative mt-1">

              <User
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                value={form.name}
                onChange={(e)=>
                  setForm({...form,name:e.target.value})
                }
                placeholder="Dr. John Smith"
                className="w-full border rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

          </div>

          {/* Specialization */}

          <div className="relative">

            <label className="text-sm text-gray-500">
              Specialization
            </label>

            <div className="relative mt-1">

              <Stethoscope
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                value={form.specialization}
                onChange={(e)=>
                  handleSpecialization(e.target.value)
                }
                placeholder="Cardiologist"
                className="w-full border rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <AnimatePresence>

            {suggestions.length > 0 && (

              <motion.div
                initial={{opacity:0, y:-10}}
                animate={{opacity:1, y:0}}
                exit={{opacity:0}}
                className="absolute w-full bg-white border rounded-lg shadow mt-1 z-10"
              >

                {suggestions.map((item,i)=>{

                  const Icon = item.icon

                  return(
                    <div
                      key={i}
                      onClick={()=>{
                        setForm({...form,specialization:item.name})
                        setSuggestions([])
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer"
                    >

                      <Icon size={18} className="text-blue-500"/>

                      {item.name}

                    </div>
                  )
                })}

              </motion.div>

            )}

            </AnimatePresence>

          </div>

          {/* Experience */}

          <div>

            <label className="text-sm text-gray-500">
              Experience
            </label>

            <div className="relative mt-1">

              <Briefcase
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                value={form.experience}
                onChange={(e)=>
                  setForm({...form,experience:e.target.value})
                }
                placeholder="10 years"
                className="w-full border rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

          </div>

          {/* Button */}

          <motion.button
            whileTap={{scale:0.95}}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            {loading ? "Adding..." : "Add Doctor"}
          </motion.button>

        </form>

      </motion.div>

    </div>

  );
}