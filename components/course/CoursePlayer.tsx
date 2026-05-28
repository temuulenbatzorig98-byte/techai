'use client'
import { useRef, useEffect, useCallback } from 'react'

interface CoursePlayerProps {
  lessonId: string
  videoUrl: string
  startAt?: number
  onProgress?: (seconds: number) => void
  onComplete?: () => void
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}?rel=0`
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') {
        const v = u.searchParams.get('v')
        if (v) return `https://www.youtube.com/embed/${v}?rel=0`
      }
      if (u.pathname.startsWith('/embed/')) {
        return url
      }
    }
  } catch {}
  return null
}

export function CoursePlayer({ lessonId, videoUrl, startAt = 0, onProgress, onComplete }: CoursePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSaved = useRef(0)

  const saveProgress = useCallback(
    async (time: number, completed = false) => {
      if (time - lastSaved.current < 10 && !completed) return
      lastSaved.current = time
      await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        body: JSON.stringify({ watchedTime: Math.floor(time), completed }),
        headers: { 'Content-Type': 'application/json' },
      })
      onProgress?.(Math.floor(time))
    },
    [lessonId, onProgress]
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = startAt

    const onTimeUpdate = () => saveProgress(video.currentTime)
    const onEnded = () => {
      saveProgress(video.duration, true)
      onComplete?.()
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [startAt, saveProgress, onComplete])

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl)

  if (youtubeEmbedUrl) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={youtubeEmbedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Хичээлийн видео"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full h-full"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  )
}
