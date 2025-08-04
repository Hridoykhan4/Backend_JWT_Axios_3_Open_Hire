import { useQuery } from "@tanstack/react-query";
import JobCard from "./JobCard";
import LoadingSpinner from "./LoadingSpinner";

const TabCategories = () => {
  const {
    data: jobs = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["allJobs"],
    queryFn: () =>
      fetch(`http://localhost:5000/jobs`).then((res) => res.json()),
    retry: 4,
  });

  if (isPending) return <LoadingSpinner></LoadingSpinner>;
  return (
    <div className="mt-5">
      <div>
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl ">
          Browse Jobs By Categories
        </h1>

        <p className="max-w-2xl mx-auto my-4 text-center text-gray-500 ">
          Three categories available for the time being. They are Web
          Development, Graphics Design and Digital Marketing. Browse them by
          clicking on the tabs below.
        </p>
      </div>

      {/* Tabs */}
      {/* name of each tab group should be unique */}
      <div className="tabs justify-center items-center flex-wrap tabs-box">
        <input
          type="radio"
          name="my_tabs_6"
          className="tab"
          aria-label="Web Development"
          defaultChecked
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobs
              .filter((j) => j.category === "Web Development")
              .map((job) => (
                <JobCard job={job} key={job._id}></JobCard>
              ))}
          </div>
        </div>

        <input
          type="radio"
          name="my_tabs_6"
          className="tab"
          aria-label="Graphics Design"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobs
              .filter((j) => j.category === "Graphics Design")
              .map((job) => (
                <JobCard job={job} key={job._id}></JobCard>
              ))}
          </div>
        </div>

        <input
          type="radio"
          name="my_tabs_6"
          className="tab"
          aria-label="Digital Marketing"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobs
              .filter((j) => j.category === "Digital Marketing")
              .map((job) => (
                <JobCard job={job} key={job._id}></JobCard>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabCategories;
