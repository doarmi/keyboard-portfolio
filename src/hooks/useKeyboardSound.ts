import { useCallback, useEffect, useRef, useState } from 'react'

const preferenceKey = 'keyboard-portfolio:sound'

export function useKeyboardSound() {
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem(preferenceKey) === 'on' } catch { return false }
  })
  const enabled = useRef(soundOn)
  const context = useRef<AudioContext | null>(null)
  const noise = useRef<AudioBuffer | null>(null)

  const play = useCallback(() => {
    if (!enabled.current) return
    try {
      const Audio = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Audio) return
      const ctx = context.current ?? (context.current = new Audio())
      const strike = () => {
        if (!enabled.current || context.current !== ctx || ctx.state !== 'running') return
        const now = ctx.currentTime
        if (!noise.current) {
          const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * .045), ctx.sampleRate)
          const samples = buffer.getChannelData(0)
          for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1
          noise.current = buffer
        }
        const source = ctx.createBufferSource()
        const filter = ctx.createBiquadFilter()
        const gain = ctx.createGain()
        source.buffer = noise.current
        filter.type = 'lowpass'
        filter.frequency.value = 2200
        gain.gain.setValueAtTime(.0001, now)
        gain.gain.exponentialRampToValueAtTime(.13, now + .002)
        gain.gain.exponentialRampToValueAtTime(.0001, now + .04)
        source.connect(filter).connect(gain).connect(ctx.destination)
        source.start(now)
        source.stop(now + .045)
        source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect() }
        const body = ctx.createOscillator()
        const bodyGain = ctx.createGain()
        body.type = 'sine'
        body.frequency.setValueAtTime(190, now)
        body.frequency.exponentialRampToValueAtTime(85, now + .055)
        bodyGain.gain.setValueAtTime(.0001, now)
        bodyGain.gain.exponentialRampToValueAtTime(.09, now + .003)
        bodyGain.gain.exponentialRampToValueAtTime(.0001, now + .065)
        body.connect(bodyGain).connect(ctx.destination)
        body.start(now)
        body.stop(now + .07)
        body.onended = () => { body.disconnect(); bodyGain.disconnect() }
      }
      if (ctx.state === 'running') strike()
      else void ctx.resume().then(strike).catch(() => {})
    } catch { /* Audio support must never block navigation. */ }
  }, [])

  const toggleSound = useCallback(() => {
    const next = !enabled.current
    enabled.current = next
    setSoundOn(next)
    try { localStorage.setItem(preferenceKey, next ? 'on' : 'off') } catch { /* Private storage can be unavailable. */ }
    if (next) play()
  }, [play])

  useEffect(() => () => {
    const ctx = context.current
    context.current = null
    noise.current = null
    if (ctx && ctx.state !== 'closed') void ctx.close().catch(() => {})
  }, [])

  return { soundOn, toggleSound, play }
}
