import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Framer-enabled Link

const JobCard = ({ job = {} }) => {
  const MotionLink = motion.create(Link);
  return (
    <MotionLink
      to={`/job/${job?._id}`}
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      // whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      // whileHover={{ scale: 1.03 }}
      // whileTap={{ scale: 0.98 }}
      className="group w-full max-w-sm px-6 py-6 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-blue-300 transition-all duration-300"
    >
      {/* Buyer Info */}
      <div className="flex items-center flex-wrap gap-4 justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={job?.buyer?.photo}
            referrerPolicy="no-referrer"
            alt={job?.buyer?.name}
            className="w-11 h-11 rounded-full object-cover border border-gray-200"
          />
          <div className="text-xs text-gray-700">
            <p className="font-semibold">{job?.buyer?.name}</p>
            <p className="text-gray-500">{job?.buyer?.email}</p>
          </div>
        </div>

        <span className="text-[10px] uppercase px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full font-semibold tracking-wide shadow-sm">
          {job?.category || "General"}
        </span>
      </div>

      {/* Deadline */}
      <div className="mb-3 text-xs text-gray-600">
        📅 Deadline:{" "}
        <span className="text-gray-800 font-medium">
          {new Date(job?.deadline).toLocaleDateString("en-GB")}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
        {job?.job_title}
      </h2>

      {/* Price & Bids */}
      <div className="mt-5 space-y-2 text-sm text-gray-700">
        <p className="font-medium">
          💰 Budget Range:{" "}
          <span className="text-gray-900 font-semibold">
            ${job?.min_price} - ${job?.max_price}
          </span>
        </p>
        <p className="font-medium">
          📊 Total Bids:{" "}
          <span className="text-gray-900 font-semibold">
            {job?.bid_count || 0}
          </span>
        </p>
      </div>
    </MotionLink>
  );
};

export default JobCard;
