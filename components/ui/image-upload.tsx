"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUplaodProps {
  value: string[];
  disable?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUpload = ({
  disable,
  onChange,
  onRemove,
  value,
}: ImageUplaodProps) => {

  // for sure handle "Hydration Error" problem
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = (result: any) => {
    const url = result.info.secure_url;
    onChange(url);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4">
      {value.map((url) => (
        <div
          key={url}
          className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
        >
          <div className="z-10 absolute top-2 right-2">
            <Button
              type="button"
              onClick={() => onRemove(url)}
              variant="destructive"
              size="icon"
            >
              <Trash className="size-4" />
            </Button>
          </div>
          <Image
            priority
            fill
            className="object-cover"
            alt="Image"
            src={url}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}

      <CldUploadWidget onSuccess={onUpload} uploadPreset="domeptchr" options={{ multiple: true}}>
        {({ open }) => {
          return (
            <Button
              type="button"
              disabled={disable}
              variant="secondary"
              onClick={() => open()}
              className="cursor-pointer"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
