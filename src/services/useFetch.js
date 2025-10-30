import React, {useState, useEffect} from "react";
import { Cookies } from "react-cookie";

const cookies = new Cookies();


const useFetch =(url)=>{
    const API_URL = 'http://127.0.0.1:8000/api'
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( ()=>{
        const fetchData =async()=>{
            setLoading(false);
            setError(null);

            await new Promise(resolve => setTimeout(resolve,3000))


            try{
                const response= await fetch(`${API_URL}${url}`,{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Token ${cookies.get("mr-token")}`
                    }
                
                });
                console.log(response,'response---fetchmovies----------------------')
                if(!response.ok){
                  throw new Error('Error getting data.')

                }
                const result = await response.json()
                setData(result);
               
            }catch (err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        }
        fetchData();

    }, [url]);
    
    return {data, loading, error};

}
export default useFetch;