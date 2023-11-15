import { assetDataMap } from "@/lib/constants";
import { useState, useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

const fui = assetDataMap["fileUploadIcon"];

interface Props {
  mediaURL?: URL;
  fieldChange: (files: File[]) => void;
}

export default ({ fieldChange }: Props) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileURL(URL.createObjectURL(acceptedFiles[0]));
      // Do something with the files
    },
    [file]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".svg", ".png", ".gif", ".jpg", ".jpeg"],
    },
  });

  return (
    <div>
      <div
        className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
        {...getRootProps()}
      >
        <input className="cursor-pointer" {...getInputProps()} />
        {fileURL ? (
          <>
            <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
              <img className="file_uploader--img" src={fileURL} alt="image" />
            </div>
            <p className="file_uploader--label">
              Click or drag photo to replace
            </p>
          </>
        ) : (
          <div className="file_uploader--box">
            <img src={fui[0]} width={96} height={77} alt={fui[1]} />
            <h3 className="base-medium text-light-2 mb-2 mt-6">
              Drag Photo Here
            </h3>
            <p className="text-light-4 small-regular mb-6">
              SVG, PNG, JPG/JPEG, GIF
            </p>
            <Button className="shad-button__dark_4">
              Select from computer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
