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
      fill={filled ? '#D28A4C' : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
        stroke={filled ? '#D28A4C' : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FilterSlidersIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M6.68348 12.8608H0.750328"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4063 12.8616C10.4063 14.7333 11.0305 15.3566 12.9013 15.3566C14.7721 15.3566 15.3963 14.7333 15.3963 12.8616C15.3963 10.99 14.7721 10.3666 12.9013 10.3666C11.0305 10.3666 10.4063 10.99 10.4063 12.8616Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.46363 3.2462H15.396"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.74077 3.24497C5.74077 1.37415 5.11661 0.75 3.24579 0.75C1.37415 0.75 0.75 1.37415 0.75 3.24497C0.75 5.11661 1.37415 5.73995 3.24579 5.73995C5.11661 5.73995 5.74077 5.11661 5.74077 3.24497Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoutIcon({ className = 'size-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M17.0268 8.559H6.99267"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5879 6.129L17.0279 8.559L14.5879 10.989"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5008 4.81667C12.2258 1.83333 11.1092 0.75 6.6675 0.75C0.75 0.75 0.75 2.675 0.75 8.45833C0.75 14.2417 0.75 16.1667 6.6675 16.1667C11.1092 16.1667 12.2258 15.0833 12.5008 12.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MobileHomeIcon({ className = 'size-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M5.52898 15.6446V13.0965C5.52898 12.4461 6.06014 11.9188 6.71536 11.9188H9.11051C9.42516 11.9188 9.72692 12.0428 9.94941 12.2637C10.1719 12.4846 10.2969 12.7841 10.2969 13.0965V15.6446C10.2949 15.915 10.4017 16.1751 10.5936 16.367C10.7856 16.5589 11.0467 16.6668 11.3191 16.6668H12.9532C13.7164 16.6688 14.449 16.3692 14.9893 15.8342C15.5297 15.2991 15.8333 14.5726 15.8333 13.815V6.55588C15.8333 5.94388 15.5601 5.36336 15.0872 4.97072L9.52835 0.563387C8.56139 -0.209369 7.17593 -0.184419 6.23783 0.622645L0.805845 4.97072C0.310618 5.35179 0.0146282 5.93403 0 6.55588V13.8076C0 15.3867 1.28949 16.6668 2.88015 16.6668H4.47691C5.04269 16.6668 5.5025 16.2137 5.5066 15.652L5.52898 15.6446Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MobileUserIcon({ className = 'size-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M10.0001 9.82997C12.2658 9.82997 14.1026 8.00256 14.1026 5.74834C14.1026 3.49412 12.2658 1.66671 10.0001 1.66671C7.73428 1.66671 5.8975 3.49412 5.8975 5.74834C5.8975 8.00256 7.73428 9.82997 10.0001 9.82997Z"
        fill="currentColor"
      />
      <path
        d="M12.1368 11.5307H7.86331C5.38468 11.5307 3.3334 13.5715 3.3334 16.0375C3.3334 16.6328 3.58981 17.143 4.10263 17.3981C4.87186 17.8232 6.58126 18.3335 10.0001 18.3335C13.4189 18.3335 15.1283 17.8232 15.8975 17.3981C16.3248 17.143 16.6667 16.6328 16.6667 16.0375C16.6667 13.4865 14.6154 11.5307 12.1368 11.5307Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MobileShopIcon({ className = 'size-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M18.3333 6.80135L17.3897 12.7778C17.2182 13.9562 16.2745 14.7138 15.0735 14.7138H6.83825C5.72305 14.7138 4.69364 13.8721 4.52207 12.7778L3.49266 5.79125L3.23531 3.85522C3.14953 3.35017 2.7206 3.01347 2.12011 3.01347H1.51962C1.17649 3.01347 0.833349 2.67677 0.833349 2.34007C0.833349 2.00337 1.17649 1.66667 1.51962 1.66667H2.12011C3.32109 1.66667 4.35051 2.50842 4.43629 3.68687L4.60786 5.03367H16.7892C17.2182 5.03367 17.6471 5.20202 17.9044 5.53872C18.2476 5.87542 18.3333 6.38047 18.3333 6.80135Z"
        fill="currentColor"
      />
      <circle cx="15.25" cy="17.5" r="0.85" fill="currentColor" />
      <circle cx="6.67" cy="17.5" r="0.85" fill="currentColor" />
    </svg>
  );
}

export function SocialFacebookIcon({ className = 'size-8', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="0.5" y="0.5" width="31" height="31" rx="4.5" stroke="#D28A4C" />
      <path d="M15 14.3333H13V17H15V25H18.3333V17H20.7333L21 14.3333H18.3333V13.2C18.3333 12.6 18.4667 12.3333 19.0667 12.3333H21V9H18.4667C16.0667 9 15 10.0667 15 12.0667V14.3333Z" fill="#D28A4C" />
    </svg>
  );
}

export function SocialInstagramIcon({ className = 'size-8', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="0.5" y="0.5" width="31" height="31" rx="4.5" stroke="#D28A4C" />
      <path d="M17 10.4667C19.1333 10.4667 19.4 10.4667 20.2667 10.5333C22.4667 10.6 23.4667 11.6667 23.5333 13.8C23.6 14.6667 23.6 14.8667 23.6 17C23.6 19.1333 23.6 19.4 23.5333 20.2C23.4667 22.3333 22.4 23.4 20.2667 23.4667C19.4 23.5333 19.2 23.5333 17 23.5333C14.8667 23.5333 14.6 23.5333 13.8 23.4667C11.6 23.4 10.6 22.3333 10.5333 20.2C10.4667 19.3333 10.4667 19.1333 10.4667 17C10.4667 14.8667 10.4667 14.6 10.5333 13.8C10.6 11.6667 11.6667 10.6 13.8 10.5333C14.6 10.4667 14.8667 10.4667 17 10.4667ZM17 9C14.8 9 14.5333 9 13.7333 9.06667C10.8 9.2 9.2 10.8 9.06667 13.7333C9 14.5333 9 14.8 9 17C9 19.2 9 19.4667 9.06667 20.2667C9.2 23.2 10.8 24.8 13.7333 24.9333C14.5333 25 14.8 25 17 25C19.2 25 19.4667 25 20.2667 24.9333C23.2 24.8 24.8 23.2 24.9333 20.2667C25 19.4667 25 19.2 25 17C25 14.8 25 14.5333 24.9333 13.7333C24.8 10.8 23.2 9.2 20.2667 9.06667C19.4667 9 19.2 9 17 9ZM17 12.8667C14.7333 12.8667 12.8667 14.7333 12.8667 17C12.8667 19.2667 14.7333 21.1333 17 21.1333C19.2667 21.1333 21.1333 19.2667 21.1333 17C21.1333 14.7333 19.2667 12.8667 17 12.8667ZM17 19.6667C15.5333 19.6667 14.3333 18.4667 14.3333 17C14.3333 15.5333 15.5333 14.3333 17 14.3333C18.4667 14.3333 19.6667 15.5333 19.6667 17C19.6667 18.4667 18.4667 19.6667 17 19.6667ZM21.2667 11.8C20.7333 11.8 20.3333 12.2 20.3333 12.7333C20.3333 13.2667 20.7333 13.6667 21.2667 13.6667C21.8 13.6667 22.2 13.2667 22.2 12.7333C22.2 12.2 21.8 11.8 21.2667 11.8Z" fill="#D28A4C" />
    </svg>
  );
}

export function SocialTwitterIcon({ className = 'size-8', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="0.5" y="0.5" width="31" height="31" rx="4.5" stroke="#D28A4C" />
      <path d="M14.0319 22.0036C20.0699 22.0036 23.3718 17.0012 23.3718 12.6636C23.3718 12.5214 23.3689 12.38 23.3624 12.2392C24.0033 11.7759 24.5605 11.1976 25 10.5395C24.4118 10.8008 23.7789 10.9768 23.1149 11.0562C23.7926 10.6498 24.313 10.0067 24.5585 9.24021C23.9241 9.61636 23.2217 9.88969 22.4742 10.0371C21.8749 9.39908 21.0218 9 20.0779 9C18.2648 9 16.7946 10.4702 16.7946 12.2823C16.7946 12.54 16.8236 12.7904 16.8796 13.0308C14.1516 12.8938 11.7324 11.5874 10.1135 9.60125C9.83127 10.0862 9.66877 10.65 9.66877 11.2511C9.66877 12.3899 10.2484 13.3953 11.1297 13.9836C10.5912 13.9671 10.0853 13.8189 9.64293 13.5729C9.6422 13.5866 9.6422 13.6004 9.6422 13.6148C9.6422 15.2047 10.7739 16.532 12.2758 16.8329C12.0001 16.908 11.71 16.9484 11.4105 16.9484C11.199 16.9484 10.9934 16.9273 10.7934 16.8893C11.2112 18.1933 12.4232 19.1425 13.8601 19.1693C12.7364 20.0499 11.3209 20.5745 9.78305 20.5745C9.51827 20.5745 9.25695 20.5594 9 20.529C10.4527 21.46 12.1777 22.0036 14.0319 22.0036Z" fill="#D28A4C" />
    </svg>
  );
}

export function SocialLinkedinIcon({ className = 'size-8', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="0.5" y="0.5" width="31" height="31" rx="4.5" stroke="#D28A4C" />
      <path d="M12.3333 10.6667C12.3333 11.6 11.6 12.3333 10.6667 12.3333C9.73333 12.3333 9 11.6 9 10.6667C9 9.73333 9.73333 9 10.6667 9C11.6 9 12.3333 9.73333 12.3333 10.6667ZM12.3333 13.6667H9V24.3333H12.3333V13.6667ZM17.6667 13.6667H14.3333V24.3333H17.6667V18.7333C17.6667 15.6 21.6667 15.3333 21.6667 18.7333V24.3333H25V17.6C25 12.3333 19.0667 12.5333 17.6667 15.1333V13.6667Z" fill="#D28A4C" />
    </svg>
  );
}

export function SocialYoutubeIcon({ className = 'size-8', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="0.5" y="0.5" width="31" height="31" rx="4.5" stroke="#D28A4C" />
      <path d="M10.4219 9.17498C13.2218 8.94166 19.4443 8.94166 22.2441 9.17498L22.5205 9.20135C25.301 9.52296 25.666 11.3484 25.666 16.0197L25.6611 16.8889C25.6073 21.0677 25.0875 22.7175 22.2441 22.8635C19.4443 23.019 13.2218 23.019 10.4219 22.8635C7.57836 22.6447 7.05869 21.0586 7.00488 16.8879L7 16.0197C7 11.1978 7.38885 9.40837 10.4219 9.17498ZM21.3408 13.3566C18.7471 13.1955 13.9159 13.1955 11.3232 13.3566C11.323 13.3592 11.3235 13.3619 11.3232 13.3644C11.2608 13.9972 11.2363 14.8421 11.2363 16.0197C11.2363 17.1893 11.2607 18.0301 11.3223 18.6613C13.9705 18.7666 18.6955 18.7666 21.3438 18.6613C21.4047 18.0238 21.4297 17.1804 21.4297 16.0197C21.4297 14.8421 21.4042 13.9972 21.3418 13.3644C21.3415 13.3619 21.3411 13.3592 21.3408 13.3566ZM14 16.0187C14.0003 14.5897 15.504 13.6609 16.7822 14.3C18.1991 15.0086 18.1992 17.0299 16.7822 17.7385C15.5038 18.3777 14 17.448 14 16.0187Z" fill="#D28A4C" />
    </svg>
  );
}

export function CloseIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon({
  filled = true,
  className = 'size-4',
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill={filled ? '#D28A4C' : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M7.5 1.5L9.354 5.256L13.5 5.862L10.5 8.787L11.208 12.918L7.5 10.968L3.792 12.918L4.5 8.787L1.5 5.862L5.646 5.256L7.5 1.5Z"
        fill={filled ? '#D28A4C' : 'none'}
        stroke="#D28A4C"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MinusIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ZoomIcon({ className = 'size-5', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="14" cy="14" r="8" stroke="#D28A4C" strokeWidth="2" />
      <path d="M20 20L25 25" stroke="#D28A4C" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 11V17M11 14H17" stroke="#D28A4C" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ShareLinkedinIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M4 2C4 2.55 3.55 3 3 3C2.45 3 2 2.55 2 2C2 1.45 2.45 1 3 1C3.55 1 4 1.45 4 2ZM4 5H2V14H4V5ZM8 5H6V14H8V9.5C8 7.5 10.5 7.3 10.5 9.5V14H12.5V8.5C12.5 5.8 9.5 5.9 8 7.3V5Z" fill="#D28A4C" />
    </svg>
  );
}

export function ShareTwitterIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M14.5 4.1C14 4.3 13.5 4.5 13 4.5C13.5 4.2 13.9 3.7 14.1 3.1C13.6 3.4 13 3.6 12.4 3.7C11.9 3.2 11.2 2.9 10.5 2.9C9 2.9 7.8 4.1 7.8 5.6C7.8 5.8 7.8 6 7.9 6.2C5.6 6.1 3.6 5 2.3 3.4C2.1 3.8 2 4.2 2 4.7C2 5.6 2.5 6.5 3.2 7C2.8 7 2.4 6.9 2 6.7V6.7C2 8 2.9 9.1 4.2 9.4C3.9 9.5 3.7 9.5 3.5 9.5C3.3 9.5 3.1 9.5 3 9.4C3.4 10.5 4.4 11.3 5.6 11.3C4.7 12 3.5 12.5 2.2 12.5C2 12.5 1.8 12.5 1.6 12.5C2.8 13.3 4.2 13.7 5.8 13.7C10.8 13.7 13.5 9.5 13.5 5.9V5.5C14.1 5.2 14.6 4.7 15 4.1L14.5 4.1Z" fill="#D28A4C" />
    </svg>
  );
}

export function ShareMailIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M2 3H14C14.55 3 15 3.45 15 4V12C15 12.55 14.55 13 14 13H2C1.45 13 1 12.55 1 12V4C1 3.45 1.45 3 2 3ZM13.8 5L8 9L2.2 5V11.5H13.8V5ZM8 7.8L13.5 4H2.5L8 7.8Z" fill="#D28A4C" />
    </svg>
  );
}

export function TrashIcon({ className = 'size-6', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M15.4245 7.59C15.4245 15.609 16.5788 19.2338 8.81495 19.2338C1.05019 19.2338 2.22829 15.609 2.22829 7.59"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9005 4.51571H0.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.2502 4.51571C12.2502 4.51571 12.7788 0.75 8.82448 0.75C4.87114 0.75 5.39971 4.51571 5.39971 4.51571"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WalletIcon({ className = 'size-5', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M19.207 11.7114H15.3204C13.9051 11.7114 12.7575 10.5638 12.7575 9.14762C12.7575 7.73238 13.9051 6.58476 15.3204 6.58476H19.1766" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.7579 9.08905H15.4608" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.6421 5.17962H9.7021" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0.75 9.28905C0.75 2.88429 3.07476 0.75 10.051 0.75C17.0262 0.75 19.351 2.88429 19.351 9.28905C19.351 15.6929 17.0262 17.8281 10.051 17.8281C3.07476 17.8281 0.75 15.6929 0.75 9.28905Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MoreVerticalIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 3 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
      <circle cx="1.5" cy="7.5" r="1.5" fill="currentColor" />
      <circle cx="1.5" cy="13.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function RadioSelectedIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="8" cy="8" r="7.4" stroke="#D28A4C" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="4.5" fill="#D28A4C" />
    </svg>
  );
}

export function RadioUnselectedIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="8" cy="8" r="7.4" stroke="#D28A4C" strokeWidth="1.2" />
    </svg>
  );
}

export function ThankYouIcon({ className = 'w-16 h-20', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 66 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M29.2802 25.9317C29.8842 26.1624 30.5619 25.8588 30.7924 25.2536L31.1853 24.2217H33.9578L34.3459 25.2503C34.523 25.7195 34.9689 26.0088 35.4425 26.0088C35.58 26.0088 35.7198 25.9844 35.8561 25.933C36.4616 25.7045 36.7672 25.0285 36.5386 24.4228L33.8311 17.2483C33.8272 17.2378 33.823 17.227 33.8188 17.2167C33.6119 16.7133 33.1266 16.3881 32.5824 16.3881C32.582 16.3881 32.5817 16.3881 32.5814 16.3881C32.0367 16.3884 31.5514 16.7144 31.3452 17.2183C31.3416 17.2273 31.3378 17.2361 31.3345 17.2453L28.6022 24.4195C28.3717 25.0242 28.6753 25.7013 29.2802 25.9317V25.9317ZM33.0733 21.8781H32.078L32.5778 20.5656L33.0733 21.8781Z" fill="#D28A4C"/>
      <path d="M38.9119 26.0085C39.5593 26.0085 40.0838 25.4839 40.0838 24.8366V21.3327L42.8587 25.3508C43.1924 25.8333 43.7535 26.0377 44.2882 25.8708C44.8318 25.7013 45.1829 25.1989 45.1829 24.58L45.1149 17.5486C45.1087 16.9053 44.5852 16.388 43.9433 16.388C43.9394 16.388 43.9355 16.388 43.9318 16.388C43.2844 16.3942 42.7649 16.9241 42.7712 17.5711L42.8058 21.1497L39.8763 16.9075C39.5849 16.4855 39.0533 16.3024 38.5632 16.4547C38.0737 16.6074 37.7401 17.0606 37.7401 17.5735V24.8364C37.7401 25.4839 38.2646 26.0085 38.9119 26.0085Z" fill="#D28A4C"/>
      <path d="M47.8301 26.0084C48.4774 26.0084 49.002 25.4839 49.002 24.8366V23.5698L51.1892 25.68C51.4165 25.8994 51.7098 26.0086 52.0026 26.0086C52.3096 26.0086 52.6162 25.8886 52.846 25.6503C53.2954 25.1847 53.2821 24.4427 52.8163 23.9934L49.7723 21.0564L52.5374 18.5145C53.014 18.0766 53.0453 17.3352 52.6071 16.8588C52.1693 16.3822 51.4277 16.3511 50.9513 16.7891L49.0018 18.5809V17.56C49.0018 16.9127 48.4773 16.3881 47.8299 16.3881C47.1826 16.3881 46.658 16.9127 46.658 17.56V24.8366C46.6582 25.4839 47.1827 26.0084 47.8301 26.0084V26.0084Z" fill="#D28A4C"/>
      <path d="M20.99 26.0084C21.6373 26.0084 22.1619 25.4839 22.1619 24.8366V22.2453H24.8538V24.8366C24.8538 25.4839 25.3783 26.0084 26.0256 26.0084C26.673 26.0084 27.1975 25.4839 27.1975 24.8366V17.56C27.1975 16.9127 26.673 16.3881 26.0256 16.3881C25.3783 16.3881 24.8538 16.9127 24.8538 17.56V19.9016H22.1619V17.56C22.1619 16.9127 21.6373 16.3881 20.99 16.3881C20.3427 16.3881 19.8181 16.9127 19.8181 17.56V24.8366C19.8181 25.4839 20.3427 26.0084 20.99 26.0084Z" fill="#D28A4C"/>
      <path d="M18.2332 31.64L20.366 34.9061L20.3577 38.273C20.3561 38.9203 20.8796 39.4462 21.5266 39.4478H21.5296C22.1755 39.4478 22.6999 38.925 22.7014 38.2789L22.7097 34.908L24.8258 31.657C25.179 31.1145 25.0255 30.3886 24.4832 30.0356C23.9408 29.6822 23.2147 29.8359 22.8618 30.3783L21.5371 32.4131L20.1953 30.3586C19.8414 29.8165 19.1157 29.6645 18.5735 30.0181C18.0318 30.372 17.8791 31.0981 18.2332 31.64V31.64Z" fill="#D28A4C"/>
      <path d="M36.3096 36.0064C36.3096 37.1997 36.8757 38.1662 37.9923 38.8798C38.5807 39.2556 39.2437 39.4467 39.9629 39.4478H39.9684C40.5857 39.4478 41.1662 39.3133 41.6937 39.0475C42.9937 38.3928 43.7096 37.3109 43.7096 36.0011V30.9992C43.7096 30.3519 43.1851 29.8273 42.5378 29.8273C41.8904 29.8273 41.3659 30.3519 41.3659 30.9992V36.0011C41.3659 36.3061 41.2779 36.6326 40.6395 36.9542C40.4393 37.0551 40.2198 37.104 39.9686 37.104C39.9678 37.104 39.9668 37.104 39.966 37.104C39.6962 37.1037 39.4632 37.0384 39.254 36.9048C38.6992 36.5503 38.6532 36.2776 38.6532 36.0065V30.9994C38.6532 30.352 38.1287 29.8275 37.4814 29.8275C36.834 29.8275 36.3095 30.352 36.3095 30.9994V36.0064H36.3096Z" fill="#D28A4C"/>
      <path d="M13.3445 18.7319H14.1739V24.8366C14.1739 25.4839 14.6984 26.0084 15.3457 26.0084C15.9931 26.0084 16.5176 25.4839 16.5176 24.8366V18.7319H17.3631C18.0104 18.7319 18.535 18.2073 18.535 17.56C18.535 16.9127 18.0104 16.3881 17.3631 16.3881H13.3445C12.6971 16.3881 12.1726 16.9127 12.1726 17.56C12.1726 18.2073 12.6971 18.7319 13.3445 18.7319V18.7319Z" fill="#D28A4C"/>
      <path d="M30.2126 29.8275C27.5602 29.8275 25.4024 31.9855 25.4024 34.6377C25.4024 37.2898 27.5604 39.4478 30.2126 39.4478C32.8651 39.4478 35.0229 37.2898 35.0229 34.6377C35.0229 31.9855 32.8649 29.8275 30.2126 29.8275ZM30.2126 37.1041C28.8526 37.1041 27.7462 35.9977 27.7462 34.6377C27.7462 33.2777 28.8526 32.1712 30.2126 32.1712C31.5726 32.1712 32.6791 33.2777 32.6791 34.6377C32.6791 35.9977 31.5726 37.1041 30.2126 37.1041Z" fill="#D28A4C"/>
      <path d="M63.3789 28.0734L59.9291 24.4797V9.46422C59.9291 7.37484 58.2292 5.67484 56.1397 5.67484H41.8753C41.8717 5.67109 41.8687 5.66687 41.8652 5.66313L39.0922 2.77469C37.3744 0.985469 35.0623 0 32.582 0C30.1017 0 27.7897 0.985469 26.072 2.77469L23.2877 5.675H9.02438C6.93484 5.675 5.235 7.375 5.235 9.46437V24.48L1.78516 28.0734C0.634063 29.2725 0 30.8483 0 32.5103V76.2106C0 78.3002 1.7 80 3.78937 80H61.3745C63.4639 80 65.1639 78.3002 65.1639 76.2106V32.5103C65.1639 30.8483 64.53 29.2725 63.3789 28.0734V28.0734ZM61.6881 29.6967C62.4181 30.457 62.8202 31.4564 62.8202 32.5105V35.168L59.9289 38.1797V27.8641L61.6881 29.6967ZM27.7627 4.39781C29.0344 3.07328 30.7458 2.34375 32.582 2.34375C34.4183 2.34375 36.1297 3.07328 37.4014 4.39781L38.6273 5.67484H26.5367L27.7627 4.39781ZM9.02438 8.01859H56.1395C56.9367 8.01859 57.5852 8.66703 57.5852 9.46422V40.6209L45.1459 53.5784L39.0919 47.2722C37.3742 45.483 35.0622 44.4975 32.5819 44.4975C30.1016 44.4975 27.7895 45.483 26.0719 47.2722L20.0178 53.5784L7.57859 40.6209V9.46422C7.57875 8.66719 8.22734 8.01859 9.02438 8.01859V8.01859ZM18.3936 55.2706L2.34391 71.9891V38.5522L18.3936 55.2706ZM2.34391 32.5103C2.34391 31.4562 2.74594 30.4569 3.47594 29.6966L5.23516 27.8641V38.1794L2.34391 35.1677V32.5103ZM61.3745 77.6562H3.78953C2.99234 77.6562 2.34391 77.0078 2.34391 76.2106V75.3733L27.7628 48.8953C29.0345 47.5706 30.7459 46.8412 32.5822 46.8412C34.4184 46.8412 36.1298 47.5708 37.4016 48.8953L46.8138 58.6997C47.262 59.1667 48.0037 59.1814 48.4706 58.7334C48.9373 58.2853 48.9527 57.5434 48.5044 57.0766L46.7706 55.2706L62.8203 38.5522V71.9891L52.2734 61.0028C51.8252 60.5359 51.0834 60.5209 50.6166 60.9691C50.1498 61.4172 50.1345 62.1591 50.5828 62.6259L62.8203 75.3733V76.2105C62.8202 77.0078 62.1717 77.6562 61.3745 77.6562V77.6562Z" fill="#D28A4C"/>
    </svg>
  );
}

export function CloseModalIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M3.17007 3.05472C3.39682 2.83622 3.76447 2.83622 3.99122 3.05472L9 7.88126L14.0088 3.05472C14.2355 2.83622 14.6032 2.83622 14.8299 3.05472C15.0567 3.27323 15.0567 3.6275 14.8299 3.846L9.82115 8.67254L14.8299 13.4991C15.0567 13.7176 15.0567 14.0718 14.8299 14.2903C14.6032 14.5089 14.2355 14.5089 14.0088 14.2903L9 9.46381L3.99122 14.2903C3.76447 14.5089 3.39682 14.5089 3.17007 14.2903C2.94331 14.0718 2.94331 13.7176 3.17007 13.4991L8.17884 8.67254L3.17007 3.846C2.94331 3.6275 2.94331 3.27323 3.17007 3.05472Z" fill="#D28A4C"/>
    </svg>
  );
}

export function GoogleIcon({ className = 'size-5', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function FacebookIcon({ className = 'size-5', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path
        d="M13.3309 3.32083H15.1567V0.140826C14.8417 0.0974924 13.7584 -7.62939e-06 12.4967 -7.62939e-06C6.72006 -7.62939e-06 8.29172 6.54166 8.06172 7.49999H5.15589V11.055H8.06089V20H11.6226V11.0558H14.4101L14.8526 7.50083H11.6217C11.7784 5.14749 10.9876 3.32083 13.3309 3.32083V3.32083Z"
        fill="#3B5999"
      />
    </svg>
  );
}

export function EyeHideIcon({ className = 'size-[18px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M4.21611 11.9833C2.11 10.7666 0.75 8.93326 0.75 7.32493C0.75 4.59159 4.66 1.24159 9.48611 1.24159C11.46 1.24159 13.2922 1.79993 14.7656 2.66659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#B39463"/>
      <path d="M16.8997 4.38359C17.7412 5.32526 18.2314 6.36693 18.2314 7.32526C18.2314 10.0586 14.3119 13.4086 9.48583 13.4086C8.62638 13.4086 7.78677 13.3003 7.00194 13.1086" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#B39463"/>
      <path d="M7.37594 9.18093C6.81399 8.69009 6.49949 8.02093 6.50233 7.32343C6.49855 5.86926 7.83211 4.68759 9.48111 4.68509C10.2744 4.68343 11.0357 4.96093 11.5967 5.45593" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#B39463"/>
      <path d="M12.4229 7.79101C12.2019 8.86768 11.247 9.71184 10.0268 9.90934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#B39463"/>
      <path d="M16.9394 0.750009L2.04172 13.895" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#B39463"/>
    </svg>
  );
}

export function EyeShowIcon({ className = 'size-[18px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M0.75 7.32493C0.75 4.59159 4.66 1.24159 9.48611 1.24159C14.3119 1.24159 18.2314 4.59159 18.2314 7.32493C18.2314 10.0586 14.3119 13.4086 9.48611 13.4086C4.66 13.4086 0.75 10.0586 0.75 7.32493Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#B39463"/>
      <circle cx="9.5" cy="7.325" r="2.6" strokeWidth="1.5" stroke="#B39463" />
    </svg>
  );
}

export function UserProfileIcon({ className = 'size-[18px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M8.99999 2.65384C7.61037 2.65384 6.48387 3.77313 6.48387 5.15384C6.48387 6.53455 7.61037 7.65384 8.99999 7.65384C10.3896 7.65384 11.5161 6.53455 11.5161 5.15384C11.5161 3.77313 10.3896 2.65384 8.99999 2.65384ZM5.32258 5.15384C5.32258 3.13587 6.96901 1.49999 8.99999 1.49999C11.031 1.49999 12.6774 3.13587 12.6774 5.15384C12.6774 7.1718 11.031 8.80768 8.99999 8.80768C6.96901 8.80768 5.32258 7.1718 5.32258 5.15384Z" fill="currentColor"/>
      <path d="M7.09963 11.5C5.47683 11.5 4.16129 12.8071 4.16129 14.4195C4.16129 14.5042 4.17686 14.5639 4.19318 14.5987C4.20697 14.6281 4.21879 14.6365 4.22865 14.6418C4.6799 14.8858 5.94511 15.3461 8.99999 15.3461C12.0549 15.3461 13.3201 14.8858 13.7713 14.6418C13.7812 14.6365 13.793 14.6281 13.8068 14.5987C13.8231 14.5639 13.8387 14.5042 13.8387 14.4195C13.8387 12.8071 12.5232 11.5 10.9004 11.5H7.09963ZM3 14.4195C3 12.1698 4.83546 10.3461 7.09963 10.3461H10.9004C13.1645 10.3461 15 12.1698 15 14.4195C15 14.8325 14.8495 15.3725 14.3264 15.6553C13.6335 16.0299 12.1469 16.5 8.99999 16.5C5.8531 16.5 4.36654 16.0299 3.67358 15.6553C3.15047 15.3725 3 14.8325 3 14.4195Z" fill="currentColor"/>
    </svg>
  );
}

export function LocationPinIcon({ className = 'size-[20px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M6.8755 5.41683C6.07133 5.41683 5.41716 6.071 5.41716 6.876C5.41716 7.68016 6.07133 8.3335 6.8755 8.3335C7.67967 8.3335 8.33383 7.68016 8.33383 6.876C8.33383 6.071 7.67967 5.41683 6.8755 5.41683M6.8755 9.5835C5.38216 9.5835 4.16716 8.36933 4.16716 6.876C4.16716 5.38183 5.38216 4.16683 6.8755 4.16683C8.36883 4.16683 9.58383 5.38183 9.58383 6.876C9.58383 8.36933 8.36883 9.5835 6.8755 9.5835" fill="currentColor"/>
      <path d="M6.87466 1.25016C3.773 1.25016 1.24966 3.79766 1.24966 6.92766C1.24966 10.9102 5.93633 14.7902 6.87466 14.9968C7.813 14.7893 12.4997 10.9093 12.4997 6.92766C12.4997 3.79766 9.97633 1.25016 6.87466 1.25016V1.25016ZM6.87466 16.2502C5.37966 16.2502 -0.000335276 11.6235 -0.000335276 6.92766C-0.000335276 3.10766 3.08383 0.00016275 6.87466 0.00016275C10.6655 0.00016275 13.7497 3.10766 13.7497 6.92766C13.7497 11.6235 8.36966 16.2502 6.87466 16.2502V16.2502Z" fill="currentColor"/>
    </svg>
  );
}

export function ShoppingBagOutlineIcon({ className = 'size-[18px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M12.8646 15.1873H7.41669C5.0909 15.1873 3.19871 13.2951 3.19871 10.9693V6.64589C3.19871 4.48382 2.12108 2.48256 0.316103 1.29246C-0.00804931 1.07875 -0.0975409 0.642749 0.11617 0.318597C0.329881 -0.00559043 0.765845 -0.0951171 1.09007 0.118664C2.12045 0.798041 2.95638 1.69408 3.55414 2.72573C3.68332 2.87044 4.72495 3.9745 6.43253 3.9745H14.5278C16.7364 3.9332 18.4651 6.14965 17.8877 8.28148L16.9558 11.9958C16.4843 13.8749 14.802 15.1873 12.8646 15.1873V15.1873ZM4.42734 4.98334C4.54421 5.52327 4.6047 6.08001 4.6047 6.64589V10.9693C4.6047 12.5199 5.86616 13.7813 7.41669 13.7813H12.8646C14.1562 13.7813 15.2777 12.9064 15.592 11.6536L16.5239 7.93934C16.8671 6.6726 15.8397 5.356 14.5278 5.3805H6.4325C5.66022 5.3805 4.98801 5.21399 4.42734 4.98334V4.98334ZM7.06519 17.1206C7.06519 16.6352 6.67176 16.2418 6.18645 16.2418C5.02046 16.2882 5.02147 17.9533 6.18645 17.9993C6.67176 17.9993 7.06519 17.6059 7.06519 17.1206ZM14.06 17.1206C14.06 16.6352 13.6666 16.2418 13.1813 16.2418C12.0153 16.2882 12.0163 17.9533 13.1813 17.9993C13.6666 17.9993 14.06 17.6059 14.06 17.1206ZM15.2308 7.48949C15.2308 7.10122 14.9161 6.78649 14.5278 6.78649H6.71369C5.78096 6.82361 5.78166 8.15568 6.71369 8.19249H14.5278C14.9161 8.19249 15.2308 7.87775 15.2308 7.48949Z" fill="currentColor"/>
    </svg>
  );
}

export function ActivityCurveIcon({ className = 'size-[18px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M4.1007 10.1279L6.34545 7.21118L8.90595 9.22118L11.1027 6.38618" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.6632 0.75C14.4597 0.75 15.1047 1.395 15.1047 2.1915C15.1047 2.98725 14.4597 3.633 13.6632 3.633C12.8667 3.633 12.2217 2.98725 12.2217 2.1915C12.2217 1.395 12.8667 0.75 13.6632 0.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.4795 5.93925C14.5792 6.6105 14.625 7.3665 14.625 8.21475C14.625 13.4183 12.891 15.1522 7.6875 15.1522C2.48475 15.1522 0.75 13.4183 0.75 8.21475C0.75 3.012 2.48475 1.27725 7.6875 1.27725C8.52 1.27725 9.26325 1.3215 9.92475 1.4175" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function DownloadOutlineIcon({ className = 'size-[18px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M7.5966 9.78075V0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.7836 7.58565L7.5966 9.78165L5.4096 7.58565" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.965 4.13153C13.6492 4.37903 14.625 5.38403 14.625 9.38153C14.625 14.7065 12.8918 14.7065 7.6875 14.7065C2.48175 14.7065 0.75 14.7065 0.75 9.38153C0.75 5.38403 1.725 4.37903 4.41 4.13153" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function DangerTriangleOutlineIcon({ className = 'size-[18px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M7.87495 14.25C3.00414 14.25 1.09245 13.904 0.782598 12.1525C0.472745 10.401 2.45532 7.10806 3.06627 6.02135C5.10938 2.38806 6.49774 0.75 7.87495 0.75C9.25216 0.75 10.6405 2.38806 12.6836 6.02135C13.2946 7.10806 15.2772 10.401 14.9673 12.1525C14.6583 13.904 12.7458 14.25 7.87495 14.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.87495 4.875V7.79625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.87173 10.4213H7.87848" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function LogoutOutlineIcon({ className = 'size-[20px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M17.0268 8.559H6.99267" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.5879 6.129L17.0279 8.559L14.5879 10.989" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.5008 4.81667C12.2258 1.83333 11.1092 0.75 6.6675 0.75C0.75 0.75 0.75 2.675 0.75 8.45833C0.75 14.2417 0.75 16.1667 6.6675 16.1667C11.1092 16.1667 12.2258 15.0833 12.5008 12.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ImagePlaceholderIcon({ className = 'size-[20px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M0.75 10C0.75 16.937 3.063 19.25 10 19.25C16.937 19.25 19.25 16.937 19.25 10C19.25 3.063 16.937 0.75 10 0.75C3.063 0.75 0.75 3.063 0.75 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5986 6.7841C8.5986 7.7571 7.8106 8.5451 6.8376 8.5451C5.8656 8.5451 5.0766 7.7571 5.0766 6.7841C5.0766 5.8111 5.8656 5.0231 6.8376 5.0231C7.8106 5.0231 8.5986 5.8111 8.5986 6.7841Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.1201 12.6665C18.2391 11.7605 16.9931 9.9295 14.7041 9.9295C12.4151 9.9295 12.3651 13.9675 10.0291 13.9675C7.6921 13.9675 6.7511 12.5965 5.2281 13.3125C3.7061 14.0275 2.4661 16.8735 2.4661 16.8735" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ChevronDownOutlineIcon({ className = 'size-[20px]', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M15.4419 7.89139C15.686 8.13547 15.686 8.5312 15.4419 8.77527L10.4419 13.7753C10.1979 14.0194 9.80214 14.0194 9.55806 13.7753L4.55806 8.77527C4.31398 8.5312 4.31398 8.13547 4.55806 7.89139C4.80214 7.64731 5.19786 7.64731 5.44194 7.89139L10 12.4494L14.5581 7.89139C14.8021 7.64731 15.1979 7.64731 15.4419 7.89139Z" fill="currentColor"/>
    </svg>
  );
}

