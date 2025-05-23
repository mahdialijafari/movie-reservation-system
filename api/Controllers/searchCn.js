import Movie from "../Models/movieMd.js";
import { catchAsync } from "vanta-api";

export const search=catchAsync(async(req,res,next)=>{
    const {query}=req.body
    const movies=await Movie.find({title:{$regex:query,$options:'i'}}).skip(0).limit(10)
    const genres = await Movie.find({genre: { $elemMatch: { $regex: query, $options: 'i' } },}).skip(0).limit(10);    
    return res.status(200).json({
        success:true,
        data:{
            movies,
            genres,
        }
    })
})