import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";
import JobCard from "../components/JobCard";

const AllJobs = () => {
  const axiosSecure = useAxiosSecure();
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const {
    data: jobs = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobsAllData", filter, sort, search],
    queryFn: async () => {
      const { data } = await axiosSecure(
        `/jobs?filter=${filter}&search=${search}&sort=${sort}`
      );
      return data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchText);
  };

  const handleReset = () => {
    setFilter("");
    setSort("");
    setSearchText("");
    setSearch("");
  };

  if (isPending) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-center my-4 text-red-700 font-semibold">
        Failed to load data! {error?.message || "Unknown error"}
      </p>
    );

  return (
    <div className="container px-6 py-10 mx-auto min-h-[calc(100vh-306px)]">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 flex-wrap mb-10">
        {/* Filter */}
        <select
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
          className="border p-3 rounded-md w-full md:w-auto"
        >
          <option value="">Filter By Category</option>
          <option value="Web Development">Web Development</option>
          <option value="Graphics Design">Graphics Design</option>
          <option value="Digital Marketing">Digital Marketing</option>
        </select>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border p-3 rounded-l-md w-full md:w-64"
            type="text"
            placeholder="Search job title..."
          />
          <button className="bg-gray-700 text-white px-4 rounded-r-md hover:bg-gray-600">
            Search
          </button>
        </form>

        {/* Sort */}
        <select
          onChange={(e) => setSort(e.target.value)}
          value={sort}
          className="border p-3 rounded-md w-full md:w-auto"
        >
          <option value="">Sort By Deadline</option>
          <option value="asc">Ascending</option>
          <option value="dsc">Descending</option>
        </select>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
        >
          Reset
        </button>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found!</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJobs;
