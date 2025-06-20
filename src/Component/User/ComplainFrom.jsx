import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  submitReport,
  fetchProfile,
} from "../../ReduxState/Users/Action/Action";
import MobileHeader from "./U_MobileHeader";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const LocationPicker = ({ setCoordinates }) => {
  useMapEvents({
    click(e) {
      setCoordinates(e.latlng);
    },
  });
  return null;
};

const ComplainForm = () => {
  const dispatch = useDispatch();
  const {
    loading: issueLoading,
    error: issueError,
    success,
  } = useSelector((state) => state.issues);
  const {
    loading: profileLoading,
    error: profileError,
    profile,
  } = useSelector((state) => state.userProfile);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    address: "",
    title: "",
    description: "",
    reportImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const complaintTitles = [
    "Water Supply Issue",
    "Electricity Problem",
    "Garbage Collection",
    "Public Safety",
    "Noise Pollution",
    "Traffic Management",
    "Corruption",
    "Environment",
    "Public Nuisance",
  ];

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
      },
      () => {
        setCoordinates({ lat: 28.6139, lng: 77.209 }); // fallback: Delhi
      }
    );
  }, []);

  useEffect(() => {
    if (!coordinates) return;

    const fetchLocation = async () => {
      setIsLoadingAddress(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}`
        );
        const data = await res.json();
        const location = data.display_name || "";
        setFormData((prev) => ({ ...prev, location }));
      } catch (err) {
        setFormError("Failed to fetch address. You may enter it manually.");
      } finally {
        setIsLoadingAddress(false);
      }
    };

    fetchLocation();
  }, [coordinates]);

  useEffect(() => {
    if (success) {
      setFormSuccess("Complaint submitted successfully!");
      setFormData({
        name: profile?.name || "",
        email: profile?.email || "",
        phoneNumber: profile?.phoneNumber || "",
        location: "",
        address: "",
        title: "",
        description: "",
        reportImage: null,
      });
      setImagePreview(null);
      setCoordinates(null);
      window.location.reload();
    }

    if (issueError) setFormError(issueError);
    if (profileError) setFormError(profileError);
  }, [success, issueError, profileError, profile]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "reportImage" && files[0]) {
      setFormData((prev) => ({ ...prev, reportImage: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, reportImage: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.title ||
      !formData.description
    ) {
      setFormError(
        "Please fill out all required fields and select a complaint type."
      );
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("phoneNumber", formData.phoneNumber || "");
    submissionData.append("address", formData.address || "");
    submissionData.append("location", formData.location || "");
    submissionData.append("title", formData.title);
    submissionData.append("description", formData.description);

    if (formData.reportImage) {
      submissionData.append("reportImage", formData.reportImage);
    }

    if (coordinates) {
      submissionData.append("latitude", coordinates.lat);
      submissionData.append("longitude", coordinates.lng);
    }

    await dispatch(submitReport(submissionData));
  };

  const handleReset = () => {
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
      phoneNumber: profile?.phoneNumber || "",
      location: "",
      address: "",
      title: "",
      description: "",
      reportImage: null,
    });
    setImagePreview(null);
    setCoordinates(null);
    setFormError("");
    setFormSuccess("");
  };

  return (
    <div>
      <MobileHeader />

      <div className="mt-10 sm:mt-0 pb-10 sm:pb-0">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-5xl mx-auto ">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">
              Register Your Complaint
            </h2>
            <p className="text-gray-300 text-sm md:text-base">
              Fill out the form below. Fields marked * are required.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg shadow-inner rounded-xl p-4 sm:p-6 md:p-8">
            {profileLoading && (
              <p className="text-gray-400 text-center text-sm md:text-base">
                Loading profile...
              </p>
            )}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="flex flex-col gap-4 sm:gap-6">
                {[
                  { name: "name", required: true },
                  { name: "email", required: true },
                  { name: "phoneNumber", required: false },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-gray-200 text-sm md:text-base font-medium mb-1">
                      {field.name === "phoneNumber"
                        ? "Phone Number"
                        : field.name.charAt(0).toUpperCase() +
                          field.name.slice(1)}{" "}
                      {field.required && "*"}
                    </label>
                    <input
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required={field.required}
                      placeholder={`Enter your ${field.name}`}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-gray-200 text-sm md:text-base font-medium mb-1">
                    Nearby Landmark
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. near town hall"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm md:text-base transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-200 text-sm md:text-base font-medium mb-1">
                    Auto-filled Location{" "}
                    {isLoadingAddress && (
                      <span className="text-xs text-gray-400">
                        (Loading...)
                      </span>
                    )}
                  </label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm md:text-base transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-200 text-sm md:text-base font-medium mb-1">
                    Complaint Type *
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled className="text-gray-800">
                      Select a type
                    </option>
                    {complaintTitles.map((title) => (
                      <option
                        key={title}
                        value={title}
                        className="text-gray-800"
                      >
                        {title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-200 text-sm md:text-base font-medium mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] sm:min-h-[100px] resize-y"
                    placeholder="Describe your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-200 text-sm md:text-base font-medium mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    name="reportImage"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full text-white text-sm md:text-base file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 sm:file:px-5 sm:file:py-3 file:font-medium file:min-w-[120px]"
                  />
                </div>

                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-24 sm:h-32 md:h-40 object-contain rounded-md border border-white/20"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 sm:p-3 text-sm min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-200 text-sm md:text-base font-medium mb-1">
                  Select Location on Map
                </label>
                <div className="h-40 sm:h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden border border-white/20">
                  {coordinates ? (
                    <MapContainer
                      center={[coordinates.lat, coordinates.lng]}
                      zoom={13}
                      className="h-full w-full"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationPicker setCoordinates={setCoordinates} />
                      <Marker
                        position={[coordinates.lat, coordinates.lng]}
                        icon={customIcon}
                      />
                    </MapContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm md:text-base">
                      Loading map...
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={issueLoading || profileLoading}
                  className={`w-full sm:w-auto sm:min-w-[160px] px-4 py-3 sm:px-6 sm:py-3 rounded-lg shadow-sm text-sm md:text-base font-medium text-white transition-all duration-200 ${
                    issueLoading || profileLoading
                      ? "bg-gray-500 opacity-50 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                  }`}
                >
                  {issueLoading ? "Submitting..." : "Submit Complaint"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto sm:min-w-[160px] px-4 py-3 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white text-sm md:text-base font-medium rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-gray-500"
                >
                  Reset
                </button>
              </div>
            </form>

            {formError && (
              <p
                className="mt-4 text-red-400 text-sm md:text-base text-center"
                aria-live="polite"
              >
                {formError}
              </p>
            )}
            {formSuccess && (
              <p
                className="mt-4 text-green-400 text-sm md:text-base text-center"
                aria-live="polite"
              >
                {formSuccess}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplainForm;
