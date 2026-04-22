"use client";

import { useState } from "react";

interface CategoryIconProps {
  category: string;
  size?: number;
}

const EMOJI_ICONS: Record<string, string> = {
  "Repair services": "🔧",
  "Environmental services": "🌿",
  "Cleaning services": "🧹",
  "Events and rentals": "🎉",
  "Fashion services": "👔",
  "Spa and beauty parlour": "💆",
  "General services": "🛠️",
  "Computer operation": "💻",
  "Restaurant and lounges": "🍽️",
  "Lifestyle and entertainment": "🎵",
  "Tradesmen and retailers": "🏪",
  "Professional services": "💼",
  "Healthcare services": "🏥",
  "Software development": "👨‍💻",
};

const SVG_ICONS: Record<string, string> = {
  "Repair services": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M48.1758 20.625L46.2733 24.9688C45.2884 25.0288 44.3086 25.1528 43.3399 25.34L40.4296 21.582L37.2929 22.6485L37.2773 27.4298C35.9485 28.1128 34.6751 28.9385 33.4722 29.9023L29.0391 27.9062L26.7695 30.3204L29.039 34.625C28.3149 35.6572 27.6786 36.7483 27.1368 37.8867L22.2695 38.0195L21.2812 41.1795L25.211 44.0742C25.0229 45.2467 24.931 46.4315 24.9257 47.6173L20.5625 49.8281L21.0195 53.1094L25.8086 54.0469C26.0951 55.0492 26.4501 56.0307 26.8711 56.9844L23.715 60.9025L25.4766 63.707L30.3829 62.5586C30.6933 62.924 31.0151 63.2795 31.3476 63.6249C32.0421 64.3434 32.782 65.0167 33.5626 65.6405L32.6095 70.5546L35.4767 72.2109L39.2227 68.9491C40.2946 69.38 41.3982 69.7273 42.5236 69.9881L43.7464 74.7889L47.047 75.0585L49.0314 70.531C50.4026 70.4485 51.7694 70.2435 53.1134 69.9137L56.2659 73.5662L59.34 72.3358L59.25 70.4841L52.0742 65.0429C49.9852 65.571 47.819 65.7124 45.6914 65.4724C41.7221 65.0249 37.9076 63.2324 34.9141 60.1366C28.0719 53.0599 28.2675 41.8029 35.3439 34.9609C38.7714 31.6467 43.1801 29.9655 47.5939 29.9179C52.2926 29.8671 56.9956 31.6674 60.5236 35.3162C66.2655 41.2552 67.0481 50.1894 62.9689 56.9531L66.9651 59.9844C67.4621 59.2053 67.9108 58.3965 68.3089 57.5625L73.1408 57.4296L74.129 54.2696L70.2269 51.3946C70.4152 50.2125 70.5105 49.0174 70.5119 47.8204L74.8479 45.6173L74.391 42.336L69.606 41.3985C69.2033 40.0124 68.6697 38.6678 68.0122 37.3829L70.8635 33.4336L68.9572 30.7265L64.2622 32.0898C64.2033 32.0273 64.146 31.9639 64.0863 31.9023C63.3472 31.1377 62.5563 30.425 61.7191 29.7692L62.6176 25.1286L59.75 23.4725L56.1875 26.5743C55.0342 26.1101 53.8498 25.7489 52.6484 25.4805L51.4805 20.8945L48.1758 20.625Z" fill="white"/></svg>`,
  "Environmental services": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M23.3335 76.6665V71.3332C23.3335 71.3332 36.6668 65.9998 50.0002 65.9998C63.3335 65.9998 76.6668 71.3332 76.6668 71.3332V76.6665H23.3335ZM48.1335 42.2665C44.9335 31.8665 28.6668 34.2665 28.6668 34.2665C28.6668 34.2665 29.2002 55.0665 44.4002 51.8665C43.3335 44.1332 39.3335 41.9998 39.3335 41.9998C46.8002 41.9998 47.3335 51.0665 47.3335 51.0665V63.3332H52.6668V52.1332C52.6668 52.1332 52.6668 41.7332 60.6668 39.0665C60.6668 39.0665 55.3335 47.0665 55.3335 52.3998C74.0002 54.2665 74.0002 28.6665 74.0002 28.6665C74.0002 28.6665 50.2668 25.9998 48.1335 42.2665Z" fill="white"/></svg>`,
  "Cleaning services": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M47.4161 52.1358L33.1068 25.2211C33.0246 25.0665 32.9736 24.8972 32.9568 24.7229C32.94 24.5486 32.9578 24.3727 33.0089 24.2053C33.1123 23.8671 33.3458 23.5838 33.6581 23.4178C33.9703 23.2518 34.3358 23.2166 34.6739 23.32C34.8414 23.3712 34.9971 23.4549 35.1323 23.5662C35.2674 23.6776 35.3792 23.8145 35.4614 23.9691L49.7721 50.8838L51.8014 49.8038C52.4199 49.475 53.0972 49.2712 53.7944 49.2042C54.4917 49.1371 55.1953 49.2081 55.8652 49.413C56.535 49.6179 57.1579 49.9527 57.6983 50.3984C58.2388 50.8441 58.6861 51.3919 59.0148 52.0105L59.8788 53.6345L69.0374 67.0411L50.0388 77.1425L44.0454 62.0518L43.1828 60.4278C42.8539 59.8094 42.6501 59.1322 42.5829 58.435C42.5157 57.7378 42.5866 57.0342 42.7914 56.3644C42.9962 55.6945 43.3309 55.0716 43.7764 54.5311C44.222 53.9907 44.7696 53.5433 45.3881 53.2145L47.4161 52.1358Z" fill="white"/><path d="M39.8135 64.9743C39.9481 64.8623 40.1034 64.7778 40.2706 64.7258C40.4378 64.6737 40.6136 64.6551 40.788 64.671C40.9624 64.687 41.1319 64.7371 41.2869 64.8185C41.442 64.8999 41.5794 65.0111 41.6915 65.1457C41.8036 65.2802 41.888 65.4355 41.9401 65.6027C41.9921 65.7699 42.0107 65.9458 41.9948 66.1201C41.9789 66.2945 41.9288 66.4641 41.8473 66.6191C41.7659 66.7741 41.6547 66.9116 41.5202 67.0237L41.5188 67.025L41.5162 67.0277L41.5122 67.0303L41.4988 67.041L41.4588 67.0743L41.3215 67.1797C41.2051 67.2685 41.0419 67.3841 40.8322 67.5263C40.4122 67.8063 39.8055 68.1717 39.0402 68.537C37.0506 69.4915 34.8735 69.9911 32.6668 69.9997C32.3132 69.9997 31.9741 69.8592 31.724 69.6091C31.474 69.3591 31.3335 69.0199 31.3335 68.6663C31.3335 68.3127 31.474 67.9736 31.724 67.7235C31.9741 67.4735 32.3132 67.333 32.6668 67.333C34.4768 67.3243 36.2622 66.9131 37.8935 66.129C38.3983 65.8891 38.8857 65.6142 39.3522 65.3063C39.5056 65.2049 39.6554 65.0981 39.8015 64.9863L39.8148 64.973L39.8135 64.9743Z" fill="white"/><path d="M44.0735 73.7757C44.3677 73.5794 44.5719 73.2743 44.6412 72.9275C44.7104 72.5807 44.6391 72.2205 44.4428 71.9263C44.2466 71.6321 43.9415 71.4279 43.5947 71.3586C43.2478 71.2894 42.8877 71.3607 42.5935 71.557L42.5908 71.5597L42.5642 71.5757L42.4495 71.649C42.3437 71.7157 42.1886 71.8077 41.9842 71.925C41.4346 72.2388 40.8694 72.5245 40.2908 72.781C38.8668 73.4143 37.0655 73.9997 35.3335 73.9997C34.9799 73.9997 34.6407 74.1401 34.3907 74.3902C34.1406 74.6402 34.0002 74.9794 34.0002 75.333C34.0002 75.6866 34.1406 76.0258 34.3907 76.2758C34.6407 76.5258 34.9799 76.6663 35.3335 76.6663C37.6028 76.6663 39.8002 75.9183 41.3748 75.2183C42.2306 74.8382 43.0604 74.4021 43.8588 73.913L44.0108 73.817L44.0535 73.789L44.0668 73.781L44.0735 73.7757Z" fill="white"/></svg>`,
  "Events and rentals": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M50 20C30.67 20 15 35.67 15 55C15 74.33 30.67 90 50 90C69.33 90 85 74.33 85 55C85 35.67 69.33 20 50 20ZM50 80C36.75 80 25.5 68.75 25.5 55C25.5 41.25 36.75 30 50 30C63.25 30 74.5 41.25 74.5 55C74.5 68.75 63.25 80 50 80Z" fill="white"/><path d="M52 40L48 50H60C60 50 60 40 52 40ZM48 60C48 60 44 70 50 75C56 70 52 60 52 60Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "Fashion services": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M50 15L35 30V45L25 55V75H75V55L65 45V30L50 15ZM50 25L60 35V45H40V35L50 25Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  "Spa and beauty parlour": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><circle cx="50" cy="40" r="20" stroke="white" stroke-width="4" fill="none"/><path d="M50 60V80M35 70H65M50 80V75" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>`,
  "General services": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M30 70V30L50 20L70 30V70L50 80L30 70Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M50 20V80" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>`,
  "Computer operation": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><rect x="20" y="30" width="60" height="40" rx="4" stroke="white" stroke-width="4" fill="none"/><path d="M40 80H60" stroke="white" stroke-width="4" stroke-linecap="round"/><path d="M50 70V80" stroke="white" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="10" stroke="white" stroke-width="4" fill="none"/></svg>`,
  "Restaurant and lounges": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M30 25C30 25 35 35 50 35C65 35 70 25 70 25" stroke="white" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M25 25V70C25 75 30 80 35 80H65C70 80 75 75 75 70V25" stroke="white" stroke-width="4" fill="none"/><path d="M35 80V85C35 88 37 90 40 90H60C63 90 65 88 65 85V80" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>`,
  "Lifestyle and entertainment": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M30 70V30C30 25 35 20 40 20H60C65 20 70 25 70 30V70C70 75 65 80 60 80H40C35 80 30 75 30 70Z" stroke="white" stroke-width="4" fill="none"/><circle cx="40" cy="45" r="6" stroke="white" stroke-width="3" fill="none"/><circle cx="60" cy="45" r="6" stroke="white" stroke-width="3" fill="none"/><path d="M35 60C35 60 40 65 50 65C60 65 65 60 65 60" stroke="white" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`,
  "Tradesmen and retailers": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M30 80H70L65 50H35L30 80Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M35 50L40 30L50 35L60 30L65 50" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  "Professional services": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><rect x="25" y="35" width="50" height="40" stroke="white" stroke-width="4" fill="none"/><path d="M35 35V25H65V35" stroke="white" stroke-width="4" fill="none"/><path d="M50 45V55M50 60V65" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>`,
  "Healthcare services": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M50 20V80" stroke="white" stroke-width="8" stroke-linecap="round"/><path d="M20 50H80" stroke="white" stroke-width="8" stroke-linecap="round"/></svg>`,
  "Software development": `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#003E3E"/><path d="M30 50L40 60L70 30" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M60 50H70" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>`,
};

export function CategoryIcon({ category, size = 48 }: CategoryIconProps) {
  const svgContent = SVG_ICONS[category];
  const emoji = EMOJI_ICONS[category];

  if (!svgContent) {
    return (
      <div
        className="rounded-xl bg-brand-light flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.5 }}>{emoji || "✨"}</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden flex items-center justify-center bg-[#003E3E]"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export const CATEGORY_ICONS = Object.keys(SVG_ICONS);
