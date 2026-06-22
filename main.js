console.log('main.js loaded')


import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, base } from '@reown/appkit/networks'

// ===== RANDOM QUOTE =====
const quotes = [
  "Sometimes, things don't always go to plan.",
  "I hate you more than I love me, and I love me very much.",
  "Your sins are yours, and my sins are also yours.",
  "Call him the biggest coward, he who fears the truth.",
  "Know your enemy.",
  "Press the damn button.",
  "They took my best years from me.",
  "When I meet a sinless man, I will claim to have found God."
]

const quoteElement = document.getElementById('random-quote')
if (quoteElement) {
  quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)]
}

// ===== WALLET CONNECT =====
const projectId = 'd759ea6b6772ffe841237056e50c84e6'
const networks = [mainnet, polygon, base]

const wagmiAdapter = new WagmiAdapter({ projectId, networks })

console.log('before AppKit')

const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata: {
    name: 'Anand Sharma Art',
    description: 'Digital Art Gallery & Marketplace',
    url: window.location.origin,
    icons: ['https://yourdomain.com/favicon.ico']
  },
  projectId,
  excludeWalletIds: [
    '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4'
  ],
  features: {
    analytics: false,
    connectMethodsOrder: ['wallet'],
    networkSwitcher: false
  },
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa'
  ],
  enableWalletConnect: false
})

console.log(modal)
console.log('after AppKit')

// ===== CONNECT BUTTON =====
const connectBtn = document.getElementById('connect-button')

if (connectBtn) {
  connectBtn.addEventListener('click', async () => {
    console.log('CONNECT BUTTON CLICKED')

    try {
      console.log('modal.open exists:', typeof modal.open)

      const result = await modal.open({ view: 'Connect' })

      console.log('OPEN CALLED SUCCESSFULLY')
      console.log('OPEN RESULT:', result)

      // Check whether modal element appeared
      setTimeout(() => {
        console.log(
          'appkit modal:',
          document.querySelector('appkit-modal')
        )

        console.log(
          'w3m modal:',
          document.querySelector('w3m-modal')
        )
      }, 1000)

    } catch (err) {
      console.error('OPEN FAILED')
      console.error(err)
    }
  })
}

modal.subscribeEvents((event) => {
  const eventData = event?.data
  const btn = document.getElementById('connect-button')
  if (!btn) return

  if (eventData?.event === 'CONNECT_SUCCESS') {
    btn.classList.add('connected')
  }
  if (
    eventData?.event === 'DISCONNECT_SUCCESS' ||
    eventData?.event === 'DISCONNECTED' ||
    eventData?.event === 'LOGOUT'
  ) {
    btn.classList.remove('connected')
  }
})

modal.subscribeEvents(event => {
  const btn = document.getElementById('connect-button')
  if (!btn) return

  if (event.data.event === 'connected') {
    btn.classList.add('connected')
    btn.textContent = 'Connected'
  } else if (event.data.event === 'disconnected') {
    btn.classList.remove('connected')
    btn.textContent = 'Connect Wallet'
  }
})

// ===== HOME BUTTON =====
const homeBtn = document.getElementById('home-button')
if (homeBtn) {
  homeBtn.addEventListener('click', () => {
    document.body.classList.add('fade-out')
    setTimeout(() => { window.location.href = '/' }, 350)
  })
}

// ===== THEME TOGGLE =====
const toggleBtn = document.getElementById('theme-toggle')
if (toggleBtn) {
  // Set correct emoji on load based on initial theme
  const initialTheme = document.documentElement.getAttribute('data-theme')
  toggleBtn.textContent = initialTheme === 'dark' ? '☀️' : '🌙'

  toggleBtn.addEventListener('click', () => {
    const html = document.documentElement
    const current = html.getAttribute('data-theme')
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark')
    toggleBtn.textContent = current === 'dark' ? '🌙' : '☀️'
  })
}

// ===== EMAIL BUTTON =====
// On click: copy email, button shows ✓ for 2s then reverts to ✉️
const emailBtn = document.getElementById('email-button')
const email = 'youremail@example.com'

if (emailBtn) {
  emailBtn.addEventListener('click', () => {
    const original = emailBtn.textContent

    const confirm = () => {
      emailBtn.textContent = '✅'
      setTimeout(() => {
        emailBtn.textContent = original
      }, 1000)
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(confirm)
        .catch(() => {
          // Fallback
          const ta = document.createElement('textarea')
          ta.value = email
          ta.style.position = 'fixed'
          ta.style.opacity = '0'
          document.body.appendChild(ta)
          ta.focus()
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
          confirm()
        })
    } else {
      const ta = document.createElement('textarea')
      ta.value = email
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      confirm()
    }
  })
}