import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { viewComplain } from "../../ReduxState/Admin/Actions/Action";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StatusBadge = ({ status }) => {
  const colorMap = {
    pending: "bg-yellow-500/20 text-yellow-200 ring-yellow-500/50",
    resolved: "bg-green-500/20 text-green-200 ring-green-500/50",
    inprogress: "bg-blue-500/20 text-blue-200 ring-blue-500/50",
    rejected: "bg-red-500/20 text-red-200 ring-red-500/50",
  };

  return (
    <span
      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ring-1 transition-all duration-300 hover:ring-2 ${
        colorMap[status.toLowerCase()] ||
        "bg-gray-500/20 text-gray-200 ring-gray-500/50"
      }`}
      aria-label={`Status: ${status}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
};

const A_ViewComplain = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const complaintDetails = useSelector(
    (state) => state.issueList.selectedIssue
  );

  useEffect(() => {
    dispatch(viewComplain(id));
  }, [dispatch, id]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Complaint Details", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);

    const tableData = [
      ["Title", complaintDetails.title || "N/A"],
      ["User", complaintDetails.name || "N/A"],
      ["Email", complaintDetails.email || "N/A"],
      ["Status", complaintDetails.status || "N/A"],
      ["Location", complaintDetails.location || "N/A"],
      [
        "Created At",
        complaintDetails.createdAt
          ? new Date(complaintDetails.createdAt).toLocaleString()
          : "N/A",
      ],
      [
        "Description",
        complaintDetails.description || "No description provided.",
      ],
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Details"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // If image exists, load and embed
    if (complaintDetails.picture) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = complaintDetails.picture;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL("image/jpeg");
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 28;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addPage();
        doc.text("Complaint Image", 14, 20);
        doc.addImage(imgData, "JPEG", 14, 30, pdfWidth, pdfHeight);
        doc.save(`Complaint_${id}.pdf`);
      };

      img.onerror = () => {
        console.warn("Image failed to load, exporting PDF without image.");
        doc.save(`Complaint_${id}.pdf`);
      };
    } else {
      doc.save(`Complaint_${id}.pdf`);
    }
  };

  if (!complaintDetails) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl text-white text-sm sm:text-base">
          Loading complaint details...
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 px-2 sm:px-4 md:px-6 lg:px-8 animate-fade"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white/10 backdrop-blur-lg w-full max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] p-4 sm:p-6 md:p-8 transform scale-100 transition-all duration-500 border border-gray-300/30">
        <button
          onClick={() => navigate("/admin/myIssue")}
          className="absolute top-4 right-4 bg-gray-700/50 rounded-full p-2 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 min-w-[36px] sm:min-w-[40px] min-h-[36px] sm:min-h-[40px]"
          aria-label="Close complaint details"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white truncate">
            {complaintDetails.title}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">
            {new Date(complaintDetails.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm md:text-base text-gray-300">
          <p>
            <strong className="text-white font-semibold">User:</strong>{" "}
            <span className="break-words">
              {complaintDetails.name || "N/A"}
            </span>
          </p>
          <p>
            <strong className="text-white font-semibold">Email:</strong>{" "}
            <span className="break-words">
              {complaintDetails.email || "N/A"}
            </span>
          </p>
          <p>
            <strong className="text-white font-semibold">Status:</strong>{" "}
            <StatusBadge status={complaintDetails.status.toLowerCase()} />
          </p>
          <p>
            <strong className="text-white font-semibold">Location:</strong>{" "}
            <span className="break-words">
              {complaintDetails.location || "N/A"}
            </span>
          </p>
          <p className="whitespace-pre-line">
            <strong className="text-white font-semibold">Description:</strong>{" "}
            <span className="break-words">
              {complaintDetails.description || "No description provided."}
            </span>
          </p>
          {complaintDetails.picture && (
            <div>
              <strong className="text-white font-semibold block mb-2">
                Image:
              </strong>
              <img
                src={complaintDetails.picture}
                alt={`Complaint ${complaintDetails.title}`}
                className="max-w-full h-24 sm:h-32 md:h-48 lg:h-64 object-contain rounded-lg border border-gray-600 shadow-sm"
                loading="lazy"
              />
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-6 flex justify-end space-x-2 sm:space-x-3">
          <button
            onClick={exportToPDF}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 text-xs sm:text-sm"
            aria-label="Export to PDF"
          >
            Export to PDF
          </button>
          <button
            onClick={() => navigate("/admin/myIssue")}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 text-xs sm:text-sm"
            aria-label="Close complaint details"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default A_ViewComplain;
