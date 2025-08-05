import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuthValue from "../hooks/useAuthValue";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
const BidRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuthValue();

  const categoryBadge = (category) => {
    const categorySample = {
      "Web Development": " text-blue-500 bg-blue-100/60",
      "Graphics Design": " text-red-500 bg-red-100/60",
      "Digital Marketing": " text-emerald-500 bg-emerald-100/60",
    };
    return categorySample[category];
  };

  const {
    data: jobs = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["bid-requests", user?.email],
    queryFn: () =>
      axiosSecure(`/bid-requests/${user.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

    const { mutateAsync } = useMutation({
        mutationFn: async ({ id, status }) => {
        const { data } = await axiosSecure.patch(`/update-status/${id}`, {
            status,
        });
        if (data?.modifiedCount) {
            toast.success(`Updated status to ${status}`);
        }
        return data;
        },
        onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ["bid-requests"],
        });
        queryClient.invalidateQueries({ queryKey: ["myBids"] });
        },
    });

  const handleStatus = async (id, prevStatus, status) => {
    if (prevStatus === status) return;
    await mutateAsync({ id, status });
    // const { data } = await axiosSecure.patch(`/update-status/${id}`, { status });
  };

  if (isPending) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-center text-red-600 font-semibold my-5">
        ❌ Failed to load jobs: {error?.message || "Unknown error"}
      </p>
    );

  return (
    <section className="container px-4 mx-auto my-12">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium text-gray-800 ">Bid Requests</h2>

        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full ">
          {jobs?.length} Requests
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 p-8 rounded-xl text-center shadow-md">
          <h3 className="text-2xl font-bold text-blue-700">🚫 No Bided Jobs</h3>
          <p className="mt-2 text-sm text-blue-600">
            You don't have any bid requests!!
          </p>
        </div>
      ) : (
        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200  md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Title",
                        "Deadline",
                        "Price",
                        "Category",
                        "Status",
                        "Actions",
                      ].map((title) => (
                        <th
                          key={title}
                          scope="col"
                          className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500"
                        >
                          <div className="flex items-center gap-x-3">
                            <span>{title}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 ">
                    {jobs?.map((job) => (
                      <tr key={job._id}>
                        <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                          {job?.job_title}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                          {new Date(job?.deadline).toLocaleDateString("en-GB")}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                          ${job?.bid_price}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-2">
                            <p
                              className={`px-3 py-1  ${categoryBadge(
                                job?.category
                              )} text-xs  rounded-full`}
                            >
                              {job?.category}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div
                            className={`inline-flex ${
                              job?.status === "Pending" &&
                              "bg-yellow-100/60 text-yellow-500"
                            }
                            ${
                              job?.status === "In Progress" &&
                              "bg-emerald-100/60 text-emerald-500"
                            }
                            ${
                              job?.status === "Rejected" &&
                              "bg-red-100/60 text-red-500"
                            } items-center px-3 py-1 rounded-full gap-x-2`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full bg-yellow-500 `}
                            ></span>
                            <h2 className="text-sm font-normal ">
                              {job?.status}
                            </h2>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-6">
                            <button
                                disabled={job?.status === 'Completed'}
                              onClick={() =>
                                handleStatus(
                                  job?._id,
                                  job?.status,
                                  "In Progress"
                                )
                              }
                              className="disabled:cursor-not-allowed text-gray-500 transition-colors duration-200   hover:text-red-500 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m4.5 12.75 6 6 9-13.5"
                                />
                              </svg>
                            </button>

                            <button
                                disabled={job?.status === 'Completed'}
                              onClick={() =>
                                handleStatus(job?._id, job?.status, "Rejected")
                              }
                              className="disabled:cursor-not-allowed text-gray-500 transition-colors duration-200   hover:text-yellow-500 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BidRequests;
