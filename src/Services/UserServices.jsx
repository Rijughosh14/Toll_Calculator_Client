import axios from 'axios'



//return the address based on the marker point
export const getAddressBycoOrdinates=async({lat,lng})=>{

    const params={
        apiKey:import.meta.env.VITE_HERE_API_KEY,
        at:`${lat},${lng}`,
        types:'street'

    }
    try {       
        const response=await axios.get('https://revgeocode.search.hereapi.com/v1/revgeocode',{params:params})
        return(response.data.items)
    } catch (error) {
        console.log(error)
    }
}


//return suggestions on address query search
export const getAddressBySearch=async(value)=>{

    const params={
        apiKey:import.meta.env.VITE_HERE_API_KEY,
        q:value,
        at: '22.3511,78.6677',
        country: 'IND'

    }
    try {       
        const response=await axios.get('https://autosuggest.search.hereapi.com/v1/autosuggest',{params:params})
        return(response.data.items)
    } catch (error) {
        console.log(error)
    }
}

//return the routes 
export const getRoute=async(originMarker,destinationMarker,selectedVehicle)=> {
    const params={
        apiKey:import.meta.env.VITE_HERE_API_KEY,
        transportMode:selectedVehicle[0].value,
        origin: `${originMarker.lat},${originMarker.lng}`,
        destination: `${destinationMarker.lat},${destinationMarker.lng}`,
        alternatives:2,
        return:'polyline,actions,instructions'
    }
  try {

    // First server call to HERE for routes polylines
    const firstResponse = await axios.get('https://router.hereapi.com/v8/routes',{params:params});
    const firstData = firstResponse.data.routes;

    // Perform multiple Axios calls based on each item in the array
    if (Array.isArray(firstData)) {

        const secondDataPromises = firstData.map(async item => {
            const options={
                polyline:item.sections[0].polyline,
                vehicle:{
                    'type':selectedVehicle[0].vehicleType
                }
            }
            // Assuming each item has an ID or parameter required for the second call
            const secondResponse = await axios.post(`/getroutes`,options);
            return secondResponse.data;
          });
          // Wait for all second API calls to complete
          const secondResponses = await Promise.all(secondDataPromises);
          return(secondResponses)
    }

  } catch (error) {
    // Handle any errors
    console.error('Error:', error);
    return { error: error.message };
  }
}
