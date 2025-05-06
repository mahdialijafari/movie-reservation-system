const fetchData=async (url,option={}) => {
    try {
        const res=await fetch('http://localhost:5005/api/'+url,option)
        const data=await res.json()
        return data
    } catch (error) {
        return {success:false,message:'Connection Lost'}
    }
}
export default fetchData