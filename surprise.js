const cv = document.querySelector('canvas')
const ctx = cv.getContext('2d')
const W = 1080, H = 1920
const GOLD = '#ffd46b', PINK = '#ff6fb5'
const COLORS = [GOLD, PINK, '#b77bff', '#6fc3ff']
const rnd = (a, b) => a + Math.random() * (b - a)
const pick = a => a[Math.floor(Math.random() * a.length)]
const WORD = 'YOU'
const SERIF = '"Playfair Display", serif'
const stars = Array.from({ length: 1400 }, () => ({
  x: rnd(0, W), y: rnd(0, 1300),
  r: rnd(0.4, 2.2), p: rnd(0, 6.3)
}))
const motes = Array.from({ length: 140 }, () => ({
  x: rnd(0, W), y: rnd(0, H), v: rnd(14, 40)
}))
let rockets = [], sparks = []
let last = 0

function sky(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#07062a')
  g.addColorStop(0.6, '#2a0f4f')
  g.addColorStop(1, '#ff9a3c')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#fff3cf'
  for (const s of stars) {
    const tw = Math.sin(t * 2.2 + s.p)
    ctx.globalAlpha = 0.5 + 0.5 * tw
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, 6.283)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  ctx.fillStyle = '#fff1c7'
  ctx.beginPath()
  ctx.arc(800, 360, 105, 0, 6.283)
  ctx.fill()
}

function diyas(t) {
  for (let i = 0; i < 7; i++) {
    const x = 120 + i * 150, y = 1720 + (i % 2) * 40
    const f = 34 + 8 * Math.sin(t * 13 + i)
    ctx.fillStyle = '#c2611a'
    ctx.fillRect(x - 60, y, 120, 18)
    ctx.fillStyle = '#ffe08a'
    ctx.beginPath()
    ctx.ellipse(x, y - f / 2, 9, f / 2, 0, 0, 6.283)
    ctx.fill()
  }
}

function heart(x, y, s, c) {
  ctx.fillStyle = c
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.3)
  ctx.bezierCurveTo(x, y - s * 0.3,
    x - s, y - s * 0.3, x - s, y + s * 0.1)
  ctx.bezierCurveTo(x - s, y + s * 0.6,
    x, y + s * 0.9, x, y + s)
  ctx.bezierCurveTo(x, y + s * 0.9,
    x + s, y + s * 0.6, x + s, y + s * 0.1)
  ctx.bezierCurveTo(x + s, y - s * 0.3,
    x, y - s * 0.3, x, y + s * 0.3)
  ctx.fill()
}

function intro(t) {
  ctx.textAlign = 'center'
  ctx.fillStyle = GOLD
  ctx.font = 'italic 56px ' + SERIF
  ctx.fillText('Someone Special Is Waiting',
    W / 2, 820)
  ctx.fillText('For A Magical Diwali Surprise',
    W / 2, 895)
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 3
  ctx.shadowColor = GOLD
  ctx.shadowBlur = 30
  ctx.beginPath()
  ctx.roundRect(140, 1000, 800, 130, 26)
  ctx.stroke()
  ctx.shadowBlur = 0
    const typed_n = Math.floor((t - 3) / 0.6)
    const n = Math.min(3, Math.max(0, typed_n))
  const typed = WORD.slice(0, n)
  ctx.textAlign = 'left'
  ctx.font = '600 58px Poppins, sans-serif'
  ctx.fillStyle = typed ? '#fff3cf' : '#b8913f'
  const hint = 'Enter Your Name...'
  ctx.fillText(typed || hint, 185, 1085)
  const press = t > 5.6 && t < 5.9
  const s = press ? 0.95 : 1
  ctx.save()
  ctx.translate(W / 2, 1265)
  ctx.scale(s, s)
  ctx.fillStyle = GOLD
  ctx.beginPath()
  ctx.roundRect(-300, -60, 600, 120, 60)
  ctx.fill()
  ctx.fillStyle = '#2a0f4f'
  ctx.font = '700 46px Poppins, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Open Your Surprise', 0, 16)
  ctx.restore()
}

function fireworks(dt) {
  if (Math.random() < dt * 3.4) {
    const x = rnd(120, W - 120), c = pick(COLORS)
    rockets.push({ x, y: H, ty: rnd(380, 1000), c })
  }
  for (const r of rockets) r.y -= 900 * dt
  rockets = rockets.filter(r => {
    if (r.y > r.ty) return true
    for (let i = 0; i < 140; i++) {
      const a = rnd(0, 6.283), v = rnd(180, 520)
      sparks.push({
        x: r.x, y: r.y, c: r.c, life: 1,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v
      })
    }
    return false
  })
  for (const s of sparks) {
    s.x += s.vx * dt
    s.y += s.vy * dt
    s.vy += 260 * dt
    s.life -= dt * 0.55
    ctx.globalAlpha = Math.max(0, s.life)
    ctx.fillStyle = s.c
    ctx.fillRect(s.x, s.y, 10, 10)
  }
  sparks = sparks.filter(s => s.life > 0)
  ctx.globalAlpha = 1
}

function frame() {
  const t = performance.now() / 1000
  const dt = Math.min(0.05, t - last)
  last = t
  sky(t)
  ctx.fillStyle = GOLD
  for (const m of motes) {
    m.y -= m.v * dt
    if (m.y < 0) m.y = H
    ctx.fillRect(m.x, m.y, 3, 3)
  }
  diyas(t)
  if (t < 6.2) intro(t)
  else fireworks(dt)
  if (t > 6.2 && t < 7.4) {
    const f = (t - 6.2) / 1.2
    ctx.globalAlpha = Math.sin(f * Math.PI)
    ctx.fillStyle = '#ffe9a8'
    ctx.fillRect(0, 0, W, H)
    ctx.globalAlpha = 1
  }
  if (t > 8.5 && t < 12.6) {
    ctx.textAlign = 'center'
    ctx.fillStyle = GOLD
    ctx.font = 'italic 700 96px ' + SERIF
    const msg = 'Happy Diwali, ' + WORD + '!'
    ctx.fillText(msg, W / 2, 960)
  }
  if (t > 13.4) {
    const beat = 90 + 6 * Math.sin(t * 5)
    heart(W / 2, 1000, beat, PINK)
    ctx.textAlign = 'center'
    ctx.fillStyle = GOLD
    ctx.font = 'italic 700 104px ' + SERIF
    ctx.fillText('Happy Diwali,', W / 2, 1200)
    ctx.fillText("My Life's Light", W / 2, 1320)
    ctx.font = '500 40px Poppins, sans-serif'
    ctx.fillText('Keep Smiling, Keep Shining,',
      W / 2, 1410)
    ctx.fillText('and Always Stay Mine', W / 2, 1470)
  }
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
