import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white transition-colors duration-500">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-40 h-40 flex items-center justify-center"
      >
        {/* Spinning glowing ring */}
        <div className="absolute w-36 h-36 border-4 border-t-transparent border-b-transparent border-r-yellow-400 border-l-sky-400 rounded-full animate-spin"></div>

        {/* Inner glass glow */}
        <div className="absolute w-32 h-32 bg-gradient-to-br from-yellow-100 via-white to-sky-100/60 backdrop-blur-md rounded-full shadow-2xl animate-pulse"></div>

        {/* Text */}
        <p className="z-10 text-lg font-semibold text-gray-900 dark:text-white tracking-wide animate-bounce">
          Loading...
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
