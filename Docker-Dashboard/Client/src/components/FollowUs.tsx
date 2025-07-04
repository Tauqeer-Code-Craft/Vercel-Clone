import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const FollowUs = () => {
  return (
    <div className="mt-6 w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-5 py-10 shadow-lg animate-fadeInUp transition duration-500">
      <h3 className="text-center text-white text-lg font-semibold mb-4 tracking-tight">
        🌐 Follow Us
      </h3>

      <div className="flex justify-center gap-6">
        <SocialIcon
          href="https://github.com/"
          label="GitHub"
          icon={<FaGithub size={22} />}
          glow="hover:shadow-[0_0_12px_3px_rgba(255,255,255,0.3)]"
        />
        <SocialIcon
          href="https://twitter.com/"
          label="Twitter"
          icon={<FaTwitter size={22} />}
          glow="hover:shadow-[0_0_12px_3px_rgba(29,155,240,0.4)]"
        />
        <SocialIcon
          href="https://linkedin.com/"
          label="LinkedIn"
          icon={<FaLinkedin size={22} />}
          glow="hover:shadow-[0_0_12px_3px_rgba(10,102,194,0.4)]"
        />
      </div>

      <p className="text-[12px] text-gray-500 text-center mt-4">
        Stay connected with us on your favorite platforms.
      </p>
    </div>
  );
};

const SocialIcon = ({
  href,
  icon,
  label,
  glow,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  glow?: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`group relative text-gray-300 hover:text-white bg-gray-800 p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${glow}`}
    >
      <span className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 blur-md animate-ping-slow z-[-1]"></span>
      {icon}
    </a>
  );
};

export default FollowUs;
