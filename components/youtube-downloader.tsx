"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Loader2,
  Download,
  Youtube,
  Music,
  Video,
  Github,
  Mail,
  Globe,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function YoutubeDownloader() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [selectedType, setSelectedType] = useState<"video" | "audio">("video");
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [selectedQuality, setSelectedQuality] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setErrorMessage("");
    setIsProcessed(false);
    setAvailableQualities([]);
    setSelectedQuality("");

    if (!youtubeLink.trim()) {
      setErrorMessage("Please enter a YouTube link.");
      return;
    }

    // Correct URL validation
    if (
      !youtubeLink.includes("youtube.com") &&
      !youtubeLink.includes("youtu.be")
    ) {
      setErrorMessage("Please enter a valid YouTube video link.");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    // Simulate processing with a progress bar
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

    clearInterval(interval);
    setProgress(100);

    // Simulate fetching available qualities based on selected type
    if (selectedType === "video") {
      setAvailableQualities(["1080p", "720p", "480p", "360p"]);
      setSelectedQuality("720p"); // Default selection
    } else {
      setAvailableQualities(["mp3"]);
      setSelectedQuality("mp3"); // Default selection
    }

    setIsLoading(false);
    setIsProcessed(true);
  };

  const handleDownload = () => {
    if (!youtubeLink.trim() || !selectedQuality) {
      setErrorMessage("Please enter a valid link and select a quality.");
      return;
    }

    // Correct URL validation
    if (
      !youtubeLink.includes("youtube.com") &&
      !youtubeLink.includes("youtu.be")
    ) {
      setErrorMessage("Please enter a valid YouTube video link.");
      return;
    }

    // API endpoint-এর URL তৈরি করুন
    const downloadUrl = `/api/download?url=${encodeURIComponent(
      youtubeLink
    )}&type=${selectedType}&quality=${selectedQuality}`;

    // নতুন ট্যাবে ডাউনলোড লিঙ্কটি খুলুন
    window.open(downloadUrl, "_blank");
  };

  // Reset qualities when type changes after processing
  useEffect(() => {
    if (isProcessed) {
      if (selectedType === "video") {
        setAvailableQualities(["1080p", "720p", "480p", "360p"]);
        setSelectedQuality("720p");
      } else {
        setAvailableQualities(["mp3"]);
        setSelectedQuality("mp3");
      }
    }
  }, [selectedType, isProcessed]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-xl overflow-hidden animate-fade-in-up">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 text-center">
        <CardTitle className="text-4xl font-extrabold flex items-center justify-center gap-3 mb-2">
          <Youtube className="w-10 h-10 animate-bounce-slow" />
          YouTube Downloader
        </CardTitle>
        <CardDescription className="text-purple-200 text-lg">
          Paste your YouTube link and get ready to download!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6 bg-white">
        <div className="space-y-2">
          <Label
            htmlFor="youtube-link"
            className="text-lg font-semibold text-gray-800"
          >
            YouTube Video Link
          </Label>
          <Input
            id="youtube-link"
            placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="h-12 text-base border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 shadow-sm"
          />
          {errorMessage && (
            <p className="text-red-600 text-sm mt-1 animate-fade-in">
              {errorMessage}
            </p>
          )}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing... ({progress}%)
            </>
          ) : (
            "Generate Download Options"
          )}
        </Button>

        {isLoading && (
          <Progress
            value={progress}
            className="w-full h-2 bg-gray-200 rounded-full overflow-hidden [&>*]:bg-gradient-to-r [&>*]:from-green-400 [&>*]:to-teal-400 animate-pulse"
          />
        )}

        {isProcessed && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-gray-800">
                Choose Type
              </Label>
              <RadioGroup
                value={selectedType}
                onValueChange={(value: "video" | "audio") =>
                  setSelectedType(value)
                }
                className="flex gap-4 justify-center"
              >
                <Label
                  htmlFor="type-video"
                  className="flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 [&:has(:checked)]:bg-purple-50 [&:has(:checked)]:border-purple-500 shadow-sm"
                >
                  <RadioGroupItem
                    id="type-video"
                    value="video"
                    className="sr-only"
                  />
                  <Video className="w-7 h-7 text-purple-600" />
                  <span className="font-medium">Video</span>
                </Label>
                <Label
                  htmlFor="type-audio"
                  className="flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 [&:has(:checked)]:bg-purple-50 [&:has(:checked)]:border-purple-500 shadow-sm"
                >
                  <RadioGroupItem
                    id="type-audio"
                    value="audio"
                    className="sr-only"
                  />
                  <Music className="w-7 h-7 text-purple-600" />
                  <span className="font-medium">Audio</span>
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="quality-select"
                className="text-lg font-semibold text-gray-800"
              >
                Choose Quality
              </Label>
              <Select
                value={selectedQuality}
                onValueChange={setSelectedQuality}
              >
                <SelectTrigger
                  id="quality-select"
                  className="h-12 text-base border-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 shadow-sm"
                >
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  {availableQualities.map((quality) => (
                    <SelectItem key={quality} value={quality}>
                      {quality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleDownload}
              disabled={!selectedQuality}
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Download className="mr-2 h-5 w-5" />
              Download
            </Button>
            <p className="text-sm text-center text-gray-500 mt-4">
              Note: Actual video/audio download requires a backend server. This
              is a UI demonstration.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 border-t border-gray-200 text-center text-sm text-gray-600">
        <div className="w-full flex flex-col items-center space-y-2">
          <p className="font-semibold">Developed by KAMRUZZAMAN AKASH</p>
          <div className="flex gap-4">
            <a
              href="https://github.com/kamruj-akash"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href="mailto:source.akash@gmail.com"
              className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Mail className="w-4 h-4" /> Email
            </a>
            <a
              href="https://kamruj.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Globe className="w-4 h-4" /> Website
            </a>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
