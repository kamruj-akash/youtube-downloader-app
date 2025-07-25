import YoutubeDownloader from "@/components/youtube-downloader"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-green-100 flex items-center justify-center p-4">
      <YoutubeDownloader />
    </div>
  )
}
