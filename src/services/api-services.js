import { Cookies } from "react-cookie";
const API_URL = 'http://127.0.0.1:8000/api'
// const Token = 'b2f59748a0c30c3762e91c2003c612b2ce3fba10'


const cookies = new Cookies();


export default class API{

    static async loginUser(body){
        
        const response= await fetch(`http://127.0.0.1:8000/auth/`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(body),
            
        });
        console.log(response,'response---fetchmovies----------------------')
        if(!response.ok){
            return null;

        }
        return await response.json();
     
    }

    static async registerUser(body){
        
        const response= await fetch(`${API_URL}/users/`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(body),
            
        });
        console.log(response,'response---fetchmovies----------------------')
        if(!response.ok){
            return null;

        }
        return await response.json();
     
    }


    static async fetchMovies(){
        
        const response= await fetch(`${API_URL}/movies/`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Token ${cookies.get("mr-token")}`
            }
            
        });
        console.log(response,'response---fetchmovies----------------------')
        if(!response.ok){
            return null;

        }
        return await response.json();
     
    }

    static async getMovie(movie_id){
        
        const response= await fetch(`${API_URL}/movies/${movie_id}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Token ${cookies.get("mr-token")}`
            }
            
        });
        console.log(response,'response---fetchmovies----------------------')
        if(!response.ok){
            return null;

        }
        return await response.json();
     
    }

    static async rateMovie(movie_id, body){
        
        const response= await fetch(`${API_URL}/movies/${movie_id}/rate_movie/`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Token ${cookies.get("mr-token")}`
            },
            body: JSON.stringify(body),
            
        });
        console.log(response,'response---fetchmovies----------------------')
        if(!response.ok){
            return null;

        }
        return await response.json();
     
    }


    // static async updateMovie(movie_id, body){
        
    //     const response= await fetch(`${API_URL}/movies/${movie_id}/`,{
    //         method:"PUT",
    //         headers:{
    //             "Content-Type":"application/json",
    //             "Authorization":`Token ${cookies.get("mr-token")}`
    //         },
    //         body: JSON.stringify(body),
            
    //     });
    //     console.log(response,'response---rating----------------------')
    //     if(!response.ok){
    //         return null;

    //     }
    //     return await response.json();
     
    // }

    // 🟡 Update movie
    static async updateMovie(movieId, formData) {
        const token = cookies.get("mr-token");

        const response = await fetch(`${API_URL}/movies/${movieId}/`, {
            method: "PUT",
            headers: {
                "Authorization": `Token ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Update Movie Error:", response.status, errorText);
            return null;
        }

        return await response.json();
    }

    // 🟢 Create movie (with image/trailer support)
    static async createMovie(formData) {
        const token = cookies.get("mr-token");

        const response = await fetch(`${API_URL}/movies/`, {
        method: "POST",
        headers: {
            "Authorization": `Token ${cookies.get("mr-token")}`,
            // ❌ DO NOT set "Content-Type" for FormData
        },
        body: formData,
        });

        if (!response.ok) {
        const errorText = await response.text();
        console.error("Create Movie Error:", response.status, errorText);
        return null;
        }

        return await response.json();
    }
    static async removeMovie(movie_id){
        
        const response= await fetch(`${API_URL}/movies/${movie_id}/`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Token ${cookies.get("mr-token")}`
            },
            
        });
        console.log(response,'response---rating----------------------')
        if(!response.ok){
            return false;

        }
        return true;
     
    }
}