import type { poseActions } from "./pose-estimation.schema";

export type PoseAction = (typeof poseActions)[number];
export type Point = { x: number; y: number };

/** COCO keypoint order. */
export const KEYPOINTS = [
  "nose",
  "leftEye",
  "rightEye",
  "leftEar",
  "rightEar",
  "leftShoulder",
  "rightShoulder",
  "leftElbow",
  "rightElbow",
  "leftWrist",
  "rightWrist",
  "leftHip",
  "rightHip",
  "leftKnee",
  "rightKnee",
  "leftAnkle",
  "rightAnkle",
] as const;
export type KeypointName = (typeof KEYPOINTS)[number];
export type Pose = Record<KeypointName, Point>;

/** Skeleton edges with a rainbow-ordered color each (head → arms → legs). */
export const SKELETON: [KeypointName, KeypointName, string][] = [
  ["nose", "leftEye", "#ff2d7a"],
  ["nose", "rightEye", "#ff2dc8"],
  ["leftEye", "leftEar", "#d22dff"],
  ["rightEye", "rightEar", "#8a2dff"],
  ["leftEar", "leftShoulder", "#ff2d4a"],
  ["rightEar", "rightShoulder", "#ff4a2d"],
  ["leftShoulder", "rightShoulder", "#ff3b2f"],
  ["leftShoulder", "leftElbow", "#ff8a1f"],
  ["leftElbow", "leftWrist", "#ffd21f"],
  ["rightShoulder", "rightElbow", "#b6ff1f"],
  ["rightElbow", "rightWrist", "#4cff3b"],
  ["leftShoulder", "leftHip", "#1fffa0"],
  ["rightShoulder", "rightHip", "#1fffe8"],
  ["leftHip", "rightHip", "#1fc8ff"],
  ["leftHip", "leftKnee", "#1f8aff"],
  ["leftKnee", "leftAnkle", "#2d4cff"],
  ["rightHip", "rightKnee", "#5a2dff"],
  ["rightKnee", "rightAnkle", "#9a2dff"],
];

/** Gait / action cycles per second; rounded to whole cycles per loop. */
export const ACTION_RATE: Record<PoseAction, number> = {
  walk: 1.2,
  wave: 1,
  jump: 0.8,
  squat: 0.6,
  dance: 1,
};

// Segment lengths in body heights.
const TORSO = 0.3;
const UPPER_ARM = 0.16;
const FOREARM = 0.15;
const THIGH = 0.245;
const SHIN = 0.235;
const PELVIS_HEIGHT = 0.5;

type Limb = { upper: number; lower: number };
type Rig = {
  side: boolean;
  bob: number;
  shiftX: number;
  lean: number;
  leftArm: Limb;
  rightArm: Limb;
  leftLeg: Limb;
  rightLeg: Limb;
};

function rig(action: PoseAction, c: number): Rig {
  const s = Math.sin(c);
  switch (action) {
    case "walk": {
      const bend = (k: number) => 0.12 + 0.6 * Math.max(0, Math.sin(c + k + Math.PI * 0.6));
      const thighL = 0.42 * s;
      const thighR = -0.42 * s;
      return {
        side: true,
        bob: 0.012 * Math.cos(2 * c),
        shiftX: 0,
        lean: 0.05,
        leftArm: { upper: -0.35 * s, lower: -0.35 * s + 0.35 },
        rightArm: { upper: 0.35 * s, lower: 0.35 * s + 0.35 },
        leftLeg: { upper: thighL, lower: thighL - bend(0) },
        rightLeg: { upper: thighR, lower: thighR - bend(Math.PI) },
      };
    }
    case "wave": {
      const wave = Math.sin(c * 3);
      return {
        side: false,
        bob: 0,
        shiftX: 0,
        lean: 0,
        leftArm: { upper: 0.15, lower: 0.1 },
        rightArm: { upper: 2.3, lower: 2.9 + 0.35 * wave },
        leftLeg: { upper: 0.08, lower: 0.05 },
        rightLeg: { upper: 0.08, lower: 0.05 },
      };
    }
    case "jump": {
      const crouch = Math.max(0, -s);
      const air = Math.max(0, s);
      const leg = { upper: 0.1 + crouch * 0.6, lower: 0.1 - crouch * 0.5 };
      const arm = { upper: 0.25 + air * 2.5, lower: 0.45 + air * 2.6 };
      return {
        side: false,
        bob: air * 0.16 - crouch * 0.08,
        shiftX: 0,
        lean: 0,
        leftArm: arm,
        rightArm: arm,
        leftLeg: leg,
        rightLeg: leg,
      };
    }
    case "squat": {
      const d = (1 - Math.cos(c)) / 2;
      const leg = { upper: d * 1.45, lower: d * 1.45 - d * 2.3 };
      const arm = { upper: d * 1.5, lower: d * 1.55 };
      return {
        side: true,
        bob: -d * 0.2,
        shiftX: -d * 0.04,
        lean: d * 0.4,
        leftArm: arm,
        rightArm: { upper: arm.upper + 0.05, lower: arm.lower + 0.05 },
        leftLeg: leg,
        rightLeg: { upper: leg.upper + 0.04, lower: leg.lower + 0.04 },
      };
    }
    case "dance": {
      const l = Math.max(0, s);
      const r = Math.max(0, -s);
      return {
        side: false,
        bob: 0.015 * Math.abs(Math.cos(c)),
        shiftX: 0.04 * s,
        lean: 0.08 * s,
        leftArm: { upper: 1.2 + 0.9 * s, lower: 2.0 + 0.9 * s },
        rightArm: { upper: 1.2 - 0.9 * s, lower: 2.0 - 0.9 * s },
        leftLeg: { upper: 0.12 + 0.35 * l, lower: 0.12 - 0.1 * l },
        rightLeg: { upper: 0.12 + 0.35 * r, lower: 0.12 - 0.1 * r },
      };
    }
  }
}

/**
 * Keypoints in body heights: origin on the ground under the pelvis, y up.
 * Side-view actions face `facing`; front-view actions face the camera, so the
 * figure's left side is on screen right. Limb angles are measured from
 * straight down, positive = forward (side view) or outward (front view).
 */
export function poseAt(action: PoseAction, c: number, facing: number): Pose {
  const r = rig(action, c);
  const pelvis = { x: r.shiftX * facing, y: PELVIS_HEIGHT + r.bob };
  const leanX = r.side ? facing : 1;
  const neck = {
    x: pelvis.x + Math.sin(r.lean) * TORSO * leanX,
    y: pelvis.y + Math.cos(r.lean) * TORSO,
  };
  const head = { x: neck.x + Math.sin(r.lean) * 0.1 * leanX, y: neck.y + 0.1 };

  // dirX(side) maps a limb angle to screen x for the left (+1) / right (-1) side.
  const dirX = (sideSign: number) => (r.side ? facing : sideSign);
  const limb = (start: Point, a: Limb, l1: number, l2: number, sideSign: number) => {
    const sx = dirX(sideSign);
    const mid = { x: start.x + Math.sin(a.upper) * l1 * sx, y: start.y - Math.cos(a.upper) * l1 };
    const end = { x: mid.x + Math.sin(a.lower) * l2 * sx, y: mid.y - Math.cos(a.lower) * l2 };
    return [mid, end] as const;
  };

  const shoulderHalf = r.side ? 0.025 : 0.11;
  const hipHalf = r.side ? 0.02 : 0.065;
  // Front view: the figure's left is screen right (+x).
  const leftShoulder = { x: neck.x + shoulderHalf * (r.side ? -facing : 1), y: neck.y - 0.02 };
  const rightShoulder = { x: neck.x - shoulderHalf * (r.side ? -facing : 1), y: neck.y - 0.02 };
  const leftHip = { x: pelvis.x + hipHalf * (r.side ? -facing : 1), y: pelvis.y };
  const rightHip = { x: pelvis.x - hipHalf * (r.side ? -facing : 1), y: pelvis.y };

  const [leftElbow, leftWrist] = limb(leftShoulder, r.leftArm, UPPER_ARM, FOREARM, 1);
  const [rightElbow, rightWrist] = limb(rightShoulder, r.rightArm, UPPER_ARM, FOREARM, -1);
  const [leftKnee, leftAnkle] = limb(leftHip, r.leftLeg, THIGH, SHIN, 1);
  const [rightKnee, rightAnkle] = limb(rightHip, r.rightLeg, THIGH, SHIN, -1);

  const face = r.side
    ? {
        nose: { x: head.x + 0.045 * facing, y: head.y - 0.005 },
        leftEye: { x: head.x + 0.03 * facing, y: head.y + 0.018 },
        rightEye: { x: head.x + 0.036 * facing, y: head.y + 0.016 },
        leftEar: { x: head.x - 0.015 * facing, y: head.y + 0.005 },
        rightEar: { x: head.x - 0.01 * facing, y: head.y + 0.004 },
      }
    : {
        nose: { x: head.x, y: head.y - 0.01 },
        leftEye: { x: head.x + 0.025, y: head.y + 0.015 },
        rightEye: { x: head.x - 0.025, y: head.y + 0.015 },
        leftEar: { x: head.x + 0.055, y: head.y + 0.002 },
        rightEar: { x: head.x - 0.055, y: head.y + 0.002 },
      };

  return {
    ...face,
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftWrist,
    rightWrist,
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftAnkle,
    rightAnkle,
  };
}
