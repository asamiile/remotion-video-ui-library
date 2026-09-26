import {
  NEON_FLICKER_CYCLE_MS,
  neonFlickerAt,
  type NeonFlickerState,
} from "../../helpers/effect-neon-flicker";

/**
 * The curve used when porting the asami.tokyo LP's CTA hover neon-flicker
 * (`.cta-flicker` in `app/(onetake)/onetake.css`) to a frame-based animation.
 * The actual implementation now lives in the generic `helpers/effect-neon-flicker.ts`;
 * this file just re-exports it under the OneTake-side name so existing imports
 * (e.g. in `OnboardingConnect`) keep working. New Title-style compositions
 * should import `helpers/effect-neon-flicker.ts` directly instead.
 */
export const CTA_FLICKER_CYCLE_MS = NEON_FLICKER_CYCLE_MS;
export const ctaFlickerAt = neonFlickerAt;
export type CtaFlickerState = NeonFlickerState;
