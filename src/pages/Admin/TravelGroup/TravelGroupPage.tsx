import { useEffect, useState, type ReactNode } from "react";
import { TravelGroupDrawer } from "./TravelGroupDrawer";
import {
  addTravelGroup,
  updateTravelGroup,
  deleteTravelGroup,
  fetchAllTravelGroups,
  fetchAllItineraries,
  fetchAllUsers,
  inviteUserToTravelGroup
} from "../../../api/adminApi";
import { BASE_URL } from "../../../utils/constatnts";
import { formatThumbnailForDisplay } from "../../../utils/imageUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface Itinerary {
  _id: string;
  title: string;
}

interface TravelGroup {
  _id: string;
  name: string;
  description: string;
  groupAdmin: string;
  itineraryId: string;
  itineraryName: string;
  maxMembers: number;
  currentMembers: number;
  startDate: string;
  endDate: string;
  pricePerPerson: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  meetingPoint: string;
  meetingTime: string;
  thumbnail?: string;
  requirements: string[];
  inclusions: string[];
  exclusions: string[];
  isPrivate?: boolean;
  invitedUsers?: any[];
}

interface User {
  _id: string;
  userName: string;
  email: string;
}

type ColumnDefinition = {
  title: string;
  key: string;
  dataIndex?: keyof TravelGroup;
  render?: (value: TravelGroup[keyof TravelGroup] | undefined, record: TravelGroup) => ReactNode;
};

const TravelGroupPage: React.FC = () => {
  const [travelGroups, setTravelGroups] = useState<TravelGroup[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<TravelGroup | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [itineraryFilter, setItineraryFilter] = useState<string | null>(null);
  const [clearForm, setClearForm] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<TravelGroup | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchText, setUserSearchText] = useState("");

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter(null);
    setItineraryFilter(null);
  };

  useEffect(() => {
    fetchData();
    if (inviteModalOpen) {
      fetchUsers();
    }
  }, [inviteModalOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsRes, itinerariesRes] = await Promise.all([
        fetchAllTravelGroups(),
        fetchAllItineraries()
      ]);
      console.log(groupsRes,itinerariesRes)

      const itinerariesMap = new Map(
        (itinerariesRes.data.data?.itineraryData || []).map((it: Itinerary) => [it._id, it.title])
      );

      const groupsWithItineraryNames = (groupsRes.data.data || []).map((group: any) => ({
        ...group,
        itineraryName: itinerariesMap.get(group.itineraryId) || 'Unknown Itinerary'
      }));

      setTravelGroups(groupsWithItineraryNames);
      setItineraries(itinerariesRes.data.data?.itineraryData || []);
    } catch (error) {
      setAlert({ type: "error", message: "Failed to fetch travel groups data" });
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setDrawerOpen(true);
    setClearForm(prev => !prev);
  };

  const handleEdit = (record: TravelGroup) => {
    setEditData(record);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this travel group?")) {
      try {
        await deleteTravelGroup(id);
        setAlert({ type: "success", message: "Travel group deleted successfully" });
        fetchData();
      } catch (error) {
        setAlert({ type: "error", message: "Failed to delete travel group" });
      }
    }
  };

  const handleOpenInviteModal = (group: TravelGroup) => {
    setSelectedGroup(group);
    setInviteModalOpen(true);
    fetchUsers();
  };

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setAlert({ type: "error", message: "Failed to fetch users" });
    }
  };

  const handleInviteUser = async (userId: string) => {
    if (!selectedGroup) return;
    try {
      await inviteUserToTravelGroup(selectedGroup._id, userId);
      setAlert({ type: "success", message: "User invited successfully" });
      // Refresh data to get updated invited users
      const updatedGroupsRes = await fetchAllTravelGroups();
      const updatedGroup = updatedGroupsRes.data.data.find((g: any) => g._id === selectedGroup._id);
      if (updatedGroup) {
        setSelectedGroup({ ...selectedGroup, ...updatedGroup });
      }
      fetchData();
    } catch (error: any) {
      setAlert({ type: "error", message: error.response?.data?.message || "Failed to invite user" });
    }
  };

  const handleSubmit = async (data: any) => {
    console.log(data)
    const adminId = typeof window !== "undefined" ? window.sessionStorage.getItem("adminId") : null;
    
    // Prepare JSON data with base64 thumbnail
    const requestData = {
      ...data,
      groupAdmin: adminId || null,
    };

    try {
      if (editData && editData._id) {
        await updateTravelGroup(requestData, editData._id);
        setAlert({ type: "success", message: "Travel group updated successfully" });
      } else {
        await addTravelGroup(requestData);
        setAlert({ type: "success", message: "Travel group created successfully" });
      }
      setDrawerOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving travel group:", error);
      setAlert({ type: "error", message: "Failed to save travel group" });
    }
  };

  const columns: ColumnDefinition[] = [
    {
      title: 'Thumbnail',
      key: 'thumbnail',
      dataIndex: 'thumbnail',
      render: (thumbnail) => {
        const imagePath = typeof thumbnail === 'string' ? thumbnail : '';
        return imagePath ? (
          <img
            src={formatThumbnailForDisplay(imagePath, BASE_URL)}
            alt="Thumbnail"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            No Image
          </div>
        );
      }
    },
    { title: 'Name', key: 'name', dataIndex: 'name' },
    { title: 'Itinerary', key: 'itineraryName', dataIndex: 'itineraryName' },
    {
      title: 'Members', key: 'members',
      render: (_: any, record: TravelGroup) => `${record.currentMembers} / ${record.maxMembers}`
    },
    {
      title: 'Status', key: 'status',
      dataIndex: 'status',
      render: (status) => {
        const statusValue = typeof status === 'string' ? status : '';
        const badgeClass =
          statusValue === 'upcoming' ? 'bg-primary' :
          statusValue === 'ongoing' ? 'bg-success' :
          statusValue === 'completed' ? 'bg-secondary' : 'bg-danger';

        return (
          <span className={`badge ${badgeClass}`}>
            {statusValue ? statusValue.charAt(0).toUpperCase() + statusValue.slice(1) : ''}
          </span>
        );
      }
    },
    {
      title: 'Privacy', key: 'privacy',
      render: (_: any, record: TravelGroup) => {
        const isPrivate = record.isPrivate;
        return (
          <span className={`badge ${isPrivate ? 'bg-danger' : 'bg-success'}`}>
            {isPrivate ? 'Private' : 'Public'}
          </span>
        );
      }
    },
    {
      title: 'Actions', key: 'actions',
      render: (_: any, record: TravelGroup) => (
        <div className="btn-group">
          <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(record)}>
            <i className="bi bi-pencil"></i>
          </button>
          <button className="btn btn-sm btn-outline-success ms-2" onClick={() => handleOpenInviteModal(record)} title="Invite Users">
            <i className="bi bi-person-plus"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => handleDelete(record._id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const filteredData = travelGroups.filter(group => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = !statusFilter || group.status === statusFilter;
    const matchesItinerary = !itineraryFilter || group.itineraryId === itineraryFilter;
    return matchesSearch && matchesStatus && matchesItinerary;
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Travel Groups</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>Add Travel Group
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      <div className="card mb-4 p-3 shadow-sm border-0">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label htmlFor="travel-group-search" className="form-label">Search</label>
            <input
              id="travel-group-search"
              type="text"
              className="form-control"
              placeholder="Search by name or description"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="travel-group-status" className="form-label">Status</label>
            <select
              id="travel-group-status"
              className="form-select"
              value={statusFilter ?? ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
            >
              <option value="">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="travel-group-itinerary" className="form-label">Itinerary</label>
            <select
              id="travel-group-itinerary"
              className="form-select"
              value={itineraryFilter ?? ''}
              onChange={(e) => setItineraryFilter(e.target.value || null)}
            >
              <option value="">All</option>
              {itineraries.map((itinerary) => (
                <option key={itinerary._id} value={itinerary._id}>
                  {itinerary.title}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 d-flex justify-content-md-end">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>{columns.map(c => <th key={c.key}>{c.title}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} className="text-center py-4">
                <div className="spinner-border text-primary"></div>
              </td></tr>
            ) : filteredData.length > 0 ? (
              filteredData.map(group => (
                <tr key={group._id}>
                  {columns.map(col => {
                    const value = col.dataIndex ? group[col.dataIndex] : undefined;
                    return (
                      <td key={col.key}>
                        {col.render ? col.render(value, group) : (value as ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr><td colSpan={columns.length} className="text-center py-4">No travel groups found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <TravelGroupDrawer
        show={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSubmit}
        editData={editData}
        itineraries={itineraries}
        clearData={clearForm}
      />

      {/* Invite Users Modal */}
      {inviteModalOpen && selectedGroup && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setInviteModalOpen(false)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Invite Users to {selectedGroup.name}</h5>
                <button type="button" className="btn-close" onClick={() => setInviteModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search users by name or email..."
                    value={userSearchText}
                    onChange={(e) => setUserSearchText(e.target.value)}
                  />
                </div>
                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="table table-hover">
                    <thead className="table-light sticky-top">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(user =>
                          user.userName.toLowerCase().includes(userSearchText.toLowerCase()) ||
                          user.email.toLowerCase().includes(userSearchText.toLowerCase())
                        )
                        .map(user => {
                          const isInvited = selectedGroup.invitedUsers?.some(
                            (invite: any) => {
                              const inviteUserId = typeof invite.userId === 'object' ? invite.userId?._id || invite.userId?.toString() : invite.userId?.toString();
                              return inviteUserId === user._id || inviteUserId === user._id.toString();
                            }
                          );
                          const isMember = selectedGroup.members?.some(
                            (member: any) => {
                              const memberUserId = typeof member.user === 'object' ? member.user?._id || member.user?.toString() : member.user?.toString();
                              return memberUserId === user._id || memberUserId === user._id.toString();
                            }
                          );
                          return (
                            <tr key={user._id}>
                              <td>{user.userName}</td>
                              <td>{user.email}</td>
                              <td>
                                {isMember ? (
                                  <span className="badge bg-success">Member</span>
                                ) : isInvited ? (
                                  <span className="badge bg-info">Invited</span>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleInviteUser(user._id)}
                                  >
                                    Invite
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setInviteModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelGroupPage;
