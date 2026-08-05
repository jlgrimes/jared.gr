'use client';

/**
 * shadcn-chat's typing indicator, vendored as-is apart from the colour: three dots that
 * bounce on a staggered SMIL loop. `currentColor` lets the caller tint it with the ink
 * tokens instead of shadcn's neutral ramp.
 *
 * SMIL rather than CSS keyframes because the three animations chain off each other's `end`
 * event, which keeps them in phase no matter when the element mounts mid-stream.
 */
export const MessageLoading = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    role='status'
    aria-label='Thinking'
  >
    <circle cx='4' cy='12' r='2' fill='currentColor'>
      <animate
        id='flowDot1'
        begin='0;flowDot3.end+0.25s'
        attributeName='cy'
        calcMode='spline'
        dur='0.6s'
        values='12;6;12'
        keySplines='.33,.66,.66,1;.33,0,.66,.33'
      />
    </circle>
    <circle cx='12' cy='12' r='2' fill='currentColor'>
      <animate
        begin='flowDot1.begin+0.1s'
        attributeName='cy'
        calcMode='spline'
        dur='0.6s'
        values='12;6;12'
        keySplines='.33,.66,.66,1;.33,0,.66,.33'
      />
    </circle>
    <circle cx='20' cy='12' r='2' fill='currentColor'>
      <animate
        id='flowDot3'
        begin='flowDot1.begin+0.2s'
        attributeName='cy'
        calcMode='spline'
        dur='0.6s'
        values='12;6;12'
        keySplines='.33,.66,.66,1;.33,0,.66,.33'
      />
    </circle>
  </svg>
);

export default MessageLoading;
