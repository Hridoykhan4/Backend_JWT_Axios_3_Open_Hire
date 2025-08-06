import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";
import JobCard from "../components/JobCard";
import { useScroll } from "framer-motion";
import { useEffect } from "react";

const AllJobs = () => {
  const axiosSecure = useAxiosSecure();
  useScroll();
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [sortBySalary, setSortBySalary] = useState("");
  const [count, setCount] = useState(0);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(count / pageSize);

  useEffect(() => {
    axiosSecure(`/totalJobsCount?filter=${filter}&search=${search}`).then(
      (res) => setCount(res?.data?.count)
    );
  }, [axiosSecure, filter, search]);

  const {
    data: jobs = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "jobsAllData",
      filter,
      sort,
      search,
      sortBySalary,
      currentPage,
      pageSize,
    ],
    queryFn: async () => {
      const { data } = await axiosSecure(
        `/jobs?filter=${filter}&search=${search}&sort=${sort}&sortBySalary=${sortBySalary}&page=${
          currentPage
        }&size=${pageSize}`
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
    setSortBySalary("");
  };

  const handlePaginationButton = (page) => {
    setCurrentPage(page);
  };

  if (isPending) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-center my-4 text-red-700 font-semibold">
        Failed to load data! {error?.message || "Unknown error"}
      </p>
    );

  return (
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  {/* Control Panel */}
  <div className="flex flex-col lg:flex-row justify-between items-center gap-4 flex-wrap mb-10 bg-white shadow-sm rounded-lg p-6">
    {/* Filter */}
    <select
      onChange={(e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
      }}
      value={filter}
      className="w-full lg:w-auto border border-gray-300 text-gray-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Filter by Category</option>
      <option value="Web Development">Web Development</option>
      <option value="Graphics Design">Graphics Design</option>
      <option value="Digital Marketing">Digital Marketing</option>
    </select>

    {/* Search */}
    <form onSubmit={handleSearch} className="w-full sm:w-auto flex rounded-md shadow-sm">
      <input
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setCurrentPage(1);
        }}
        type="text"
        placeholder="Search job title..."
        className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>

    {/* Sort by Deadline */}
    <select
      onChange={(e) => {
        setSort(e.target.value);
        setCurrentPage(1);
      }}
      value={sort}
      className="w-full lg:w-auto border border-gray-300 text-gray-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Sort by Deadline</option>
      <option value="asc">Ascending</option>
      <option value="dsc">Descending</option>
    </select>

    {/* Sort by Salary */}
    <select
      onChange={(e) => {
        setSortBySalary(e.target.value);
        setCurrentPage(1);
      }}
      value={sortBySalary}
      className="w-full lg:w-auto border border-gray-300 text-gray-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Sort by Salary</option>
      <option value="asc">Low to High</option>
      <option value="dsc">High to Low</option>
    </select>

    {/* Reset Button */}
    <button
      onClick={handleReset}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full lg:w-auto"
    >
      Reset
    </button>
  </div>

  {/* Jobs Grid */}
  {jobs.length === 0 ? (
    <p className="text-center text-gray-400 text-lg">No jobs found!</p>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  )}

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => handlePaginationButton(currentPage - 1)}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-blue-500 hover:text-white disabled:bg-gray-200 disabled:text-gray-400 transition"
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((btnNum) => (
        <button
          key={btnNum}
          onClick={() => handlePaginationButton(btnNum)}
          className={`px-4 py-2 rounded-md transition font-medium ${
            currentPage === btnNum
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100"
          }`}
        >
          {btnNum}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePaginationButton(currentPage + 1)}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-blue-500 hover:text-white disabled:bg-gray-200 disabled:text-gray-400 transition"
      >
        Next →
      </button>
    </div>
  )}
</div>

  );
};

export default AllJobs;
