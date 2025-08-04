import { motion } from "framer-motion";
import bannerVideo from "../assets/banner.mp4";
import { useNavigate } from "react-router-dom";
const Banner = () => {
  const nav = useNavigate();
  return (
    <div className=" bg-base-200 ">
      <div className="flex justify-between items-center flex-col lg:flex-row-reverse">
        <video
          className="lg:w-1/2"
          muted
          autoPlay
          loop
          src={bannerVideo}
        ></video>
        <div className="lg:w-1/2 text-center lg:text-left">
          <div className="relative z-20 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left max-w-3xl bg-white/70 backdrop-blur-lg rounded-2xl p-10 shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
            >
              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900"
              >
                Find Your <br />
                <span className="text-primary">Perfect Job</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="py-6 text-lg text-gray-700"
              >
                Discover top job opportunities tailored for you. Search smart,
                apply faster, and start building your future today.
              </motion.p>

              <motion.button
                onClick={() => nav("/all-jobs")}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="btn bg-primary text-white hover:bg-primary/90 btn-lg px-8"
              >
                Explore Jobs
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
