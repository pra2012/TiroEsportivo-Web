import React, { useState, createContext, useContext } from "react";

const GlobalUploadContext = createContext();

export const useGlobalUpload = () => {
  const context = useContext(GlobalUploadContext);
  if (!context) {
    throw new Error('useGlobalUpload must be used within a GlobalUploadProvider');
  }
  return context;
};

export const GlobalUploadProvider = ({ children }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, fileName: '' });
    const [extractedData, setExtractedData] = useState(null);
    const [showExtractor, setShowExtractor] = useState(false);

    const value = {
        isUploading,
        setIsUploading,
        uploadProgress,
        setUploadProgress,
        extractedData,
        setExtractedData,
        showExtractor,
        setShowExtractor
    };

    return (
        <GlobalUploadContext.Provider value={value}>
            {children}
        </GlobalUploadContext.Provider>
    );
};

