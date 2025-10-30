import { useState, useEffect } from "react";
import "./App.css";
import MovieList from "./components/movie-list";
import MovieDetails from "./components/movie-details";
import MovieForm from "./components/movie-form";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaPlus, FaChevronDown } from "react-icons/fa";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editedMovie, setEditedMovie] = useState(null);
  const [updatedMovie, setUpdatedMovie] = useState(null);
  const [newMovie, setNewMovie] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [movies, setMovies] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  const [cookies, , deleteCookie] = useCookies(["mr-token"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies["mr-token"]) navigate("/");
  }, [cookies, navigate]);

  const movieClicked = (movie, isEdit = false) => {
    if (isEdit) {
      setEditedMovie(movie);
      setSelectedMovie(null);
      setShowForm(true);
    } else {
      setSelectedMovie(movie);
      setEditedMovie(null);
      setShowForm(false);
    }
  };

  const createNewMovie = () => {
    setEditedMovie({ title: "", description: "" });
    setSelectedMovie(null);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditedMovie(null);
  };

  const logoutUser = () => {
    deleteCookie("mr-token");
    navigate("/");
  };

  // Extract unique categories for submenu
  const uniqueCategories = [
    ...new Set(movies.map((movie) => movie.category || "Other")),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* 🌟 Sticky Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <nav className="flex justify-between items-center px-8 py-4">
          {/* Logo / Brand Name */}
          <h1 className="text-3xl font-extrabold text-orange-400 tracking-wide flex items-center gap-2">
            CineStream <span className="text-white/80">Galaxy</span>
          </h1>

          {/* Navigation Links */}
          <ul className="flex items-center gap-8 text-gray-300 font-semibold">
            <li className="hover:text-orange-400 transition-all duration-300 cursor-pointer">
              Home
            </li>

            {/* Categories Dropdown */}
            <li
              className="relative group cursor-pointer"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <div className="flex items-center gap-1 hover:text-orange-400 transition">
                Categories <FaChevronDown size={14} />
              </div>

              {showCategories && uniqueCategories.length > 0 && (
                <ul className="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-48 overflow-hidden animate-fade-in">
                  {uniqueCategories.map((category, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-800 hover:text-orange-400 transition"
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="hover:text-orange-400 transition-all duration-300 cursor-pointer">
              About
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={logoutUser}
                className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition"
                title="Logout"
              >
                <FaSignOutAlt size={18} /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Add padding to avoid navbar overlap */}
      <div className="pt-24">
        {/* 🎞 Movie Carousel */}
        <section className="px-8 py-10">
          <MovieList
            movieClicked={movieClicked}
            newMovie={newMovie}
            updatedMovie={updatedMovie}
            onMoviesLoaded={setMovies}
          />
        </section>

        {/* 🎥 Movie Details Section */}
        <section className="max-w-5xl mx-auto px-8 pb-24">
          {movies.length === 0 ? (
            <div className="text-center text-gray-400 mt-16">
              <p className="text-lg">
                Select a movie or click “Add Movie” to begin 🎞️
              </p>
            </div>
          ) : (
            selectedMovie && (
              <MovieDetails
                movie={selectedMovie}
                updateMovie={setUpdatedMovie}
              />
            )
          )}
        </section>

        {/* 📝 Movie Form Modal */}
        {showForm && (
          <MovieForm
            movie={editedMovie}
            updateMovie={setUpdatedMovie}
            addNewMovie={setNewMovie}
            onClose={closeModal}
          />
        )}
      </div>

      {/* ➕ Floating Add Movie Button */}
      <button
        onClick={createNewMovie}
        className="fixed bottom-10 right-10 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <FaPlus size={24} />
      </button>
    </div>
  );
}

export default App;
