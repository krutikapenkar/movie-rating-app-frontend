import React, { useState } from "react";
import { FaStar, FaPlay } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";
import API from "../services/api-services";

export default function MovieDetails({ movie, updateMovie, onClose }) {
  const [highlighted, setHighlighted] = useState(-1);
  const [cookies] = useCookies(["mr-token"]);
  const token = cookies["mr-token"];
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const rateMovie = async (rate) => {
    try {
      setLoading(true);
      await API.rateMovie(movie.id, { stars: rate }, token);
      const updated = await API.getMovie(movie.id, token);
      updateMovie(updated);
      toast.success(`⭐ Rated ${rate} stars successfully!`, {
        style: { background: "#222", color: "#ffcc00", border: "1px solid #ffcc00" },
      });
    } catch (err) {
      toast.error("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {movie && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Toaster position="top-center" reverseOrder={false} />
          <motion.div
            className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl shadow-2xl p-5 w-[95%] max-w-3xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 opacity-20 blur-2xl bg-gradient-to-r from-orange-500 to-pink-500 -z-10"></div>

            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
              onClick={onClose}
            >
              ✕
            </button>

            {/* Movie Section */}
            <div className="flex flex-col md:flex-row gap-5">
              {/* Poster or Trailer */}
              <div className="w-full md:w-1/2 relative group">
                {!showTrailer ? (
                  <motion.img
                    src={movie.image || "https://via.placeholder.com/400x500?text=Movie+Poster"}
                    alt={movie.title}
                    className="w-full h-80 object-cover rounded-xl shadow-lg transition-all group-hover:opacity-90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                ) : (
                  <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      className="w-full h-full"
                      src={movie.trailer_url || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                      title="Movie Trailer"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* Play Button */}
                <motion.button
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-orange-500 hover:bg-orange-400 text-black font-bold flex items-center gap-2 px-4 py-2 rounded-full shadow-md mt-2"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowTrailer(!showTrailer)}
                >
                  <FaPlay />
                  {showTrailer ? "Hide Trailer" : "Watch Trailer"}
                </motion.button>
              </div>

              {/* Movie Info */}
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-extrabold text-orange-400 drop-shadow-md mb-1">
                  {movie.title}
                </h2>

                {movie.category && (
                  <p className="text-gray-400 text-sm mb-2">
                    🎭 Category:{" "}
                    <span className="text-orange-300 capitalize font-medium">{movie.category}</span>
                  </p>
                )}

                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  {movie.description || "No description available."}
                </p>

                {/* Gallery Images (if available) */}
                {movie.gallery && movie.gallery.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                    {movie.gallery.map((img, i) => (
                      <motion.img
                        key={i}
                        src={img}
                        alt={`Still ${i}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-700 hover:scale-105 transition-transform"
                        whileHover={{ scale: 1.1 }}
                      />
                    ))}
                  </div>
                )}

                {/* Current Rating */}
                <div className="flex justify-center md:justify-start text-yellow-400 text-xl mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      {i < Math.round(movie.avg_rating || 0) ? "★" : "☆"}
                    </motion.span>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  ({movie.avg_rating ? movie.avg_rating.toFixed(1) : "0.0"} / 5)
                </p>

                {/* Rate Section */}
                <h3 className="text-lg text-orange-300 font-semibold mb-2 text-center md:text-left">
                  Rate this Movie
                </h3>
                <div className="flex justify-center md:justify-start text-3xl mb-4">
                  {[...Array(5)].map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHighlighted(index + 1)}
                      onMouseLeave={() => setHighlighted(-1)}
                      onClick={() => rateMovie(index + 1)}
                      className={`cursor-pointer transition-all duration-200 ${
                        highlighted > index
                          ? "text-yellow-400 drop-shadow-[0_0_10px_#facc15]"
                          : "text-gray-600"
                      }`}
                    >
                      <FaStar />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-3xl">
                <div className="animate-spin w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
