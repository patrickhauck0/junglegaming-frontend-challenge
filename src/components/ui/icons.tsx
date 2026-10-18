import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

export function KurioLogo({ className = 'h-6 w-auto', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 112 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Kurio NFT Marketplace"
      role="img"
      {...props}
    >
      <text
        x="0"
        y="21"
        fontFamily="'Roboto Mono', monospace"
        fontSize="22"
        fontWeight="700"
        letterSpacing="2"
        fill="#F5F1EB"
      >
        KURIO
      </text>
    </svg>
  );
}

export function ArrowDownIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 11 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M10.0833 0.75L5.41667 5.41667L0.75 0.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M6.75 13.5L11.25 9L6.75 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 17.5L13.875 13.875"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CartIcon({ className = 'size-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M2.5 3.5H4.5L7.18 16.9C7.2718 17.3625 7.52528 17.7777 7.89678 18.0743C8.26829 18.3708 8.73489 18.5302 9.215 18.525H18.785C19.2651 18.5302 19.7317 18.3708 20.1032 18.0743C20.4747 17.7777 20.7282 17.3625 20.82 16.9L22.5 8.5H5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="21" r="1" fill="currentColor" />
      <circle cx="19" cy="21" r="1" fill="currentColor" />
    </svg>
  );
}

export function HeartIcon({
  filled = false,
  className = 'size-5',
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FilterIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M2.5 5H17.5M5.83333 10H14.1667M8.33333 15H11.6667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WalletIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M19 7V4C19 3.44772 18.5523 3 18 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C19.5523 21 20 20.5523 20 20V17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 7H21C21.5523 7 22 7.44772 22 8V16C22 16.5523 21.5523 17 21 17H14C13.4477 17 13 16.5523 13 16V8C13 7.44772 13.4477 7 14 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function CloseIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
