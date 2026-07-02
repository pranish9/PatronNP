import { useRef, useState } from "react";
import { Image as ImageIcon } from "lucide-react";

const FileDropzone = ({ accept, multiple, onFiles, icon: Icon = ImageIcon, hint = "Upload image or drag and drop." }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length) onFiles(files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`w-full aspect-video sm:aspect-[21/9] flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
        dragging
          ? "border-patron-green-500 bg-patron-green-50"
          : "border-amber-200 bg-amber-50/60 hover:border-patron-green-400"
      }`}
    >
      <div className="w-14 h-14 rounded-xl bg-patron-green-100 flex items-center justify-center text-patron-green-600">
        <Icon size={26} />
      </div>
      <p className="text-sm text-patron-gray-700">
        {hint.split("drag and drop")[0]}
        <span className="text-patron-green-700 font-semibold">drag and drop.</span>
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default FileDropzone;
