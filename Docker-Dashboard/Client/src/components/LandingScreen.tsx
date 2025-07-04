import { FaRocket, FaDocker, FaGithub } from "react-icons/fa";
import { SiMongodb } from "react-icons/si";

const LandingScreen = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden rounded-2xl">
      {/* Animated Glows */}
      <div className="absolute w-[300px] h-[300px] bg-blue-500 opacity-20 blur-3xl rounded-full top-16 left-10 animate-pulse" />
      <div className="absolute w-[250px] h-[250px] bg-pink-500 opacity-20 blur-2xl rounded-full bottom-24 right-12 animate-ping" />

      <div className="text-center z-10 animate-fadeInUp">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight leading-tight drop-shadow-lg">
          Welcome to <span className="text-blue-400">T&ABoard</span>
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-lg mb-12 drop-shadow-md">
          A sleek platform to import GitHub repos, deploy them in Docker, and manage containers like a pro.
        </p>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <FeatureCard
            icon={<FaGithub size={28} />}
            title="GitHub Integration"
            description="Seamlessly import and manage repositories."
          />
          <FeatureCard
            icon={<FaDocker size={28} />}
            title="Docker Hosting"
            description="Run projects inside isolated Docker containers."
          />
          <FeatureCard
            icon={<SiMongodb size={28} />}
            title="Persistent Storage"
            description="Repos persist across sessions in the cloud."
          />
          <FeatureCard
            icon={<FaRocket size={28} />}
            title="Lightning Fast"
            description="Instant deployment and smart container control."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:border-blue-500 transition-all shadow-md hover:shadow-blue-600/20 hover:scale-[1.02] duration-300 ">
    <div className="flex items-center gap-3 mb-3 text-blue-400">
      {icon}
      <span className="text-lg font-semibold text-white">{title}</span>
    </div>
    <p className="text-sm text-gray-300">{description}</p>
  </div>
);

export default LandingScreen;
