import type { ElementType, MouseEvent, CSSProperties, ReactElement, ReactNode } from 'react';

export interface CardNavLink {
  label: string;
  href?: string;
  ariaLabel?: string;
  onClick?: (event: MouseEvent) => void;
}

export interface CardNavItem {
  label: string;
  description?: string;
  links?: CardNavLink[];
  bgColor?: string;
  textColor?: string;
  /** Icon shown in the collapsed bar. If any item has one, the icon bar is used. */
  icon?: ReactNode;
  /** Optional direct link for the collapsed bar icon. Without it, clicking toggles the menu. */
  href?: string;
  /** Highlights the icon in the collapsed bar. */
  active?: boolean;
}

export interface CardNavProps {
  logo?: string | ReactElement;
  logoAlt?: string;
  logoHref?: string;
  items?: CardNavItem[];
  cta?: { label: string; href?: string; onClick?: (event: MouseEvent) => void };
  theme?: 'dark' | 'light';
  surface?: 'glass' | 'solid';
  openOn?: 'click' | 'hover';
  cardEffect?: 'rise' | 'unfold' | 'fade';
  stagger?: number;
  bounce?: number;
  speed?: number;
  cardHeight?: number;
  maxWidth?: number;
  accentColor?: string;
  menuLabel?: boolean;
  intro?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  linkComponent?: ElementType;
  onLinkClick?: (link: CardNavLink, item: CardNavItem, event: MouseEvent) => void;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

declare const CardNav: (props: CardNavProps) => ReactElement;
export default CardNav;
