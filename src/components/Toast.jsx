import { createPortal } from "react-dom";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const Toast = ({ message, type = "success", onClose }) => {
  return createPortal(
    <div className="fixed top-24 right-6 z-[99999] w-[calc(100%-3rem)] max-w-sm bg-[#141414] border border-[#333] rounded-xl shadow-2xl p-4 flex items-center gap-3">
      <FaCheckCircle
        className={`text-lg shrink-0 ${
          type === "success" ? "text-green-500" : "text-red-500"
        }`}
      />

      <p className="text-white text-sm flex-1">{message}</p>

      <button
        onClick={onClose}
        className="text-[#737373] hover:text-white transition"
      >
        <FaTimes />
      </button>
    </div>,
    document.body,
  );
};

export default Toast;
