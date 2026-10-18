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
