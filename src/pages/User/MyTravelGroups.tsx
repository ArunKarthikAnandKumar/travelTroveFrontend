import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTravelGroups, joinTravelGroup, getTravelGroupById } from '../../api/userServices';
import { BASE_URL } from '../../utils/constatnts';

const MyTravelGroups: React.FC = () => {
  const navigate = useNavigate();
  const [travelGroups, setTravelGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchTravelGroups();
  }, []);

  const fetchTravelGroups = async () => {
    try {
      setLoading(true);
      const response = await getAllTravelGroups();
      if (response.success) {
        setTravelGroups(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch travel groups');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch travel groups');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!window.confirm('Are you sure you want to join this travel group?')) {
      return;
    }

    try {
      const response = await joinTravelGroup(groupId);
      if (response.success) {
        alert('Successfully joined the travel group!');
        fetchTravelGroups();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to join travel group');
    }
  };

  const handleViewDetails = async (groupId: string) => {
    try {
      const response = await getTravelGroupById(groupId);
      if (response.success) {
        setSelectedGroup(response.data);
        setShowDetailsModal(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to fetch group details');
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h5 className="alert-heading">Error</h5>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-3">Travel Groups</h2>
          <p className="text-muted">Join travel groups or create your own</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/user/create-travel-group')}>
          Create Travel Group
        </button>
      </div>

      {travelGroups.length > 0 ? (
        <div className="row">
          {travelGroups.map((group) => (
            <div key={group._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                {group.thumbnail && (
                  <img
                    className="card-img-top"
                    src={`${BASE_URL}/${group.thumbnail}`}
                    alt={group.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title h5 mb-0">{group.name}</h5>
                    {group.isPrivate && (
                      <span className="badge bg-warning text-dark">
                        <i className="bi bi-eye"></i> Private
                      </span>
                    )}
                  </div>
                  <h6 className="card-subtitle text-muted mb-3">
                    {group.iternaryName || 'No itinerary'}
                  </h6>
                  <p className="card-text flex-grow-1">
                    {group.description}
                  </p>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-calendar me-2 text-muted"></i>
                      <small className="text-muted">
                        {new Date(group.startDate).toLocaleDateString()} - {new Date(group.endDate).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-people me-2 text-muted"></i>
                      <small className="text-muted">
                        {group.currentMembers} / {group.maxMembers} members
                      </small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge bg-${getStatusColor(group.status)}`}>{group.status}</span>
                      <strong className="text-primary">${group.pricePerPerson}</strong>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm flex-fill"
                      onClick={() => handleViewDetails(group._id)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-primary btn-sm flex-fill"
                      onClick={() => handleJoinGroup(group._id)}
                      disabled={group.currentMembers >= group.maxMembers}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-5">
          <div className="card-body">
            <i className="bi bi-people text-muted mb-3" style={{ fontSize: '4rem' }}></i>
            <h4 className="text-muted">No travel groups available</h4>
            <p className="text-muted">
              Create your first travel group and start planning trips with others!
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/user/create-travel-group')}>
              Create Travel Group
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedGroup?.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                {selectedGroup && (
                  <>
                    {selectedGroup.thumbnail && (
                      <div className="text-center mb-3">
                        <img
                          src={`${BASE_URL}/${selectedGroup.thumbnail}`}
                          alt={selectedGroup.name}
                          style={{ maxHeight: '300px', width: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <h5>Description</h5>
                      <p>{selectedGroup.description}</p>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6>Itinerary</h6>
                        <p className="text-muted">{selectedGroup.iternaryName || 'N/A'}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>Status</h6>
                        <span className={`badge bg-${getStatusColor(selectedGroup.status)}`}>{selectedGroup.status}</span>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6>Duration</h6>
                        <p className="text-muted">
                          {new Date(selectedGroup.startDate).toLocaleDateString()} - {new Date(selectedGroup.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>Price</h6>
                        <p className="text-primary fw-bold">${selectedGroup.pricePerPerson} per person</p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6>Members</h6>
                        <p className="text-muted">{selectedGroup.currentMembers} / {selectedGroup.maxMembers}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>Group Type</h6>
                        <span className={`badge bg-${selectedGroup.isPrivate ? 'warning' : 'success'} text-dark`}>
                          {selectedGroup.isPrivate ? 'Private' : 'Public'}
                        </span>
                      </div>
                    </div>

                    {selectedGroup.meetingPoint && (
                      <div className="mb-3">
                        <h6>Meeting Point</h6>
                        <p className="text-muted">{selectedGroup.meetingPoint}</p>
                      </div>
                    )}

                    {selectedGroup.requirements && selectedGroup.requirements.length > 0 && (
                      <div className="mb-3">
                        <h6>Requirements</h6>
                        <ul>
                          {selectedGroup.requirements.map((req: string, index: number) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedGroup.inclusions && selectedGroup.inclusions.length > 0 && (
                      <div className="mb-3">
                        <h6>Inclusions</h6>
                        <ul>
                          {selectedGroup.inclusions.map((inc: string, index: number) => (
                            <li key={index}>{inc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    selectedGroup && handleJoinGroup(selectedGroup._id);
                  }}
                  disabled={selectedGroup && selectedGroup.currentMembers >= selectedGroup.maxMembers}
                >
                  Join Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'info';
    case 'ongoing':
      return 'success';
    case 'completed':
      return 'secondary';
    case 'cancelled':
      return 'danger';
    default:
      return 'primary';
  }
};

export default MyTravelGroups;

