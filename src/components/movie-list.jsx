import React, { useState, useEffect, useRef } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import API from "../services/api-services";
import { useCookies } from "react-cookie";
import useFetch from "../services/useFetch";
import MovieDetails from "./movie-details";

const BASE_URL = "http://127.0.0.1:8000";

export default function MovieList({ movieClicked, newMovie, updatedMovie }) {
  const { data, loading, error } = useFetch("/movies/");
  const [movies, setMovies] = useState([]);
  const [cookies] = useCookies(["mr-token"]);
  const token = cookies["mr-token"];
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const [activeTrailer, setActiveTrailer] = useState(0);
  const trailerMovies = movies.filter((m) => m.trailer);
  const videoRef = useRef(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null); // 🆕 confirmation popup

  // Load movies
  useEffect(() => {
    if (Array.isArray(data)) setMovies(data);
  }, [data]);

  // Add new movie
  useEffect(() => {
    if (newMovie && newMovie.id) setMovies((prev) => [...prev, newMovie]);
  }, [newMovie]);

  // Update movie
  useEffect(() => {
    if (updatedMovie && updatedMovie.id) {
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === updatedMovie.id ? { ...movie, ...updatedMovie } : movie
        )
      );
    }
  }, [updatedMovie]);

  // Auto-scroll banner
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let scrollPos = 0;
    const scrollStep = 1;

    const scroll = () => {
      scrollPos += scrollStep;
      if (scrollPos >= container.scrollWidth - container.clientWidth) {
        scrollPos = 0;
      }
      container.scrollLeft = scrollPos;
      scrollIntervalRef.current = requestAnimationFrame(scroll);
    };

    const startScroll = () => (scrollIntervalRef.current = requestAnimationFrame(scroll));
    const stopScroll = () => cancelAnimationFrame(scrollIntervalRef.current);

    startScroll();
    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);

    return () => {
      stopScroll();
      container.removeEventListener("mouseenter", stopScroll);
      container.removeEventListener("mouseleave", startScroll);
    };
  }, [movies]);

  const handleMovieClick = (movie) => {
    cancelAnimationFrame(scrollIntervalRef.current);
    setSelectedMovie(movie);
  };

  const removeMovie = async (movieToBeRemoved) => {
    const response = await API.removeMovie(movieToBeRemoved.id, token);
    if (response) {
      setMovies((prev) => prev.filter((m) => m.id !== movieToBeRemoved.id));
      setSelectedMovie(null);
    }
  };

  const handleUpdateMovie = (updated) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === updated.id ? { ...movie, ...updated } : movie
      )
    );
  };

  // Trailer rotation
  useEffect(() => {
    if (trailerMovies.length === 0) return;
    const interval = setInterval(() => {
      setActiveTrailer((prev) => (prev + 1) % trailerMovies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [trailerMovies]);

  const handleTrailerClick = () => {
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error}</h1>;

  const activeMovie = trailerMovies[activeTrailer];
  const latestMovies = movies.filter((m) => m.is_latest);

  // Group by category
  const categoryMap = {};
  movies.forEach((movie) => {
    const category = movie.category || "Other";
    if (!categoryMap[category]) categoryMap[category] = [];
    categoryMap[category].push(movie);
  });

  const renderMovieCard = (movie) => (
    <div
      key={movie.id}
      className="relative min-w-[250px] bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-orange-400/50 hover:scale-110 transition-all duration-300 group cursor-pointer"
      onClick={() => handleMovieClick(movie)}
    >
      <img
        src={movie.image || "https://via.placeholder.com/300x400?text=Movie+Poster"}
        alt={movie.title}
        className="w-full h-80 object-cover"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 transition-all">
        <CiEdit
          className="text-yellow-400 text-3xl hover:scale-125 transition"
          title="Edit Movie"
          onClick={(e) => {
            e.stopPropagation();
            movieClicked(movie, true);
          }}
        />
        <MdDelete
          className="text-red-500 text-3xl hover:scale-125 transition"
          title="Delete Movie"
          onClick={(e) => {
            e.stopPropagation();
            setConfirmDelete(movie); // 🆕 show popup
          }}
        />
      </div>
      <div className="p-4 bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 w-full">
        <h2 className="text-lg font-semibold text-white text-center truncate">{movie.title}</h2>
        <div
          className="flex justify-center mt-2 text-yellow-400 text-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleMovieClick(movie);
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < Math.round(movie.avg_rating || 0) ? "★" : "☆"}</span>
          ))}
        </div>
        <p className="text-center text-gray-400 text-xs mt-1">
          ({movie.avg_rating ? movie.avg_rating.toFixed(1) : "0.0"})
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full">
      {/* 🎥 Trailer Banner */}
      {activeMovie && (
        <section className="relative w-full h-[90vh] overflow-hidden">
          <video
            ref={videoRef}
            src={
              activeMovie.trailer?.startsWith("http")
                ? activeMovie.trailer
                : `${BASE_URL}${activeMovie.trailer}`
            }
            autoPlay
            loop={false}
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            onClick={handleTrailerClick}
            onEnded={() =>
              setActiveTrailer((prev) => (prev + 1) % trailerMovies.length)
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end px-12 pb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-400 drop-shadow-lg">
              {activeMovie.title}
            </h2>
            <p className="max-w-2xl text-gray-300 mt-3 text-sm md:text-base line-clamp-3">
              {activeMovie.description}
            </p>
            <button
              onClick={() => handleMovieClick(activeMovie)}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 w-fit"
            >
              ▶ View Details
            </button>
          </div>
        </section>
      )}

      {/* 🎬 Latest Movies */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-orange-400 px-8 mb-4">🔥 Latest Movies</h2>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth px-8">
          {latestMovies.length > 0 ? latestMovies.slice(0, 6).map(renderMovieCard) : <p className="text-gray-400">No latest movies.</p>}
        </div>
      </section>

      {/* 📂 Category-wise Movies */}
      {Object.entries(categoryMap).map(([category, list]) => {
        const expanded = expandedCategories.includes(category);
        const visibleMovies = expanded ? list : list.slice(0, 4);

        return (
          <section key={category} className="mt-10">
            <div className="flex justify-between items-center px-8 mb-4">
              <h2 className="text-2xl font-bold text-orange-400"> {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}</h2>
              {list.length > 4 && (
                <button
                  onClick={() =>
                    setExpandedCategories((prev) =>
                      expanded ? prev.filter((c) => c !== category) : [...prev, category]
                    )
                  }
                  className="text-sm text-orange-300 hover:text-orange-500 transition"
                >
                  {expanded ? "View Less" : "View All"}
                </button>
              )}
            </div>
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth px-8">
              {visibleMovies.map(renderMovieCard)}
            </div>
          </section>
        );
      })}

      {/* 🗑️ Delete Confirmation Popup */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl p-8 w-[90%] max-w-md text-center border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-orange-400 font-semibold">{confirmDelete.title}</span>?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={async () => {
                  await removeMovie(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          updateMovie={handleUpdateMovie}
          onClose={() => setSelectedMovie(null)}
          onEdit={(m) => movieClicked(m, true)}
          onDelete={removeMovie}
        />
      )}
    </div>
  );
}
