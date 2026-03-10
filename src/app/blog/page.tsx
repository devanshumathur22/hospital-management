"use client"

import { motion } from "framer-motion"

const blogs = [

{
title:"Heart Health Tips",
img:"https://images.unsplash.com/photo-1576091160550-2173dba999ef",
date:"Jan 10 2026"
},

{
title:"Benefits of Daily Exercise",
img:"https://images.unsplash.com/photo-1579154204601-01588f351e67",
date:"Jan 12 2026"
},

{
title:"Healthy Diet for Patients",
img:"https://images.unsplash.com/photo-1498837167922-ddd27525d352",
date:"Jan 14 2026"
},

{
title:"Managing Stress for Better Health",
img:"https://images.unsplash.com/photo-1506126613408-eca07ce68773",
date:"Jan 18 2026"
},

{
title:"Importance of Regular Checkups",
img:"https://images.unsplash.com/photo-1580281657527-47d6c14e7b7c",
date:"Jan 20 2026"
},

{
title:"How to Boost Immunity",
img:"https://images.unsplash.com/photo-1510626176961-4b37d2ce2b1f",
date:"Jan 23 2026"
},

{
title:"Best Foods for Heart",
img:"https://images.unsplash.com/photo-1505576399279-565b52d4ac71",
date:"Jan 25 2026"
},

{
title:"Sleep and Health Connection",
img:"https://images.unsplash.com/photo-1541781774459-bb2af2f05b55",
date:"Jan 27 2026"
},

{
title:"Tips for Healthy Lifestyle",
img:"https://images.unsplash.com/photo-1490645935967-10de6ba17061",
date:"Jan 30 2026"
},

{
title:"Mental Health Awareness",
img:"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
date:"Feb 2 2026"
},

{
title:"Preventing Common Diseases",
img:"https://images.unsplash.com/photo-1581595219315-a187dd40c322",
date:"Feb 4 2026"
},

{
title:"Importance of Hydration",
img:"https://images.unsplash.com/photo-1502741338009-cac2772e18bc",
date:"Feb 6 2026"
}

]

export default function Blog(){

  return(

    <div className="py-20 px-6 bg-gradient-to-b from-white to-blue-50">

      <h1 className="text-4xl font-bold text-center mb-16 text-blue-600">
        Health Blog
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">

        {blogs.map((blog,i)=>(

          <motion.div
            key={i}
            whileHover={{y:-10,scale:1.03}}
            className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
          >

            <div className="overflow-hidden">

              <img
                src={blog.img}
                className="h-48 w-full object-cover group-hover:scale-110 transition duration-500"
              />

            </div>

            <div className="p-5">

              <p className="text-sm text-gray-400 mb-2">
                {blog.date}
              </p>

              <h3 className="text-lg font-semibold mb-3">
                {blog.title}
              </h3>

              <button className="text-blue-600 text-sm font-medium hover:underline">
                Read More →
              </button>

            </div>

          </motion.div>

        ))}

      </div>

    </div>
  )
}