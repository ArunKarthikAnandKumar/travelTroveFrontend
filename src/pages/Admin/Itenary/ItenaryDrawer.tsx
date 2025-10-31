import React, { useEffect, useState } from "react";
import { Continent, Country, State, City } from "../../../models/Destinations";
import { BASE_URL } from "../../../utils/constants";

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData: any | null;
  clearData: boolean;
  continentData: Continent[];
  countryData: Country[];
  stateData: State[];
  cityData: City[];
  attractionData: { id: string; name: string; cityId: string }[];
  hotelData: { id: string; name: string; cityId: string }[];
  restaurantData: { id: string; name: string; cityId: string }[];
};

export const ItineraryDrawer: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  editData,
  clearData,
  continentData,
  countryData,
  stateData,
  cityData,
  attractionData,
  hotelData,
  restaurantData,
}) => {
  const [type, setType] = useState<"Fixed" | "Customizable">("Fixed");
  const [title, setTitle] = useState("");
  const [durationDays, setDurationDays] = useState<number>(1);
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
            const [text, setText] = useState("");


  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [bestTimeToVisit, setBestTimeToVisit] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [days, setDays] = useState<any[]>([
    {
      dayNumber: 1,
      title: "",
      description: "",
      attractions: [], 
      meals: {
        breakfast: null,
        lunch: null,
        dinner: null,
      },
      hotelStay: null, 
    },
  ]);

  const [daySelects, setDaySelects] = useState<
    {
      attractionSelect?: string;
      attractionStart?: string;
      attractionEnd?: string;
      attractionNotes?: string;
      mealBreakfastSelect?: string;
      mealLunchSelect?: string;
      mealDinnerSelect?: string;
      mealBreakfastTime?: string;
      mealLunchTime?: string;
      mealDinnerTime?: string;
      hotelSelect?: string;
      hotelCheckIn?: string;
      hotelCheckOut?: string;
    }[]
  >(days.map(()=>({})));

  useEffect(() => {
    setDaySelects((prev) => {
      const copy = [...prev];
      while (copy.length < days.length) copy.push({});
      while (copy.length > days.length) copy.pop();
      return copy;
    });
  }, [days.length]);

  const filteredCountries = (contiId: string) =>
    countryData.filter((ele) => ele.continentId === contiId);
  const filteredStates = (countryId: string) =>
    stateData.filter((ele) => ele.countryId === countryId);
  const filteredCities = (stateId: string) =>
    cityData.filter((ele) => ele.stateId === stateId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnail(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setThumbnail("");
    setThumbnailFile(null);
  };

  useEffect(() => {
    if (editData) {
      setType(editData.type || "Fixed");
      setTitle(editData.title || "");
      setDurationDays(editData.durationDays || 1);
      setThumbnail(editData.thumbnail ? `${BASE_URL}/${editData.thumbnail}` : "");
      setContinent(editData.continentId || "");
      setCountry(editData.countryId || "");
      setState(editData.stateId || "");
      setCity(editData.cityId || "");
      setDays(
        (editData.days || []).map((d: any, idx: number) => ({
          ...d,
          dayNumber: d.dayNumber || idx + 1,
          attractions: d.attractions || [],
          meals: d.meals || { breakfast: null, lunch: null, dinner: null },
          hotelStay: d.hotelStay || null,
        }))
      );
      setInclusions(editData.inclusions || []);
      setExclusions(editData.exclusions || []);
      setPriceRange(editData.priceRange || "");
      setBestTimeToVisit(editData.bestTimeToVisit || []);
      setTags(editData.tags || []);
    } else {
      setType("Fixed");
      setTitle("");
      setDurationDays(1);
      setThumbnail("");
      setContinent("");
      setCountry("");
      setState("");
      setCity("");
      setDays([
        {
          dayNumber: 1,
          title: "",
          description: "",
          attractions: [],
          meals: { breakfast: null, lunch: null, dinner: null },
          hotelStay: null,
        },
      ]);
      setInclusions([]);
      setExclusions([]);
      setPriceRange("");
      setBestTimeToVisit([]);
      setTags([]);
    }
  }, [editData, clearData]);

  const availableAttractionsForCity = (cityId: string) =>
    attractionData.filter((a) => a.cityId === cityId);
  const availableHotelsForCity = (cityId: string) =>
    hotelData.filter((h) => h.cityId === cityId);
  const availableRestaurantsForCity = (cityId: string) =>
    restaurantData.filter((r) => r.cityId === cityId);

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      {
        dayNumber: prev.length + 1,
        title: "",
        description: "",
        attractions: [],
        meals: { breakfast: null, lunch: null, dinner: null },
        hotelStay: null,
      },
    ]);
  };

  const removeDay = (index: number) => {
    setDays((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy.map((d, i) => ({ ...d, dayNumber: i + 1 }));
    });
  };

  const updateDay = (index: number, patch: any) => {
    setDays((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  };

  const addAttractionToDay = (dayIndex: number) => {
    const sel = daySelects[dayIndex]?.attractionSelect;
    if (!sel || !city) return; 
    const item = attractionData.find((a) => a.id === sel && a.cityId === city);
    if (!item) return;
    updateDay(dayIndex, {
      attractions: [
        ...(days[dayIndex].attractions || []),
        {
          attractionId: item.id,
          attractionName: item.name,
          cityId: item.cityId,
          startTime: daySelects[dayIndex]?.attractionStart || "",
          endTime: daySelects[dayIndex]?.attractionEnd || "",
          notes: daySelects[dayIndex]?.attractionNotes || "",
        },
      ],
    });
    setDaySelects((prev) => {
      const copy = [...prev];
      copy[dayIndex] = { ...(copy[dayIndex] || {}), attractionSelect: "", attractionStart: "", attractionEnd: "", attractionNotes: "" };
      return copy;
    });
  };

  const removeAttractionFromDay = (dayIndex: number, idx: number) => {
    const newAttractions = [...days[dayIndex].attractions];
    newAttractions.splice(idx, 1);
    updateDay(dayIndex, { attractions: newAttractions });
  };

  const setMealForDay = (dayIndex: number, mealType: "breakfast" | "lunch" | "dinner") => {
    const selKey =
      mealType === "breakfast" ? "mealBreakfastSelect" : mealType === "lunch" ? "mealLunchSelect" : "mealDinnerSelect";
    const sel = daySelects[dayIndex]?.[selKey];
    if (!sel || !city) return;
    const item = restaurantData.find((r) => r.id === sel && r.cityId === city);
    if (!item) return;
    const meals = { ...(days[dayIndex].meals || {}) };
    meals[mealType] = {
      restaurantId: item.id,
      restaurantName: item.name,
      cityId: item.cityId,
      time: daySelects[dayIndex]?.[
        mealType === "breakfast" ? "mealBreakfastTime" : mealType === "lunch" ? "mealLunchTime" : "mealDinnerTime"
      ] || "",
    };
    updateDay(dayIndex, { meals });
    setDaySelects((prev) => {
      const copy = [...prev];
      copy[dayIndex] = { ...(copy[dayIndex] || {}), [selKey]: "", [mealType === "breakfast" ? "mealBreakfastTime" : mealType === "lunch" ? "mealLunchTime" : "mealDinnerTime"]: "" };
      return copy;
    });
  };

  const clearMealFromDay = (dayIndex: number, mealType: "breakfast" | "lunch" | "dinner") => {
    const meals = { ...(days[dayIndex].meals || {}) };
    meals[mealType] = null;
    updateDay(dayIndex, { meals });
  };

  const setHotelForDay = (dayIndex: number) => {
    const sel = daySelects[dayIndex]?.hotelSelect;
    if (!sel || !city) return;
    const item = hotelData.find((h) => h.id === sel && h.cityId === city);
    if (!item) return;
    updateDay(dayIndex, {
      hotelStay: {
        hotelId: item.id,
        hotelName: item.name,
        cityId: item.cityId,
        checkIn: daySelects[dayIndex]?.hotelCheckIn || "",
        checkOut: daySelects[dayIndex]?.hotelCheckOut || "",
      },
    });
    setDaySelects((prev) => {
      const copy = [...prev];
      copy[dayIndex] = { ...(copy[dayIndex] || {}), hotelSelect: "", hotelCheckIn: "", hotelCheckOut: "" };
      return copy;
    });
  };

  const clearHotelFromDay = (dayIndex: number) => {
    updateDay(dayIndex, { hotelStay: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payloadDays = days.map((d, i) => ({ ...d, dayNumber: i + 1 }));
    onSave({
      type,
      title,
      durationDays,
      continentId: continent,
      continent: continentData.find((c) => c.id === continent)?.name || "",
      countryId: country,
      country: countryData.find((c) => c.id === country)?.name || "",
      stateId: state,
      state: stateData.find((s) => s.id === state)?.name || "",
      cityId: city,
      city: cityData.find((c) => c.id === city)?.name || "",
      days: payloadDays,
      inclusions,
      exclusions,
      priceRange,
      bestTimeToVisit,
      tags,
      thumbnail,
      thumbnailFile,
    });
  };

  const chooseListPlaceholder = (listName: string) => `Select ${listName} (filtered by city)`;

  return (
    <div
      className={`offcanvas offcanvas-end ${show ? "show" : ""}`}
      style={{
        width: window.innerWidth < 768 ? "100%" : "900px",
        background: "#f8f9fa",
        display: show ? "block" : "none",
      }}
    >
      <div className="offcanvas-header border-bottom" style={{ background: "#fff" }}>
        <h5 className="fw-bold mb-0">{editData ? "Edit Itinerary" : "Add New Itinerary"}</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="offcanvas-body p-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header fw-semibold">Basic Details</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={type} onChange={(e) => setType(e.target.value as any)}>
                    <option value="Fixed">Fixed</option>
                    <option value="Customizable">Customizable</option>
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
               
              </div>
               <div className="row g-3 mt-2">
                 <div className="col-md-4">
                <label className="form-label">Duration (Days)</label>
                <input type="number" className="form-control" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} min={1} />
              </div>
                <div className="col-md-8">
                  <label className="form-label">Price Range</label>
                  <input type="text" className="form-control" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="eg. ₹15,000–₹25,000" required />
                </div>
              </div>

            </div>
            
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header fw-semibold">Location (choose city first)</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Continent</label>
                  <select className="form-select" value={continent} onChange={(e) => { setContinent(e.target.value); setCountry(""); }}>
                    <option value="">Select</option>
                    {continentData.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Country</label>
                  <select className="form-select" value={country} onChange={(e) => { setCountry(e.target.value); setState(""); }}>
                    <option value="">Select</option>
                    {filteredCountries(continent).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">State</label>
                  <select className="form-select" value={state} onChange={(e) => { setState(e.target.value); setCity(""); }}>
                    <option value="">Select</option>
                    {filteredStates(country).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">City</label>
                  <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">Select</option>
                    {filteredCities(state).map((ct) => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-text mt-2">Only attractions/hotels/restaurants for the selected city will be available in day-level dropdowns.</div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header fw-semibold d-flex justify-content-between align-items-center">
              <span>Days</span>
              <div>
                <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={addDay}>+ Add Day</button>
              </div>
            </div>

            <div className="card-body">
              {days.map((d, i) => {
                const availableAttractions = city ? availableAttractionsForCity(city) : [];
                const availableHotels = city ? availableHotelsForCity(city) : [];
                const availableRestaurants = city ? availableRestaurantsForCity(city) : [];

                return (
                  <div key={i} className="border rounded p-3 mb-3 bg-white shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">Day {i + 1}</h6>
                      <div>
                        <button type="button" className="btn btn-sm btn-outline-danger me-2" onClick={() => removeDay(i)}>Remove</button>
                      </div>
                    </div>

                    <input type="text" className="form-control mb-2" placeholder="Day Title" value={d.title} onChange={(e) => updateDay(i, { title: e.target.value })} />
                    <textarea className="form-control mb-3" rows={2} placeholder="Description" value={d.description} onChange={(e) => updateDay(i, { description: e.target.value })} />

                    <div className="mb-3">
                      <label className="form-label">Add Attraction (single select)</label>
                      <div className="d-flex gap-2">
                        <select
                          className="form-select"
                          value={daySelects[i]?.attractionSelect || ""}
                          onChange={(e) => setDaySelects((prev) => { const c = [...prev]; c[i] = { ...(c[i] || {}), attractionSelect: e.target.value }; return c; })}
                        >
                          <option value="">{chooseListPlaceholder("Attraction")}</option>
                          {availableAttractions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                        <input type="text" className="form-control" placeholder="Start (09:00 AM)" value={daySelects[i]?.attractionStart || ""} onChange={(e) => setDaySelects((prev) => { const c = [...prev]; c[i] = { ...(c[i] || {}), attractionStart: e.target.value }; return c; })} />
                        <input type="text" className="form-control" placeholder="End (11:00 AM)" value={daySelects[i]?.attractionEnd || ""} onChange={(e) => setDaySelects((prev) => { const c = [...prev]; c[i] = { ...(c[i] || {}), attractionEnd: e.target.value }; return c; })} />
                        <button type="button" className="btn btn-outline-primary" onClick={() => addAttractionToDay(i)}>Add</button>
                      </div>
                      <input type="text" className="form-control mt-2" placeholder="Notes (optional)" value={daySelects[i]?.attractionNotes || ""} onChange={(e) => setDaySelects((prev) => { const c = [...prev]; c[i] = { ...(c[i] || {}), attractionNotes: e.target.value }; return c; })} />
                      {d.attractions?.length > 0 && (
                        <div className="mt-2">
                          {d.attractions.map((at: any, idx: number) => (
                            <div key={idx} className="d-flex justify-content-between align-items-start p-2 rounded border mb-2 bg-light">
                              <div>
                                <div className="fw-semibold">{at.attractionName}</div>
                                <div className="small">{at.startTime || ""} - {at.endTime || ""}</div>
                                {at.notes && <div className="small text-muted">{at.notes}</div>}
                              </div>
                              <button type="button" className="btn-close" onClick={() => removeAttractionFromDay(i, idx)}></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meals (pick restaurant for each meal)</label>
                      <div className="row g-2">
                        {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
                          <div key={meal} className="col-md-4">
                            <div className="d-flex gap-2">
                              <select className="form-select" value={daySelects[i]?.[meal === "breakfast" ? "mealBreakfastSelect" : meal === "lunch" ? "mealLunchSelect" : "mealDinnerSelect"] || ""}
                                onChange={(e) => setDaySelects((prev) => { const c = [...prev]; c[i] = { ...(c[i] || {}), [meal === "breakfast" ? "mealBreakfastSelect" : meal === "lunch" ? "mealLunchSelect" : "mealDinnerSelect"]: e.target.value }; return c; })}>
                                <option value="">{meal.charAt(0).toUpperCase() + meal.slice(1)}</option>
                                {availableRestaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                              </select>
                            </div>
                            <div className="d-flex gap-2 mt-2">
                              <input type="text" className="form-control" placeholder="Time (08:00 AM)" value={daySelects[i]?.[meal === "breakfast" ? "mealBreakfastTime" : meal === "lunch" ? "mealLunchTime" : "mealDinnerTime"] || ""} onChange={(e) => setDaySelects((prev) => { const c = [...prev]; c[i] = { ...(c[i] || {}), [meal === "breakfast" ? "mealBreakfastTime" : meal === "lunch" ? "mealLunchTime" : "mealDinnerTime"]: e.target.value }; return c; })} />
                              <button type="button" className="btn btn-outline-primary" onClick={() => setMealForDay(i, meal)}>Set</button>
                              <button type="button" className="btn btn-outline-secondary" onClick={() => clearMealFromDay(i, meal)}>Clear</button>
                            </div>

                            <div className="mt-2">
                              {d.meals && d.meals[meal] ? (
                                <div className="d-flex justify-content-between align-items-start p-2 rounded border bg-light">
                                  <div>
                                    <div className="fw-semibold">{d.meals[meal].restaurantName}</div>
                                    <div className="small">{d.meals[meal].time || ""}</div>
                                  </div>
                                  <button type="button" className="btn-close" onClick={() => clearMealFromDay(i, meal)}></button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Hotel Stay (select hotel for this city)</label>
                      <div className="d-flex gap-2">
                        <select className="form-select" value={daySelects[i]?.hotelSelect || ""} onChange={(e) => setDaySelects((prev) => { const c = [...prev]; c[i] = { ...(c[i] || {}), hotelSelect: e.target.value }; return c; })}>
                          <option value="">{chooseListPlaceholder("Hotel")}</option>
                          {availableHotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                        </select>
                        <input type="text" className="form-control" placeholder="Check-in (07:00 PM)" value={daySelects[i]?.hotelCheckIn || ""} onChange={(e) => setDaySelects((prev) => { const c = [...prev]; c[i] = { ...(c[i] || {}), hotelCheckIn: e.target.value }; return c; })} />
                        <input type="text" className="form-control" placeholder="Check-out (10:00 AM next day)" value={daySelects[i]?.hotelCheckOut || ""} onChange={(e) => setDaySelects((prev) => { const c = [...prev]; c[i] = { ...(c[i] || {}), hotelCheckOut: e.target.value }; return c; })} />
                        <button type="button" className="btn btn-outline-primary" onClick={() => setHotelForDay(i)}>Set</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => clearHotelFromDay(i)}>Clear</button>
                      </div>

                      {d.hotelStay && (
                        <div className="mt-2 d-flex justify-content-between align-items-start p-2 rounded border bg-light">
                          <div>
                            <div className="fw-semibold">{d.hotelStay.hotelName}</div>
                            <div className="small">{d.hotelStay.checkIn || ""} - {d.hotelStay.checkOut || ""}</div>
                          </div>
                          <button type="button" className="btn-close" onClick={() => clearHotelFromDay(i)}></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {[
            { label: "Inclusions", arr: inclusions, setArr: setInclusions },
            { label: "Exclusions", arr: exclusions, setArr: setExclusions },
            { label: "Tags", arr: tags, setArr: setTags },
            { label: "Best Time To Visit (months)", arr: bestTimeToVisit, setArr: setBestTimeToVisit },
          ].map((field, idx) => {
            return (
              <div key={idx} className="card border-0 shadow-sm mb-4">
                <div className="card-header fw-semibold">{field.label}</div>
                <div className="card-body">
                  <div className="d-flex gap-2">
                    <input type="text" className="form-control" placeholder={`Add ${field.label}`} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === ",") && text.trim()) {
                        e.preventDefault();
                        if (!field.arr.includes(text.trim())) field.setArr([...field.arr, text.trim()]);
                        setText("");
                      }
                    }} />
                    <button type="button" className="btn btn-outline-primary" onClick={() => { if (text.trim() && !field.arr.includes(text.trim())) { field.setArr([...field.arr, text.trim()]); setText(""); } }}>Add</button>
                  </div>

                  <div className="mt-2">
                    {field.arr.map((item, i) => (
                      <div key={i} className="d-flex justify-content-between align-items-start p-2 rounded border mb-2 bg-white">
                        <span>{item}</span>
                        <button type="button" className="btn-close" onClick={() => field.setArr(field.arr.filter((w) => w !== item))}></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header fw-semibold">Thumbnail</div>
            <div className="card-body">
              <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
              {thumbnail && (
                <div className="mt-3 text-center">
                  <img src={thumbnail} alt="Preview" className="rounded shadow-sm" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
                  <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={handleRemoveImage}>Remove</button>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success w-50 me-2 shadow-sm">{editData ? "Update Itinerary" : "Add Itinerary"}</button>
            <button type="button" className="btn btn-secondary w-50 shadow-sm" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
