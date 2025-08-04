import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuthValue from "../hooks/useAuthValue";
import toast from "react-hot-toast";

const MyPostedJobs = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuthValue();

  const {
    data: jobs = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myPostedJobs", user?.email],
    queryFn: () =>
      axiosSecure(`/posted-jobs/${user.email}`).then((res) => res.data),
    enabled: !!user?.email,
    refetchInterval: 5000,
  });

  const categoryBadge = (category) => {
    const styles = {
      "Web Development": "text-blue-600 bg-blue-100",
      "Graphics Design": "text-emerald-600 bg-emerald-100",
      "Digital Marketing": "text-yellow-600 bg-yellow-100",
    };
    return styles[category] || "text-gray-600 bg-gray-100";
  };

  const { mutateAsync } = useMutation({
    mutationFn: async ({ id }) => {
      const { data } = await axiosSecure.delete(`/job/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success(`🗑️ Successfully Removed`, {
        style: {
          border: "1px solid #3B82F6",
          padding: "12px 16px",
          color: "#1E3A8A",
        },
        iconTheme: {
          primary: "#3B82F6",
          secondary: "#D1FAE5",
        },
      });
      queryClient.invalidateQueries({
        queryKey: ["myPostedJobs", user?.email],
      });
    },
  });

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div
        className={`transition-all duration-300 ${
          t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } bg-white border-l-4 border-red-500 shadow-xl px-6 py-5 rounded-lg w-[320px]`}
      >
        <h3 className="font-semibold text-red-600 text-base flex items-center gap-2">
          ⚠️ Delete Confirmation
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          This job will be permanently removed.
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await mutateAsync({ id });
              } catch {
                toast.error("❌ Failed to delete.");
              }
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  if (isPending) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-center text-red-600 font-semibold my-5">
        ❌ Failed to load jobs: {error?.message || "Unknown error"}
      </p>
    );

  return (
    <section className="container px-4 mx-auto pt-12 min-h-[60vh]">
      <div className="flex items-center gap-x-3 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">My Posted Jobs</h2>
        <span className="px-3 py-1 text-sm text-white bg-blue-600 rounded-full">
          {jobs.length} Job{jobs.length !== 1 && "s"}
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 p-8 rounded-xl text-center shadow-md">
          <h3 className="text-2xl font-bold text-blue-700">🚫 No Jobs Posted</h3>
          <p className="mt-2 text-sm text-blue-600">
            You haven’t posted anything yet. Time to show your first job to the
            world!
          </p>
          <Link
            to="/add-job"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Post a Job
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700 font-medium">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      {[
                        "Title",
                        "Deadline",
                        "Price Range",
                        "Category",
                        "Description",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-4 py-3.5 text-sm font-semibold text-left"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr
                        key={job._id}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-4 text-gray-800 whitespace-nowrap">
                          {job.job_title}
                        </td>
                        <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                          {new Date(job.deadline).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                          ${job.min_price} - ${job.max_price}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${categoryBadge(
                              job.category
                            )}`}
                          >
                            {job.category}
                          </span>
                        </td>
                        <td
                          className="px-4 py-4 text-gray-500 whitespace-nowrap"
                          title={job.description}
                        >
                          {job.description.length > 30
                            ? `${job.description.slice(0, 30)}...`
                            : job.description}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-x-4">
                            <button
                              onClick={() => handleDelete(job._id)}
                              className="text-red-500 hover:text-red-700 transition"
                              title="Delete"
                            >
                              🗑️
                            </button>
                            <Link
                              to={`/update/${job._id}`}
                              className="text-yellow-500 hover:text-yellow-600 transition"
                              title="Edit"
                            >
                              ✏️
                            </Link>
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

export default MyPostedJobs;
