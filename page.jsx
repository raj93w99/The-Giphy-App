"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { SearchIcon } from "@heroicons/react/solid";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const userSession = sessionStorage.getItem("user");
  const [loading, setLoading] = useState(false);
  console.log(user);

  if (!user && !userSession){
    router.push('/sign-up')
  }

  useEffect(() => {
    // Make the API request when searchQuery or currentPage changes
    setLoading(true);
    setSearchResults([]);

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&q=${searchQuery}&limit=25&offset=5&rating="g"&lang="en"&bundle="messaging_non_clips"`
        );
        const data = await response.json();
        setSearchResults(data.data); // Assuming the API response has a 'data' property
      } catch (error) {
        console.log("Error fetching search results:", error);
      } finally {
        // Set loading to false after the API request is complete
        setLoading(false);
      }
    };

    // Only fetch results if there's a non-empty search query
    if (searchQuery.trim() !== "") {
      fetchSearchResults();
    }
  }, [searchQuery, currentPage]);

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  if (!user && !userSession) {
    router.push("/sign-in");
  }

  return (
    <main className="flex min-h-screen bg-slate-100 flex-col items-center justify-between p-24">
      <div className="fixed right-10 top-10">
        <button
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem("user");
          }}
        >
          Log Out
        </button>
      </div>
      <div className="relative bg-white rounded-md p-8">
        <div className="relative max-w-2xl flex-col items-center p-4 bg-white rounded-md">
          <div className="relative bg-transparent">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-black" aria-hidden="true" />
            </div>
            <input
              className="block bg-slate-100 w-full pl-10 pr-3 py-2 rounded-md leading-5 placeholder-black focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black-600 focus:border-black sm:text-sm"
              type="search"
              placeholder="Article name or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="max-w-2xl items-start flex flex-wrap">
          {loading && searchResults.length > 0 ? (
            // Display loading indicator while results are being fetched
            <div className="w-1/3 text-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 border-opacity-50 mx-auto"></div>
            </div>
          ) : (
            // Display search results when not loading
            searchResults.slice(startIndex, endIndex).map((result) => (
              <div key={result.id} className="w-1/3 mb-4 p-4">
                <img
                  src={result.images.fixed_height.url}
                  alt={result.title}
                  className="w-full rounded-md"
                />
                <div className="mt-2">
                  {result.user && result.user.display_name && (
                    <p className="font-bold">{result.user.display_name}</p>
                  )}
                  {result.user && result.user.description && (
                    <p className="text-sm overflow-hidden line-clamp-4">
                      {result.user.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-center mt-4">
          {searchResults.length > 0 ? (
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="mr-2 text-sm"
            >
              Previous
            </button>
          ) : (
            <></>
          )}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              className={`mx-2 ${currentPage === index + 1 ? "font-bold" : ""}`}
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </button>
          ))}
          {searchResults.length > 0 ? (
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="ml-2 text-sm"
            >
              Next
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </main>
  );
}
