import React, { useRef, useEffect, useState } from 'react'
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaCaptionsButton,
  MediaMuteButton
} from 'media-chrome/react'
import MuxVideo from '@mux/mux-video-react'
import { Howl, Howler } from 'howler'

interface MuxVideoHTMLAttributes<T> extends React.VideoHTMLAttributes<T> {
  debug?: boolean
  autoplay?: boolean
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mux-video': React.DetailedHTMLProps<
        MuxVideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
      >
    }
  }
}

const Main = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const typingAreaRef = useRef<HTMLTextAreaElement>(null)
  const sounds = useRef<{ [key: string]: Howl }>({})
  const initiated = useRef<boolean>(false)
  const currentSubtitle = useRef<string>('')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const [previousSubtitle, setPreviousSubtitle] = useState<string>('')
  const forcePause = useRef<boolean>(false)
  const [currentTyped, setCurrentTyped] = useState<string>('')

  const handleLoad = () => {
    const textTracks = videoRef.current?.textTracks
    if (textTracks && textTracks[2]) {
      textTracks[2].mode = 'showing'
      typingAreaRef.current?.focus()
      sounds.current['type'] = new Howl({
        src: ['p1_shoot.wav'],
        volume: 0.25,
        rate: 1,
        loop: false,
        autoplay: false
      })
    }
  }

  const handleNextSubtitle = () => {
    const textTracks = videoRef.current?.textTracks
    currentSubtitle.current = textTracks[2].activeCues[0].text
    setPreviousSubtitle(currentSubtitle.current)
    forcePause.current = false
    videoRef.current?.play()
    setCurrentTyped('')
  }

  setInterval(() => {
    const textTracks = videoRef.current?.textTracks
    if (initiated.current === false) {
      if (
        textTracks &&
        textTracks[2] &&
        textTracks[2].activeCues &&
        textTracks[2].activeCues[0]
      ) {
        handleNextSubtitle()
        initiated.current = true
      }
      return
    }

    if (forcePause.current) {
      videoRef.current?.pause()
    }
    if (videoRef.current?.paused) {
      return
    }

    if (
      textTracks &&
      textTracks[2] &&
      textTracks[2]?.activeCues?.[0]?.text &&
      textTracks[2]?.activeCues?.[0]?.text !== currentSubtitle.current
    ) {
      console.log('pausing')
      forcePause.current = true
      //   setCurrentSubtitle(textTracks[2].activeCues[0].text)
    }
  }, 50)

  useEffect(() => {
    if (!initiated.current) {
      return
    }
    sounds.current['type'].play()
    if (forcePause.current) {
      if (currentTyped === currentSubtitle.current) {
        handleNextSubtitle()
      }
    }
  }, [currentTyped, forcePause])

  return (
    <div className='flex flex-col items-center justify-start h-screen relative'>
      {/* <h1 className='text-4xl font-bold mb-3'>Typing of the Mux</h1> */}
      {/* <mux-video playback-id="PLtkNjmv028bYRJr8BkDlGw7SHOGkCl4d" src="https://stream.mux.com/PLtkNjmv028bYRJr8BkDlGw7SHOGkCl4d.m3u8" slot="media" crossorigin="" tabindex="-1"></mux-video> */}
      <img
        className='max-w-[1024px] w-full h-auto absolute top-0 left-1/2 -translate-x-1/2'
        src='https://techsev.github.io/weddevchallenge-s2e3/tofd-arcade.png'
      />
      <div className='max-w-[640px] w-[63%]  mt-[45%] lg:mt-[490px] relative z-10 m-20'>
        <MediaController>
          <MuxVideo
            ref={videoRef}
            className='w-full max-w-[640px] aspect-[4/3] rounded-lg overflow-hidden'
            slot='media'
            playbackId='LIWGP8yTXPfGlWqnUMAJFCqxsPagJVC5tC6Bc18QCE4'
            preload='auto'
            crossOrigin=''
            default-captions-language='en'
            caption-language='en'
            onCanPlay={handleLoad}
          ></MuxVideo>
          <MediaControlBar>
            <MediaPlayButton></MediaPlayButton>
            <MediaTimeRange></MediaTimeRange>
            <MediaTimeDisplay showDuration></MediaTimeDisplay>
            <MediaCaptionsButton></MediaCaptionsButton>
            <MediaMuteButton></MediaMuteButton>
            <MediaVolumeRange></MediaVolumeRange>
          </MediaControlBar>
        </MediaController>
        {isPlaying === false && (
          <div className='absolute top-0 left-0 w-full h-full bg-black z-20'>
            <button
              onClick={() => {
                videoRef.current?.play()
                setIsPlaying(true)
              }}
              className='text-white text-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute z-30 border-2 border-white rounded-lg p-2'
            >
              Click To Start
            </button>
          </div>
        )}
        <div
          id='subtitle-box'
          className='text-white text-md xl:text-2xl relative z-10 bg-black rounded-lg p-2 min-h-[3em] outline-red'
        >
          {previousSubtitle}
        </div>
        <div
          id='subtitle-box-2'
          className='text-white text-md xl:text-2xl relative z-10 bg-black rounded-lg p-2 mt-2'
        >
          {/* <p className='mb-2 text-red-500'>
            Type the above subtitles in the input box below to continue playing
            the video
          </p> */}
          <textarea
            placeholder='Type The Subtitles Here To Continue Playing The Video'
            ref={typingAreaRef}
            className='w-full h-full border-2 border-white rounded-lg p-2 bg-gray-900'
            value={currentTyped}
            onChange={(e) => {
              setCurrentTyped(e.target.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Main
