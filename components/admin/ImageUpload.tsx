"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { CloudUpload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onRemove: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    onRemove
}) => {
    const onUploadSuccess = (result: any) => {
        onChange(result.info.secure_url);
    };

    return (
        <div className="space-y-4 w-full flex flex-col items-center justify-center">
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border border-white/10 group">
                        <div className="z-10 absolute top-2 right-2">
                            <button
                                type="button"
                                onClick={() => onRemove()}
                                className="p-1.5 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <img
                            src={value}
                            alt="Uploaded image"
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium">Change Image</span>
                        </div>
                    </div>
                ) : (
                    <div className="w-[200px] h-[150px] rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 group hover:border-neon-purple/50 transition-all cursor-pointer">
                        <ImageIcon className="text-gray-500 group-hover:text-neon-purple transition-colors" size={32} />
                        <span className="text-gray-400 text-xs text-center px-4">No image uploaded</span>
                    </div>
                )}

                <CldUploadWidget
                    onSuccess={onUploadSuccess}
                    signatureEndpoint="/api/cloudinary-signature"
                >
                    {({ open }) => {
                        return (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl transition-all border border-white/10 font-medium text-sm"
                            >
                                <CloudUpload size={18} />
                                {value ? "Replace Image" : "Upload Image"}
                            </button>
                        );
                    }}
                </CldUploadWidget>
            </div>

            {value && (
                <div className="text-[10px] text-gray-500 break-all bg-white/5 p-2 rounded-lg border border-white/5 w-full max-w-md">
                    <span className="font-bold uppercase mr-1">URL:</span> {value}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
