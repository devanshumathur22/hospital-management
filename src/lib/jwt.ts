import jwt from "jsonwebtoken";

const SECRET = "hospital_secret_key";

export function generateToken(user:any){

return jwt.sign(user,SECRET,{
expiresIn:"7d"
})

}

export function verifyToken(token:string){

return jwt.verify(token,SECRET)

}