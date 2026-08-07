/**
 * QCRM color tokens — keep in sync with `app.theme.scss` `:root`.
 * Use this for TypeScript (charts, SweetAlert, StatusService, inline styles).
 * Prefer CSS `var(--token)` in SCSS templates.
 *
 * Soft slate-blue:
 * #1E3A5F · #3B82A0 · #2F6F8F · #F4F7FA · #334155
 */
export const colors = {
    // สีหลัก — soft navy
    primary: '#1e3a5f',
    primaryActive: '#2a4f73',
    primarySoft: '#e3eef3',

    // สีเน้น / CTA — ฟ้าอมเทา
    accent: '#3b82a0',
    accentActive: '#2f6f8f',
    accentSoft: '#e3eef3',

    // Blues
    blueDark: '#1e3a5f',
    blueDarkHover: '#2a4f73',
    blueMid: '#3b82a0',
    blueSoft: '#e3eef3',
    blueSoftAlt: '#d0e4ec',
    blueWhisper: '#eef4f7',
    blueChatBubble: '#d6e8f0',
    blueChatHover: '#e3eef3',
    lightSky: '#3b82a0',

    // Accents / status
    lighterRed: '#ec5365',
    danger: '#dc3545',
    dangerSoft: '#fff5f5',
    lighterGreen: '#53ec62',
    success: '#28a745',
    successDark: '#006400',
    warning: '#ffc107',
    gold: '#ffd700',
    info: '#3b82a0',

    // Channels — brand-inspired แต่ปรับเฉดให้เข้า soft slate-blue
    channelVoice: '#1e3a5f',
    channelLine: '#4aab72', // เขียวสดกว่าเล็กน้อย — แยกจาก WhatsApp
    channelFacebook: '#4a72a8',
    channelFacebookComment: '#6b7fa8',
    channelWhatsapp: '#3b82a0', // ฟ้าอมเขียว เข้า accent ของธีม
    channelTiktok: '#a67a8a', // dusty rose อ่อนลง ให้กลมกับ navy

    // Neutrals
    white: '#ffffff',
    black: '#000000',
    gray: '#94a3b8',
    text: '#334155',
    textSecondary: '#475569',
    textMuted: '#64748b',
    border: '#d5e0e8',
    borderLight: '#e8eef2',
    surface: '#f4f7fa',
    surfaceHover: '#e8eef2',
    chatThread: '#eef4f7',
} as const;

export type AppColor = (typeof colors)[keyof typeof colors];

/** กราฟรหัสเคส — เรียงตามสเปกตรัม navy → teal → green → soft gold */
export const chartPalette = [
    '#1e3a5f', // deep navy
    '#2a5f7a', // blue-teal
    '#3a7f8f', // teal
    '#4a9a8a', // teal-green
    '#7ab89a', // soft green
    '#9bc98a', // light green
    '#c9c07a', // soft gold-olive
    '#d4c98a', // soft gold
    '#e0d4a0', // pale gold
] as const;

export const statusPalette = [
    '#c9a227', // soft gold — Open (ต้องจัดการ)
    '#c17f4a', // warm amber — Pending (รอดำเนินการ)
    '#4a9a8a', // teal-green — Closed
    '#64748b', // muted gray — Cancelled
    '#1e3a5f', // navy
    '#3b82a0', // slate teal
    '#a67a8a', // dusty rose
    '#4a72a8', // slate blue
] as const;
