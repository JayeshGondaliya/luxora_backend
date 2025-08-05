import  argon2  from "argon2"

export const hashing=async(password)=>{
    return await argon2.hash(password)
}

export const verifyPassword=async(hasedPassword,password)=>{
    return await argon2.verify(hasedPassword,password);
}