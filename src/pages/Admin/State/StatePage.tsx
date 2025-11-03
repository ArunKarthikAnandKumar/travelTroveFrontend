
import { useEffect, useState } from "react"
import type { State, Continent, Country } from "../../../models/Destinations"
import "../../../css/AdminForms.css"
import { StateDrawer } from "./StateDrawer"
import { addState, deleteState, fetchAllStates, updateState } from "../../../api/adminApi"
import AlertMessage from "../../../components/Common/AlertMessage"
import { setToken } from "../../../utils/token"
import { BASE_URL } from "../../../utils/constatnts"



const StatePage: React.FC = () => {
    const [states, setStates] = useState<State[]>([]);
    const [countrys, setCountry] = useState<Country[]>([]);
    const [continents, setContinent] = useState<Continent[]>([]);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [editData, setEditData] = useState<any | null>(null);
    const [clearData, setClearData] = useState<any | null>(null);

    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);

    useEffect(() => {
        fetchallData()
    }, [showSuccess,showError])

    const fetchallData = async () => {
        try {
            let responseData = (await fetchAllStates()).data
            setStates(responseData.data.stateData)
            setContinent(responseData.data.continentData)
            setCountry(responseData.data.countryData)
        } catch (e) {
            setErrorMessage("Failed in fetching states data")
            setStates([])
            

        }

    }

    const [currentPageSize, SetCurrentPageSize] = useState(1)
    const pageSize = 5
    const pagCount = states?Math.ceil(states.length / pageSize):0

    // Helper function to format thumbnail for display (like ContinentPage/CountryPage)
    const formatThumbnailForDisplay = (thumbnail: string): string => {
        if (!thumbnail) return '';
        
        // If it already starts with data:image, use it directly
        if (thumbnail.startsWith('data:image')) {
            return thumbnail;
        }
        
        // If it contains "data:image" (backend might have prefixed it), extract the data URL part
        const dataImageIndex = thumbnail.indexOf('data:image');
        if (dataImageIndex !== -1) {
            // Extract everything from "data:image" onwards
            return thumbnail.substring(dataImageIndex);
        }
        
        // If it starts with assets/ or is a path, use BASE_URL
        if (thumbnail.startsWith('assets/')) {
            return `${BASE_URL}/${thumbnail}`;
        }
        
        // If it's pure base64 (no prefix), add the data URL prefix
        if (thumbnail.length > 100 && !thumbnail.includes('/')) {
            return `data:image/jpeg;base64,${thumbnail}`;
        }
        
        // Fallback: assume it's a path
        return `${BASE_URL}/${thumbnail}`;
    };

    const paginatedData =states? states.slice(
        (currentPageSize - 1) * pageSize,
        currentPageSize * pageSize
    ):[];
    const onAdd = () => {
        setEditData(null)
        setDrawerOpen(true)

    }
    const onEdit = (stateData: State) => {
        if (stateData) {
            console.log('swssw',stateData)
            let continentObj=continents.find(ele=>ele.name==stateData.continent)
            let countryObj=countrys.find(ele=>ele.name==stateData.country)
            if(continentObj && countryObj){
            stateData.continentId=continentObj.id
            stateData.countryId=countryObj.id
            }
            setEditData(stateData)
            setDrawerOpen(true)

        }
    }
    const onDelete = async (id: string) => {
        setErrorMessage("")
        setSuccessMessage("")
        setShowError(false)
        setShowSuccess(false)
        try {
            let resposne = await deleteState(id)
            let responseData = resposne.data
            setShowSuccess(true)
            setSuccessMessage(responseData.message)

        } catch (e) {
            setShowError(true)
            setErrorMessage('Something Went Wrong')

        }

    }

    const handleSubmit = async (data: any) => {
        let continentObj=continents.find(ele=>ele.id==data.continent)
        let countryObj=countrys.find(ele=>ele.id==data.country)
        
        if(continentObj && countryObj){
            // Prepare JSON data with base64 thumbnail (like ContinentPage/CountryPage)
            const requestData: any = {
                name: data.name,
                shortDesc: data.shortDesc,
                longDesc: data.longDesc,
                continentId: continentObj.id,
                continent: continentObj.name,
                countryId: countryObj.id,
                country: countryObj.name,
                popularFor: data.popularFor.toString()
            };

            // Only include thumbnail if it's a valid base64 image (starts with data:image and is substantial)
            // If editing and no new image uploaded, backend will keep existing thumbnail
            if (data.thumbnail && data.thumbnail.startsWith('data:image') && data.thumbnail.length > 100) {
                requestData.thumbnail = data.thumbnail;
            } else if (!editData) {
                // For new state, thumbnail is required (validated in drawer)
                requestData.thumbnail = data.thumbnail || null;
            }

            try {
                let response;
                if (editData) {
                    response = await updateState(requestData, editData.id);
                } else {
                    response = await addState(requestData);
                }
                
                let responseData = response.data;
                setSuccessMessage(responseData.message);
                setClearData(true);
                setDrawerOpen(false);
                setShowSuccess(true);
            } catch (error: any) {
                setEditData(null);
                setDrawerOpen(false);
                setShowError(true);
                let erroStack = error.response?.data;
                setErrorMessage(erroStack?.message || 'Unknown Error');
                setClearData(true);
                setSuccessMessage("");
            }
        }
    }

    return (
        <>
            {
                showSuccess && (
                    <AlertMessage
                        type="success"
                        title="Sucess"
                        message={successMessage}
                        onclose={() => setShowSuccess(false)}
                    />
                )
            }
            {
                showError && (
                    <>
                        <AlertMessage
                            type="danger"
                            title="Error"
                            message={errorMessage}
                            onclose={() => setShowSuccess(false)}
                        />

                    </>)
            }
            <div className="container py-4 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="fw-bold">State List </h3>
                    <button className="btn btn-primary" onClick={onAdd}>
                        + Add State
                    </button>
                </div>
                <div className="table-responsive bg-white rounded shadow-sm p-3">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Thumbnail</th>
                                <th>Continent</th>
                                <th>Country</th>
                                <th>State</th>
                                <th>Short Description</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            { paginatedData.map((state, index) => (
                                
                                <tr key={state.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            src={formatThumbnailForDisplay(state.thumbnail)}
                                            alt={state.name}
                                            style={{
                                                width: 60,
                                                height: 40,
                                                objectFit: "cover",
                                                borderRadius: "6px",
                                            }}
                                            onError={(e) => {
                                                // Fallback if base64 is invalid
                                                (e.target as HTMLImageElement).src = '';
                                            }}
                                        />
                                    </td>
                                    <td>{state.continent}</td>
                                    <td>{state.country}</td>
                                    <td>{state.name}</td>
                                    <td>{state.shortDesc}</td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => onEdit(state)}
                                        >Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => onDelete(state.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>

                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted">
                                        No states found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {
                    currentPageSize>1 &&(
   <div className="d-flex justify-content-end align-items-end mt-3">
                    <nav>
                        <ul className="pagination mb-0">
                            <li className={`page-item ${currentPageSize === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => SetCurrentPageSize((count) => Math.max(count - 1, 1))}
                                >
                                    Previous
                                </button>
                            </li>
                            {Array.from({ length: pagCount }, (_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${currentPageSize === i + 1 ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => SetCurrentPageSize(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            <li
                                className={`page-item ${currentPageSize === pagCount ? "disabled" : ""}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        SetCurrentPageSize((p) => Math.min(p + 1, pagCount))
                                    }
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                    )
                }
             
                <StateDrawer
                    show={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    onSave={handleSubmit}
                    editData={editData}
                    clearData={clearData}
                    continentData={continents}
                    countryData={countrys}
                />
                {drawerOpen && (
                    <div className="overlay" onClick={() => setDrawerOpen(false)}></div>
                )}
            </div>
        </>
    )

}

export default StatePage