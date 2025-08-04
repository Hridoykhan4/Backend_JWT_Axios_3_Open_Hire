import { useQuery } from "@tanstack/react-query";
import JobCard from "./JobCard";
import LoadingSpinner from "./LoadingSpinner";
import React from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
const categories = ["Web Development", "Graphics Design", "Digital Marketing"];
const TabCategories = () => {
  const axiosSecure = useAxiosSecure();
  const {
    data: jobs = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["allJobs"],
    queryFn: () => axiosSecure(`/jobs`).then((res) => res.data),
    retry: 4,
  });

  const renderTabContent = (category) => (
    <div className="tab-content bg-base-100 border-base-300 p-6">
      <div className="grid overflow-hidden grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {jobs
          .filter((j) => j.category === category)
          .map((job) => (
            <JobCard job={job} key={job._id}></JobCard>
          ))}
      </div>
    </div>
  );

  if (isPending) return <LoadingSpinner></LoadingSpinner>;
  if (error || isError)
    return (
      <p className="text-center my-4 text-red-700 font-semibold">
        Failed to load data! {error?.message || "Unknown error occurred."}
      </p>
    );
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
      <div className="tabs justify-center items-center flex-wrap tabs-box">
        {categories.map((category, i) => (
          <React.Fragment key={category}>
            <input
              type="radio"
              name="my_tabs_6"
              className="tab"
              aria-label={category}
              defaultChecked={i === 0}
            />
            {renderTabContent(category)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TabCategories;
