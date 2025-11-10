import {
  type MediaQueryAllQueryable,
  type MediaQueryMatchers,
  useMediaQuery,
} from "react-responsive";

interface ResponsiveReturnValues {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isBigScreen: boolean;
  mobileOnly: boolean;
  tabletOnly: boolean;
  desktopOnly: boolean;
  useMediaQuery: (
    settings: Partial<MediaQueryAllQueryable & { query?: string | undefined }>,
    device?: MediaQueryMatchers,
    callback?: (matches: boolean) => void
  ) => boolean;
}

const getMedia = <T extends number>(breakpoint: T): `(min-width: ${T}px)` =>
  `(min-width: ${breakpoint}px)`;

const media = {
  xs: getMedia(360),
  sm: getMedia(568),
  md: getMedia(768),
  lg: getMedia(992),
  xl: getMedia(1280),
  xxl: getMedia(1920),
};

export const useResponsive = (): ResponsiveReturnValues => {
  const isMobile = useMediaQuery({ query: media.xs });
  const isTablet = useMediaQuery({ query: media.md });
  const isDesktop = useMediaQuery({ query: media.xl });
  const isBigScreen = useMediaQuery({ query: media.xxl });

  const mobileOnly = useMediaQuery({
    query: `(max-width: ${768 - 0.02}px)`,
  });

  const tabletOnly = useMediaQuery({
    query: `(min-width: 768px) and (max-width: ${1280 - 0.02}px)`,
  });

  const desktopOnly = useMediaQuery({
    query: `(min-width: ${1280}px) and (max-width: ${1920 - 0.02}px)`,
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
    isBigScreen,
    mobileOnly,
    tabletOnly,
    desktopOnly,
    useMediaQuery,
  };
};
