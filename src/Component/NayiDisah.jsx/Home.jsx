import { FaPeopleCarry, FaGlobeAsia, FaBullhorn } from "react-icons/fa";
import { HiChatAlt2 } from "react-icons/hi";

const HomePage = () => {
  // const [openChat, setOpenChat] = useState(false);
  // const [messages, setMessages] = useState([
  //   { text: "Welcome to NayiDisha! How can I assist you?", sender: "bot" },
  // ]);
  // const [input, setInput] = useState("");

  // const handleOpenChat = () => setOpenChat(true);
  // const handleCloseChat = () => setOpenChat(false);

  // const handleSendMessage = (e) => {
  //   e.preventDefault();
  //   if (input.trim()) {
  //     setMessages([...messages, { text: input, sender: "user" }]);
  //     setTimeout(() => {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           text: "Thanks for your message! We're here to help.",
  //           sender: "bot",
  //         },
  //       ]);
  //     }, 1000);
  //     setInput("");
  //   }
  // };

  // Prevent body scroll when chatbot is open
  // useEffect(() => {
  //   if (openChat) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }
  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [openChat]);

  return (
    <div className="font-sans flex flex-col justify-center items-center min-h-screen text-gray-100 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center py-22 px-4 sm:py-24 md:py-32 lg:py-40">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 leading-tight">
          Make an Impact
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl sm:max-w-3xl mb-8 text-gray-300">
          Voice your issues, raise awareness, and drive meaningful change in
          your community.
        </p>
        <button
          className="border border-white text-white px-6 py-2 sm:px-8 sm:py-2 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-900 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Report an Issue"
        >
          Report an Issue
        </button>
      </section>

      {/* About Section */}
      <section className="container py-12 px-4 sm:px-6 md:px-8 lg:px-16 text-center bg-gray-800/50 border border-gray-600 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-400">
          Why NayiDisha?
        </h2>
        <p className="text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto text-gray-300">
          Our mission is to empower every citizen with a platform to report
          social issues, connect with authorities, and track resolutions
          seamlessly.
        </p>

        {/* Featured Issues */}
        <div className="py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-10 text-blue-400">
            Top Social Issues
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: (
                  <FaBullhorn className="text-3xl sm:text-4xl text-blue-400 mb-4" />
                ),
                title: "Public Nuisance",
                desc: "Raise concerns about noise, abuse, or threats in your locality.",
              },
              {
                icon: (
                  <FaPeopleCarry className="text-3xl sm:text-4xl text-blue-400 mb-4" />
                ),
                title: "Corruption",
                desc: "Report unfair practices in public offices and demand transparency.",
              },
              {
                icon: (
                  <FaGlobeAsia className="text-3xl sm:text-4xl text-blue-400 mb-4" />
                ),
                title: "Environment",
                desc: "Highlight pollution, illegal dumping, or deforestation issues.",
              },
            ].map((issue, index) => (
              <div
                key={index}
                className="bg-gray-900/50 p-4 sm:p-6 border border-gray-600 rounded-xl text-center hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                tabIndex={0}
                role="button"
                aria-label={`Learn more about ${issue.title}`}
              >
                {issue.icon}
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 text-gray-100">
                  {issue.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  {issue.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 px-4 sm:px-6 md:px-8 lg:px-16 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 text-blue-400">
          Our Collective Impact
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-12 lg:gap-16 max-w-6xl mx-auto text-gray-300">
          {[
            { value: "10K+", label: "Issues Reported" },
            { value: "7.5K", label: "Resolved Cases" },
            { value: "120+", label: "Authorities Involved" },
            { value: "98%", label: "User Satisfaction" },
          ].map((stat, index) => (
            <div key={index} className="group">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                {stat.value}
              </h3>
              <p className="text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 px-4 sm:px-6 md:px-8 lg:px-16 text-center bg-gray-800/50 border border-gray-600 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
        <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl italic text-gray-300 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto">
          “A small voice can start a big revolution. This app made me believe
          that change starts with us.”
        </blockquote>
        <p className="mt-4 font-semibold text-gray-400 text-sm sm:text-base">
          – Sajal Tiwari , Founder...
        </p>
      </section>

      {/* Footer */}
      <footer className="text-gray-300 py-8 px-4 sm:px-6 md:px-8 lg:px-16 text-center">
        <p className="mb-4 text-sm sm:text-base">
          © {new Date().getFullYear()} NayiDisha. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 sm:space-x-6">
          {["Privacy", "Terms", "Contact"].map((link, index) => (
            <a
              key={index}
              href="#"
              className="hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base"
            >
              {link}
            </a>
          ))}
        </div>
      </footer>

      {/* Floating Message Icon */}
      {/* <button
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Open Chatbot"
        onClick={handleOpenChat}
      >
        <HiChatAlt2 className="text-xl sm:text-2xl" />
      </button> */}

      {/* Chatbot Modal */}
      {/* {openChat && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseChat}
        >
          <div
            className="bg-white rounded-lg w-full max-w-[90vw] sm:max-w-[400px] h-[80vh] max-h-[600px] flex flex-col p-4 sm:p-5"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="chatbot-title"
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                id="chatbot-title"
                className="text-base sm:text-lg font-semibold text-gray-800"
              >
                NayiDisha Assistant
              </h3>
              <button
                className="text-gray-600 hover:text-gray-800 text-lg sm:text-xl"
                onClick={handleCloseChat}
                aria-label="Close Chatbot"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-100 rounded-lg p-3 sm:p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-2 sm:p-3 rounded-lg text-sm sm:text-base ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 sm:p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm sm:text-base"
                  aria-label="Chat input"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base"
                  aria-label="Send message"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default HomePage;
