import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAuthValue from "../hooks/useAuthValue";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useEffect } from "react";
import toast from "react-hot-toast";
const UpdateJob = () => {
  const axiosSecure = useAxiosSecure();
  const [startDate, setStartDate] = useState(new Date());
  const { user } = useAuthValue();
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const {
    data: job = {},
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["updateJobs", id],
    queryFn: () => axiosSecure(`/job/${id}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, allFields }) => {
      try {
        const { data } = await axiosSecure.put(`/updateJob/${id}`, allFields);
        if (data?.modifiedCount) {
          toast.success(`Successfully Updated Job!`);
          nav(`/my-posted-jobs`);
        }
        return data;
      } catch (err) {
        console.log(err);
        toast.error(`Can not add the job right now`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["updateJobs", id] });
    },
  });

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValues = Object.fromEntries(formData.entries());
    if (startDate < new Date()) {
      return toast.error(`Deadline can not be less or equal to today`);
    }

    if (
      parseFloat(inputValues.min_price) >= parseFloat(inputValues.max_price)
    ) {
      return toast.error("Minimum price must be less than maximum price");
    }
    const allFields = {
      ...inputValues,
      min_price: parseFloat(inputValues.min_price),
      max_price: parseFloat(inputValues.max_price),
      deadline: startDate,
      buyer: {
        email: job?.buyer?.email,
        name: job?.buyer?.name,
        photo: job?.buyer?.photo,
      },
      bid_count: job?.bid_count,
    };

    await mutateAsync({ id, allFields });
  };

  useEffect(() => {
    if (job?.deadline) {
      setStartDate(new Date(job?.deadline));
    }
  }, [job?.deadline]);

  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-red-600">
        ❌ Failed to load job: {error.message}
      </div>
    );
  }

  
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-306px)] bg-gray-50 px-4 py-10">
      <section className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-10 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ✏️ Update a Job
        </h2>

        <form onSubmit={handleUpdateJob}>
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
                required
                defaultValue={job?.job_title}
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
                // type="email"
                // name="email"
                disabled
                defaultValue={user?.email}
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
                required
                defaultValue={job?.category}
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
                required
                defaultValue={job?.min_price}
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
                required
                defaultValue={job?.max_price}
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
              required
              defaultValue={job?.description}
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
