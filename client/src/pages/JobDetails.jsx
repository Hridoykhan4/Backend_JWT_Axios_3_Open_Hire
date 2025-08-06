import { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthValue from "../hooks/useAuthValue";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import useScrollTo from "../hooks/useScrollTo";

const JobDetails = () => {
  const axiosSecure = useAxiosSecure();
  const nav = useNavigate();
  const { id } = useParams();
  const { user } = useAuthValue();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState(new Date());
  useScrollTo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    data: job = {},
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobDetails", id],
    queryFn: () => axiosSecure(`/job/${id}`).then((res) => res.data),
  });

  if (isPending) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-center text-red-600 font-semibold my-5">
        ❌ Failed to load job: {error?.message || "Unknown error"}
      </p>
    );

  /* ✅ Handle Bid Form Submit */
  const onSubmit = async (data) => {
    const { bid_price, comment } = data;

    if (!user?.email) {
      return toast.error("User email not found. Please log in again.");
    }

    if (user?.email === job?.buyer?.email) {
      return toast.error("Can not bid in your own posted job", {
        position: "top-right",
      });
    }

    const formData = {
      bid_price: parseFloat(bid_price),
      jobId: id,
      job_title: job?.job_title || "Untitled",
      category: job?.category || "Uncategorized",
      status: "Pending",
      comment,
      bidder_email: user?.email,
      deadline: startDate,
      buyer: {
        email: job?.buyer?.email || "Unknown",
        name: job?.buyer?.name || "Unknown",
        photo: job?.buyer?.photo || "",
      },
    };

    if (formData.deadline && job?.deadline) {
      const newDate = new Date(formData.deadline).toISOString().split("T")[0];
      const jobDate = new Date(job.deadline).toISOString().split("T")[0];

      if (newDate > jobDate) {
        return toast.error("Deadline cannot exceed the buyer's deadline.");
      }
    }

    if (formData.bid_price > job?.max_price) {
      return toast.error("Bid Price should be within budget range");
    }

    try {
      const { data: addedBidStatus } = await axiosSecure.post(
        `/add-bid`,
        formData
      );
      console.log(addedBidStatus);
      if (addedBidStatus.insertedId) {
        toast.success("Bid placed successfully!");
        queryClient.invalidateQueries({ queryKey: ["jobsAllData"] });
        queryClient.invalidateQueries({ queryKey: ["allJobs"] });
        queryClient.invalidateQueries({ queryKey: ["bid-requests"] });
        refetch();
        nav("/my-bids");
      }
      reset();
    } catch (err) {
      if (err?.status === 409 || err) {
        console.log(err);
        toast.error(err?.response?.data?.message || "Already bids");
        nav("/");
        reset();
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-around gap-5 items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto">
      {/* === Job Details === */}
      <div className="flex-1 px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-light text-gray-800">
            Deadline:{" "}
            {new Date(job?.deadline).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full">
            {job?.category || "UnCategorized"}
          </span>
        </div>

        <h1 className="mt-2 text-3xl font-semibold text-gray-800">
          {job?.job_title}
        </h1>

        <p className="mt-2 text-lg text-gray-600">{job?.description}</p>

        <div className="mt-6">
          <p className="text-sm font-bold text-gray-600">Buyer Details:</p>
          <div className="flex items-center gap-5 mt-2">
            <div>
              <p className="text-sm text-gray-600">
                Name: {job?.buyer?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Email: {job?.buyer?.email || "N/A"}
              </p>
            </div>
            {job?.buyer?.photo && (
              <div className="rounded-full overflow-hidden w-14 h-14">
                <img
                  referrerPolicy="no-referrer"
                  src={job.buyer.photo}
                  alt={job.job_title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-lg font-bold text-gray-600">
          Range: ${job?.min_price} - ${job?.max_price}
        </p>
      </div>

      {/* === Place A Bid Form === */}
      <section className="p-6 w-full bg-white rounded-md shadow-md flex-1 md:min-h-[350px]">
        <h2 className="text-lg font-semibold text-gray-700">Place A Bid</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            {/* Price */}
            <div>
              <label className="text-gray-700" htmlFor="price">
                Price
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register("bid_price", {
                  required: "Bid price is required",
                  min: {
                    value: job.min_price,
                    message: `Price must be more than or equal to ${job.min_price}`,
                  },
                })}
                defaultValue={job?.min_price}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
              />
              {errors.bid_price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.bid_price.message}
                </p>
              )}
            </div>

            {/* Email (Disabled) */}
            <div>
              <label className="text-gray-700">Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="text-gray-700" htmlFor="comment">
                Comment
              </label>
              <input
                id="comment"
                type="text"
                {...register("comment", {
                  required: "Comment is required",
                  minLength: {
                    value: 3,
                    message: "Comment must be at least 3 characters",
                  },
                })}
                placeholder="Say something about your bid"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
              />
              {errors.comment && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.comment.message}
                </p>
              )}
            </div>

            {/* Date Picker */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700">Deadline</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="border p-2 rounded-md"
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={job?.buyer?.email === user?.email}
              className={`relative px-8 py-2.5 rounded-md text-white font-semibold transition-all duration-300 ease-in-out
      ${
        job?.buyer?.email === user?.email
          ? "bg-red-500 cursor-not-allowed opacity-70"
          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      }
    `}
            >
              {job?.buyer?.email === user?.email ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-white animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Bidding Own Job
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-white transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Place Bid
                </span>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default JobDetails;
