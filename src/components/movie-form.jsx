import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import API from "../services/api-services";
import { useCookies } from "react-cookie";
import { Upload, Film } from "react-icons/fa";

export default function MovieForm({ movie, updateMovie, addNewMovie, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [isLatest, setIsLatest] = useState(false);
  const [cookies] = useCookies(["mr-token"]);
  const [loading, setLoading] = useState(false);

  const token = cookies["mr-token"];

  // Prefill when editing
  useEffect(() => {
    if (movie) {
      setTitle(movie.title || "");
      setDescription(movie.description || "");
      setCategory(movie.category || "");
      setIsLatest(movie.is_latest || false);
    }
  }, [movie]);

  // Drag-drop handlers
  const handleImageDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setImage(file);
  }, []);

  const handleTrailerDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) setTrailer(file);
  }, []);

  const preventDefaults = (e) => e.preventDefault();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category.trim()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("is_latest", isLatest);

    if (image) formData.append("image", image);
    if (trailer) formData.append("trailer", trailer);

    setLoading(true);
    try {
      let resp = null;

      if (movie?.id) {
        resp = await API.updateMovie(movie.id, formData, true);
        if (resp) {
          updateMovie(resp);
          toast.success("🎬 Movie updated successfully!");
        } else toast.error("Failed to update movie!");
      } else {
        resp = await API.createMovie(formData, true);
        if (resp) {
          addNewMovie(resp);
          toast.success("🎥 New movie added successfully!");
        } else toast.error("Failed to create movie!");
      }

      if (resp) setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error("Error saving movie:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <Toaster position="top-center" reverseOrder={false} />
        <motion.div
          className="bg-gradient-to-b from-gray-900 to-black text-white rounded-3xl shadow-2xl w-[90%] max-w-md relative overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
            {/* Close */}
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
              onClick={handleClose}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-orange-400">
              {movie?.id ? "✏️ Edit Movie" : "🎬 Create New Movie"}
            </h2>

            <div className="flex flex-col gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter movie title"
                  className="w-full px-4 py-2 bg-gray-800/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter movie description"
                  className="w-full px-4 py-2 bg-gray-800/60 border border-gray-600 rounded-xl text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                ></textarea>
              </div>

              {/* Category */}
            
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">-- Select Category --</option>
                  <option value="thriller">Thriller</option>
                  <option value="romantic">Romantic</option>
                  <option value="action">Action</option>
                  <option value="comedy">Comedy</option>
                  <option value="webseries">Web Series</option>
                  <option value="drama">Drama</option>
                </select>
              </div>

              {/* Poster Upload */}
              <div
                onDrop={handleImageDrop}
                onDragOver={preventDefaults}
                onDragEnter={preventDefaults}
                className="relative border-2 border-dashed border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-orange-500 transition-colors"
              >
                <label className="block text-sm text-gray-300 mb-1">
                  Poster Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-sm mb-2">
                    Drag & Drop or Click to Upload
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-gray-800/60 rounded-full"
                  >
                    📁
                  </motion.div>
                </label>
                {image && (
                  <p className="mt-2 text-sm text-orange-400">{image.name}</p>
                )}
                {movie?.image && !image && (
                  <img
                    src={movie.image}
                    alt="Preview"
                    className="mt-3 w-full h-40 object-cover rounded-lg border border-gray-700"
                  />
                )}
              </div>

              {/* Trailer Upload */}
              <div
                onDrop={handleTrailerDrop}
                onDragOver={preventDefaults}
                onDragEnter={preventDefaults}
                className="relative border-2 border-dashed border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-orange-500 transition-colors"
              >
                <label className="block text-sm text-gray-300 mb-1">
                  Trailer (Video)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setTrailer(e.target.files[0])}
                  className="hidden"
                  id="trailerUpload"
                />
                <label htmlFor="trailerUpload" className="cursor-pointer flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-sm mb-2">
                    Drag & Drop or Click to Upload
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-gray-800/60 rounded-full"
                  >
                    🎞️
                  </motion.div>
                </label>
                {trailer && (
                  <p className="mt-2 text-sm text-orange-400">{trailer.name}</p>
                )}
                {movie?.trailer && !trailer && (
                  <video
                    src={movie.trailer}
                    controls
                    className="mt-3 w-full rounded-lg border border-gray-700"
                  />
                )}
              </div>

              {/* Latest Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isLatest}
                  onChange={(e) => setIsLatest(e.target.checked)}
                  className="w-5 h-5 text-orange-500 accent-orange-500"
                />
                <label className="text-gray-300 text-sm">
                  Mark as Latest Movie
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all"
                >
                  {loading
                    ? "Saving..."
                    : movie?.id
                    ? "💾 Update Movie"
                    : "➕ Create Movie"}
                </button>
              </div>
            </div>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-3xl">
              <div className="animate-spin w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full"></div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
