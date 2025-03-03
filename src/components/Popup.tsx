import React from "react";

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const Popup: React.FC<PopupProps> = ({
  isVisible,
  onClose,
  title,
  content,
}) => {
  return (
    <div
      className={`${isVisible ? "visible" : ""} absolute top-4 left-4 z-30 p-4 bg-white rounded-lg shadow-lg max-w-sm`}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-0 bg-gray-300 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-400 transition-colors"
      >
        x
      </button>
      <div className="mt-8">
        <h1 className="text-lg font-bold text-gray-800 mb-2">{title}</h1>
      </div>
      <div className="text-gray-600 relative">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Popup;
