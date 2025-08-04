// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAuthValue from "../hooks/useAuthValue";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const nav = useNavigate();
  const { user } = useAuthValue();
  const axiosSecure = useAxiosSecure();
  const [startDate, setStartDate] = useState(new Date());
  const handleAddJob = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValues = Object.fromEntries(formData.entries());
    const allFields = {
      ...inputValues,
      min_price: parseFloat(inputValues.min_price),
      max_price: parseFloat(inputValues.max_price),
      deadline: startDate,
      buyer: {
        email: user?.email,
        name: user?.displayName,
        photo: user?.photoURL,
      },
      bid_count: 0,
    };

    if (startDate < new Date()) {
      return toast.error(`Deadline can not be less or equal to today`);
    }

    if (
      parseFloat(inputValues.min_price) >= parseFloat(inputValues.max_price)
    ) {
      return toast.error("Minimum price must be less than maximum price");
    }
    try {
      const { data } = await axiosSecure.post(`/addJob`, allFields);
      if (data.insertedId) {
        toast.success(`Successfully Added Job!`);
        nav(`/my-posted-jobs`);
        e.target.reset();
      }
    } catch (err) {
      console.log(err);
      toast.error(`Can not add the job right now`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="flex justify-center items-center min-h-[calc(100vh-306px)] px-4 sm:px-6 lg:px-8 py-12 bg-gray-50"
    >
      <div className="w-full max-w-4xl p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          🚀 Post a New Job
        </h2>

        <form onSubmit={handleAddJob} className="space-y-6">
          {/* Grid Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="job_title"
                className="block text-sm font-medium text-gray-700"
              >
                Job Title
              </label>
              <input
                required
                id="job_title"
                name="job_title"
                type="text"
                placeholder="e.g. Frontend Developer"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="emailAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="emailAddress"
                readOnly
                value={user?.email}
                type="email"
                placeholder="your@email.com"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm outline-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deadline
              </label>
              <DatePicker
                minDate={new Date()}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                required
                name="category"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="Web Development">Web Development</option>
                <option value="Graphics Design">Graphics Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="min_price"
                className="block text-sm font-medium text-gray-700"
              >
                Minimum Price
              </label>
              <input
                required
                id="min_price"
                name="min_price"
                type="number"
                placeholder="$"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="max_price"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Price
              </label>
              <input
                required
                id="max_price"
                name="max_price"
                type="number"
                placeholder="$"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Job Description
            </label>
            <textarea
              required
              id="description"
              name="description"
              rows="5"
              placeholder="Write a clear and concise job description..."
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            ></textarea>
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed transition-all"
            >
              💾 Save Job
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddJob;
