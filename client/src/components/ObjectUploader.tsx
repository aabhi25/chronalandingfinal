import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ObjectUploaderProps {
  maxFileSize?: number;
  onComplete?: (result: { success: boolean; imageUrl?: string; error?: string }) => void;
  buttonClassName?: string;
  children: ReactNode;
}

/**
 * A simple file upload component that uploads images to the local server
 */
export function ObjectUploader({
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onComplete?.({ success: false, error: "Please select an image file" });
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      onComplete?.({ success: false, error: `File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB` });
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentage = (e.loaded / e.total) * 100;
          setProgress(percentage);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            onComplete?.({ 
              success: true, 
              imageUrl: response.imageUrl 
            });
          } catch (error) {
            onComplete?.({ success: false, error: "Invalid response from server" });
          }
        } else {
          onComplete?.({ success: false, error: "Upload failed" });
        }
        setUploading(false);
        setProgress(0);
      });

      xhr.addEventListener('error', () => {
        onComplete?.({ success: false, error: "Upload failed" });
        setUploading(false);
        setProgress(0);
      });

      // Upload the file
      xhr.open('POST', '/api/admin/upload');
      xhr.setRequestHeader('Authorization', 'Bearer Abhk#8shm3');
      xhr.send(formData);

    } catch (error) {
      onComplete?.({ success: false, error: "Upload failed" });
      setUploading(false);
      setProgress(0);
    }

    // Clear the input
    event.target.value = '';
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button 
        onClick={handleFileSelect} 
        className={buttonClassName}
        disabled={uploading}
      >
        {children}
      </Button>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}