/**
 * Midtrans Snap.js Integration Service
 * Loads the Midtrans Snap.js script dynamically and provides
 * functions to initiate payments via the Snap popup.
 *
 * Environment variables needed (add to .env):
 *   VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
 *   VITE_MIDTRANS_IS_PRODUCTION=false
 */

const SNAP_URL_SANDBOX = 'https://app.sandbox.midtrans.com/snap/snap.js'
const SNAP_URL_PRODUCTION = 'https://app.midtrans.com/snap/snap.js'

let snapScriptLoaded = false

function getIsProduction(): boolean {
  return import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true'
}

export function getClientKey(): string {
  return import.meta.env.VITE_MIDTRANS_CLIENT_KEY || ''
}

/**
 * Dynamically load the Midtrans Snap.js script into the page.
 * Returns a promise that resolves when the script is ready.
 */
export function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (snapScriptLoaded && typeof window !== 'undefined' && (window as any).snap) {
      resolve()
      return
    }

    const existing = document.getElementById('midtrans-snap-script')
    if (existing) {
      existing.addEventListener('load', () => {
        snapScriptLoaded = true
        resolve()
      })
      return
    }

    const script = document.createElement('script')
    script.id = 'midtrans-snap-script'
    script.src = getIsProduction() ? SNAP_URL_PRODUCTION : SNAP_URL_SANDBOX
    script.setAttribute('data-client-key', getClientKey())
    script.async = true

    script.onload = () => {
      snapScriptLoaded = true
      resolve()
    }
    script.onerror = () => {
      reject(new Error('Failed to load Midtrans Snap.js script'))
    }

    document.head.appendChild(script)
  })
}

export interface SnapPaymentItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface SnapPaymentDetails {
  orderId: string
  amount: number
  items: SnapPaymentItem[]
  customerFirstName?: string
  customerEmail?: string
  customerPhone?: string
}

export interface SnapPayResult {
  status_code: string
  status_message: string
  transaction_id: string
  order_id: string
  payment_type: string
  transaction_status: string
  fraud_status: string
  gross_amount: string
}

/**
 * Open the Midtrans Snap popup for a given set of payment details.
 * The backend should create a transaction and return a snap_token.
 *
 * For DEMO/FRONTEND-ONLY mode: if snap token is not provided,
 * we simulate a successful payment after a delay.
 */
export async function openSnapPayment(
  details: SnapPaymentDetails,
  snapToken?: string,
): Promise<SnapPayResult> {
  await loadSnapScript()

  const snap = (window as any).snap
  if (!snap) {
    throw new Error('Midtrans Snap is not available')
  }

  // DEMO MODE: If no snap token, simulate payment
  if (!snapToken) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status_code: '200',
          status_message: 'Success',
          transaction_id: `TXN-${Date.now()}`,
          order_id: details.orderId,
          payment_type: 'online_payment',
          transaction_status: 'settlement',
          fraud_status: 'accept',
          gross_amount: String(details.amount),
        })
      }, 1500)
    })
  }

  // REAL MODE: Open Snap popup
  return new Promise((resolve, reject) => {
    snap.pay(snapToken, {
      onSuccess: (result: SnapPayResult) => resolve(result),
      onPending: (result: SnapPayResult) => resolve(result),
      onError: (error: any) => reject(error),
      onClose: () => reject(new Error('Payment popup was closed by user')),
    })
  })
}
