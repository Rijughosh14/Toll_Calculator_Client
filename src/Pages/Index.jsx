import React from 'react'
import { useCallback } from 'react'
import { useState } from 'react'
import { Options } from '../Options/Options'
import { getAddressBySearch, getRoute } from '../Services/UserServices'
import MapComponent from './components/MapComponent'



const Index = () => {

    const [Origin, OriginSet] = useState('')
    const [Destination, DestinationSet] = useState('')
    const [originMarker, SetoriginMarker] = useState(null)
    const [destinationMarker, SetdestinationMarker] = useState(null)
    const [OriginOptions, SetOriginOptions] = useState([])
    const [DestinationOptions, SetDestinationOptions] = useState([])
    const [Vehicle, setVehicle] = useState('')
    const [selectedVehicle, setSelectedVehicle] = useState('')
    const [selectedVehicleType, setSelectedVehicleType] = useState('')
    const [PolylineDetails, SetPolylineDetails] = useState()
    const [ActiveTollDetails, SetActiveTollDetails] = useState('')
    const [Bounds, setBounds] = useState([])


    //toggle between the origin and destination input as well as on marker
    const [toggle, setToggle] = useState(true)


    //origin location coming from marker position
    const setOrigin = useCallback((value, position) => {
        OriginSet(value)
        SetoriginMarker(position)
        SetOriginOptions([])
    }, [Origin])

    //destination location coming from marker position
    const setDestination = useCallback((value, position) => {
        DestinationSet(value)
        SetdestinationMarker(position)
        SetDestinationOptions([])
    }, [Destination])

    //handling the input and returning the required location
    const HandleOriginChange = useCallback(async (value) => {
        OriginSet(value)
        if (value !== ' ' && value !== '') {
            const response = await getAddressBySearch(value)
            SetOriginOptions(response)
        }
    }, [Origin, OriginOptions])


    //handling the input and returning the required location
    const HandleDestinationChange = useCallback(async (value) => {
        DestinationSet(value)
        if (value !== ' ' && value !== '') {
            const response = await getAddressBySearch(value)
            SetDestinationOptions(response)
        }
    }, [Destination, DestinationOptions])

    //handling the selected origin location
    const SelectedOriginLocation = useCallback((value, position) => {
        setOrigin(value)
        SetoriginMarker(position)
        SetOriginOptions([])
    }, [originMarker])

    //handling the selected origin location
    const SelectedDestinationLocation = useCallback((value, position) => {
        setDestination(value)
        SetdestinationMarker(position)
        SetDestinationOptions([])
    }, [destinationMarker])

    //handling the selected vehicle
    const selectVehicle = (e) => {
        const filter = Options.filter((data) => data.Description === e.target.value)
        setSelectedVehicle(filter)
        setVehicle(e.target.value)
    }


    //handling the selected truck vehicle axle
    const selectTruckAxle = (e) => {
        setSelectedVehicle([{ ...selectedVehicle[0], vehicleType: e.target.value }])
        setSelectedVehicleType(e.target.value)

    }

    //handling the submit function
    const SubmitJourneyDetails = async (e) => {
        e.preventDefault();
        if (Origin === '' || Destination === '' || (Vehicle === '' && selectedVehicleType === '')) return
        const response = await getRoute(originMarker, destinationMarker, selectedVehicle)
        SetPolylineDetails(response)
        setBounds([[originMarker.lat,originMarker.lng],[destinationMarker.lat,destinationMarker.lng]])
    }

    //handling the active toll details to view on the map
    const HandleActiveTollDetails=(number)=>{
        SetActiveTollDetails(number)
    }

    return (
        <>
            <div className="min-w-screen bg-gray-900 min-h-screen flex items-center justify-center px-10 py-10">
                <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
                    <div className="md:flex w-full">
                        <div id={'TollMap'} className='w-1/2 h-full border border-red-200'>
                            <MapComponent toggle={toggle} setOrigin={setOrigin} setDestination={setDestination} originMarker={originMarker} destinationMarker={destinationMarker} PolylineDetails={PolylineDetails} ActiveTollDetails={ActiveTollDetails} Bounds={Bounds} />
                        </div>
                        <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                            <div className="text-center mb-10">
                                <h1 className="font-bold text-3xl text-gray-900">TOLL CALCULATOR</h1>
                                <p>Enter your information to calculate</p>
                            </div>
                            <div>
                                <div className="flex -mx-3">
                                    <div className="w-1/2 px-3 mb-5">
                                        <label htmlFor="" className="text-xs font-semibold px-1">Origin</label>
                                        <div className="flex flex-col relative">
                                            <input type="text" className="w-full  ml-2 pl-1  pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" value={Origin} placeholder="Search,Click on the map " onClick={() => setToggle(true)}
                                                onChange={(e) => HandleOriginChange(e.target.value)} />
                                            {(OriginOptions && OriginOptions.length > 0&&toggle===true) &&
                                                <div className=' z-10 w-full ml-2 pl-1 h-32 flex overflow-auto  pr-3 py-2 rounded-lg border-2 bg-white border-gray-200 outline-none absolute top-11'>
                                                    <ul className=''>
                                                        {
                                                            OriginOptions.map((data, index) => {
                                                                return (
                                                                    <li key={index} className='hover:cursor-pointer  border-b border-gray-200' onClick={() => SelectedOriginLocation(data.title, data.position)}>
                                                                        {data.title}
                                                                    </li>
                                                                )
                                                            })
                                                        }

                                                    </ul>
                                                </div>}
                                        </div>
                                    </div>
                                    <div className="w-1/2 px-3 mb-5">
                                        <label htmlFor="" className="text-xs font-semibold px-1">Destination</label>
                                        <div className="flex flex-col relative">
                                            <input type="text" className="w-full ml-2 pl-1 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" value={Destination} placeholder="Search,Click on the map" onClick={() => setToggle(false)} onChange={(e) => HandleDestinationChange(e.target.value)} />
                                            {(DestinationOptions && DestinationOptions.length > 0&&toggle===false) &&
                                                <div className=' z-10 w-full ml-2 pl-1 h-32 flex overflow-auto  pr-3 py-2 rounded-lg border-2 bg-white border-gray-200 outline-none absolute top-11'>
                                                    <ul className=''>
                                                        {
                                                            DestinationOptions.map((data, index) => {
                                                                return (
                                                                    <li key={index} className='hover:cursor-pointer  border-b border-gray-200' onClick={() => SelectedDestinationLocation(data.title, data.position)}>
                                                                        {data.title}
                                                                    </li>
                                                                )
                                                            })
                                                        }

                                                    </ul>
                                                </div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row -mx-3">
                                    <div className="w-1/2 px-3 mb-5">
                                        <label htmlFor="" className="text-xs font-semibold px-1">Choose vehicle</label>
                                        <div className="flex">
                                            <select className="w-full ml-2 pl-1 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" value={Vehicle} onChange={selectVehicle}>
                                                <option value=''>Select vehicle</option>
                                                {
                                                    Options.map((data, index) => {
                                                        return (
                                                            <option key={index} value={data.Description}>{data.Description}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    {(selectedVehicle && selectedVehicle[0].Description === 'truck') && <div className="w-1/2 px-3 mb-5">
                                        <label htmlFor="" className="text-xs font-semibold px-1">Choose Axles</label>
                                        <div className="flex">
                                            <select className="w-full ml-2 pl-1 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" value={selectedVehicleType} onChange={selectTruckAxle}>
                                                <option value=''>select Axle</option>
                                                {
                                                    Options[2].vehicleType.map((data, index) => {
                                                        return (
                                                            <option key={index} value={data}>{data}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>}
                                </div>
                                <div className="flex -mx-3">
                                    <div className="w-full px-3 mb-12">
                                        {(PolylineDetails && PolylineDetails.length > 0) &&
                                            <>
                                                <label htmlFor="" className="text-xl font-bold px-1">Toll Details</label>
                                                <div className="flex flex-row">
                                                    {PolylineDetails.map((route, i) => (
                                                        <>
                                                            <div key={i} className="w-1/3 bg-white ml-2 p-1 pr-3 py-2 rounded-lg border-2 border-gray-200 hover:cursor-pointer h-fit" onClick={()=>HandleActiveTollDetails(i)}>
                                                                <p className='text-gray-800'>
                                                                    Has Toll:{route.data.hasTolls === true ? "Yess" : "No"}<br />
                                                                    Fuel Cost:{route.data.costs.fuel} INR<br />
                                                                    {route.data.hasTolls === true && `Tag:${route.data.costs.tag} INR`}<br />
                                                                    {route.data.hasTolls === true && ` Cash:${route.data.costs.cash} INR`}<br />
                                                                    Distance:{route.data.distance.metric}
                                                                </p>
                                                            </div>
                                                        </>
                                                    ))}
                                                </div>
                                                <p className='text-xs font-semibold'>
                                                    Click on each Toll Details to get Exact Toll Points on Map along with the charges
                                                </p>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="flex -mx-3">
                                    <div className="w-full px-3 mb-5">
                                        <button className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                                            onClick={(e) => SubmitJourneyDetails(e)}
                                        >CALCULATE</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index