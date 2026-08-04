/**
 * QCRM color tokens — keep in sync with `app.theme.scss` `:root`.
 * Use this for TypeScript (charts, SweetAlert, StatusService, inline styles).
 * Prefer CSS `var(--token)` in SCSS templates.
 */
export const colors = {
    // Brand
    primary: '#fb5f20',
    primaryActive: '#ff8040',
    primarySoft: '#fff0e9',

    // Blues
    blueDark: '#010966',
    blueDarkHover: '#020b80',
    blueMid: '#3066be',
    blueSoft: '#f0f4ff',
    blueSoftAlt: '#e8ecff',
    blueWhisper: '#eef5ff',
    blueChatBubble: '#d7e8ff',
    blueChatHover: '#e9f2ff',
    lightSky: '#20a0ff',

    // Accents / status
    lighterRed: '#ec5365',
    danger: '#dc3545',
    dangerSoft: '#fff5f5',
    lighterGreen: '#53ec62',
    success: '#28a745',
    successDark: '#006400',
    warning: '#ffc107',
    gold: '#ffd700',
    info: '#17a2b8',

    // Channels
    channelVoice: '#17a2b8',
    channelLine: '#06c755',
    channelFacebook: '#1877f2',
    channelFacebookComment: '#6a6ce2',

    // Neutrals
    white: '#ffffff',
    black: '#000000',
    gray: '#acabab',
    text: '#212529',
    textSecondary: '#495057',
    textMuted: '#6c757d',
    border: '#dee2e6',
    borderLight: '#e9ecef',
    surface: '#f8f9fa',
    surfaceHover: '#e9ecef',
    chatThread: '#f3f5f7',
} as const;

export type AppColor = (typeof colors)[keyof typeof colors];

/** Palette used by charts / status hashing */
export const chartPalette = [colors.primary, colors.blueDark, colors.gold] as const;

export const statusPalette = [colors.primary, colors.blueDark, colors.successDark, colors.textMuted, colors.warning, colors.danger] as const;
