import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAuthValue from "../hooks/useAuthValue";

const UpdateJob = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { user } = useAuthValue();
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-306px)] bg-gray-50 px-4 py-10">
      <section className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-10 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ✏️ Update a Job
        </h2>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label
                className="block mb-1 font-medium text-gray-700"
                htmlFor="job_title"
              >
                Job Title
              </label>
              <input
                id="job_title"
                name="job_title"
                type="text"
                className="w-full input input-bordered"
                placeholder="Enter job title"
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="block mb-1 font-medium text-gray-700"
                htmlFor="emailAddress"
              >
                Email Address
              </label>
              <input
                // id="emailAddress"
                type="email"
                name="email"
                disabled
                value={user?.email}
                className="w-full input input-bordered bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Deadline
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="w-full input input-bordered"
              />
            </div>

            {/* Category */}
            <div>
              <label
                className="block mb-1 font-medium text-gray-700"
                htmlFor="category"
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                className="w-full select select-bordered"
              >
                <option value="Web Development">Web Development</option>
                <option value="Graphics Design">Graphics Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label
                className="block mb-1 font-medium text-gray-700"
                htmlFor="min_price"
              >
                Minimum Price
              </label>
              <input
                id="min_price"
                name="min_price"
                type="number"
                placeholder="$0"
                className="w-full input input-bordered"
              />
            </div>

            {/* Max Price */}
            <div>
              <label
                className="block mb-1 font-medium text-gray-700"
                htmlFor="max_price"
              >
                Maximum Price
              </label>
              <input
                id="max_price"
                name="max_price"
                type="number"
                placeholder="$1000"
                className="w-full input input-bordered"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="textarea textarea-bordered w-full min-h-[120px]"
              placeholder="Describe the job in detail..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button type="submit" className="btn btn-primary px-8">
              💾 Save Changes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UpdateJob;
