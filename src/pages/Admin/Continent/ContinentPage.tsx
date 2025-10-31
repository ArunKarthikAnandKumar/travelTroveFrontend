
import { useEffect, useState } from "react"
import { Continent } from "../../../models/Destinations"
import "../../../css/AdminForms.css"
import { ContinentDrawer } from "./ContinentDrawer"
import { addContinent, deleteContinent, fetchAllContinents, updateContinent } from "../../../api/adminApi"
import AlertMessage from "../../../Components/Common/AlertMessage"
import { setToken } from "../../../utils/token"
import { BASE_URL } from "../../../utils/constants"



const ContinentPage: React.FC = () => {
    const [continents, setContinents] = useState<Continent[]>([]);
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
            let responseData = (await fetchAllContinents()).data
            setContinents(responseData.data)
        } catch (e) {
            setErrorMessage("Failed in fetching continents data")
            setContinents([])

        }

    }

    const [currentPageSize, SetCurrentPageSize] = useState(1)
    const pageSize = 5
    const pagCount = Math.ceil(continents.length / pageSize)

    const paginatedData = continents.slice(
        (currentPageSize - 1) * pageSize,
        currentPageSize * pageSize
    )
    const onAdd = () => {
        setEditData(null)
        setDrawerOpen(true)

    }
    const onEdit = (contiData: Continent) => {
        if (contiData) {
            setEditData(contiData)
            setDrawerOpen(true)

        }
    }
    const onDelete = async (id: string) => {
        setErrorMessage("")
        setSuccessMessage("")
        setShowError(false)
        setShowSuccess(false)
        try {
            let resposne = await deleteContinent(id)
            let responseData = resposne.data
            setShowSuccess(true)
            setSuccessMessage(responseData.message)

        } catch (e) {
            setShowError(true)
            setErrorMessage('Something Went Wrong')

        }

    }

    const handleSubmit = async (data: any) => {
        if (editData) {
            const formData = new FormData()
            formData.append("name", data.name)
            formData.append("shortDesc", data.shortDesc)
            formData.append("longDesc", data.longDesc)
            
            if (data.thumbnailFile) {
                formData.append("thumbnail", data.thumbnailFile)

            } else {
                let fileData=data.thumbnail.split('/')
                let filename=fileData.pop()
                formData.append("thumbnail", filename)
            }
            try {
                    let resposne = await updateContinent(formData, editData.id)
                    let responseData = resposne.data
                    setSuccessMessage(responseData.message)
                    setClearData(true)
                    setDrawerOpen(false)
                    setShowSuccess(true)
            } catch (error: any) {

                setEditData(null)
                setDrawerOpen(false)
                setShowError(true)
                let erroStack = error.response.data
                setErrorMessage(erroStack.message);
                  setClearData(true)
                setSuccessMessage("");
            }

        } else {
            const formData = new FormData()
            formData.append("name", data.name)
            formData.append("shortDesc", data.shortDesc)
            formData.append("longDesc", data.longDesc)
            formData.append("thumbnail", data.thumbnailFile)
            try {
                let resposne = await addContinent(formData)
                let responseData = resposne.data
                setSuccessMessage(responseData.message)
                setClearData(true)
                setDrawerOpen(false)
                setShowSuccess(true)

            } catch (error: any) {
                let erroStack = error.response?.data
                setShowError(true)
                setErrorMessage(erroStack?.message || 'Unknown Error');
                                  setClearData(true)

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
                    <h3 className="fw-bold">Continent List </h3>
                    <button className="btn btn-primary" onClick={onAdd}>
                        + Add Continent
                    </button>
                </div>
                <div className="table-responsive bg-white rounded shadow-sm p-3">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Thumbnail</th>
                                <th>Continent</th>
                                <th>Short Description</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((continent, index) => (
                                <tr key={continent.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            src={`${BASE_URL}/${continent.thumbnail}`}
                                            alt={continent.name}
                                            style={{
                                                width: 60,
                                                height: 40,
                                                objectFit: "cover",
                                                borderRadius: "6px",
                                            }}
                                        />
                                    </td>
                                    <td>{continent.name}</td>
                                    <td>{continent.shortDesc}</td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => onEdit(continent)}
                                        >Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => onDelete(continent.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>

                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted">
                                        No continents found
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
                <ContinentDrawer
                    show={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    onSave={handleSubmit}
                    editData={editData}
                    clearData={clearData}
                />
                {drawerOpen && (
                    <div className="overlay" onClick={() => setDrawerOpen(false)}></div>
                )}
            </div>
        </>
    )

}

export default ContinentPage