import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  updateProfile,
} from "../../ReduxState/Users/Action/Action";
import MobileHeader from "./U_MobileHeader";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}) => {
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="block text-sm md:text-base font-medium text-gray-200 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm md:text-base transition-all"
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  );
};

const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.userProfile);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    role: "ROLE_USER",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);

  const defaultImage =
    "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.svg";

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.name || "",
        email: profile.email || "",
        phone: profile.phoneNumber || "",
        address: profile.address || "Delhi, India",
        role: profile.role || "ROLE_USER",
        bio: profile.bio || "",
      });
      // Set initial preview image from profile or fallback
      const initialImage =
        profile.picture && profile.picture !== ""
          ? profile.picture
          : defaultImage;
      setPreviewImage(initialImage);
    }
  }, [profile]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is not set");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file (e.g., PNG, JPEG).");
        return;
      }
      console.log("Selected file:", file.name, file.type, file.size);
      setImageLoading(true);
      const objectUrl = URL.createObjectURL(file);
      setProfileImage(file);
      setPreviewImage(objectUrl);
      setImageLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      username: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phoneNumber || "",
      address: profile?.address || "Delhi, India",
      role: profile?.role || "ROLE_USER",
      bio: profile?.bio || "",
    });
    setProfileImage(null);
    setPreviewImage(profile?.picture || defaultImage);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    const data = new FormData();
    data.append("name", formData.username);
    data.append("email", formData.email);
    data.append("phoneNumber", formData.phone);
    data.append("address", formData.address);
    data.append("role", formData.role);
    data.append("bio", formData.bio);
    if (profileImage) {
      console.log("Appending picture:", profileImage.name, profileImage.type);
      data.append("picture", profileImage);
    }

    for (let [key, value] of data.entries()) {
      console.log(`FormData: ${key} =`, value);
    }

    try {
      const response = await dispatch(updateProfile(data));
      console.log("Update response:", response);
      if (response.meta.requestStatus === "fulfilled") {
        setSuccessMessage("Profile updated successfully");
        setErrorMessage("");
        setProfileImage(null);
        const newPicture = response.payload?.picture;
        setPreviewImage(newPicture || defaultImage);
        if (!newPicture && profileImage) {
          setErrorMessage("Profile updated, but image upload failed.");
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setErrorMessage(
          response.payload?.message ||
            response.payload?.error ||
            "Failed to update profile. Please try again."
        );
      }
    } catch (err) {
      console.error("Update error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-white">Loading profile...</div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div>
      <MobileHeader />
      <div className="mt-10 sm:mt-0 pb-10 sm:pb-0">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">
              Update Your Profile
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Fill out the form below to update your profile information. Fields
              marked with * are required.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg shadow-inner rounded-xl p-4 sm:p-6 md:p-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {imageLoading ? (
                  <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full bg-gray-600 flex items-center justify-center text-white">
                    Loading...
                  </div>
                ) : (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="mx-auto h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full object-cover border border-white/20"
                    onError={(e) => {
                      console.error("Image load error:", e);
                      e.target.src = defaultImage;
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-8 h-8"
                  aria-label="Change profile picture"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  name="profilepic"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="flex flex-col gap-4 sm:gap-6">
                <InputField
                  label="User Name"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                />
                <InputField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                />
              </div>

              <div className="flex flex-col gap-4 sm:gap-6">
                <InputField
                  label="Role"
                  name="role"
                  value={formData.role}
                  disabled
                />
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm md:text-base font-medium text-gray-200 mb-1"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-base placeholder-gray-400 transition-all min-h-[100px] sm:min-h-[120px] resize-y"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="submit"
                  disabled={loading || imageLoading}
                  className={`w-full sm:w-auto sm:min-w-[200px] py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm md:text-base font-medium rounded-lg shadow-sm hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    loading || imageLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading || imageLoading ? "Updating..." : "Update Profile"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset form"
                  className="w-full sm:w-auto px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white text-sm md:text-base font-medium rounded-lg shadow-sm transition-all duration-200"
                >
                  Reset
                </button>
              </div>

              {errorMessage && (
                <div className="text-red-500 text-sm md:text-base text-center mt-4">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="text-green-500 text-sm md:text-base text-center mt-4">
                  {successMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
