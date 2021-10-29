import { styled } from "@linaria/react";
import { desktopBp } from "shared/config/theme";

export const Layout = styled.div`
  position: relative;
  display: grid;
  grid-template:
    "header" minmax(auto, 90px)
    "content" 1fr
    "footer" minmax(120px, auto)
    / minmax(auto, 100vw);
  width: 100vw;
  min-height: 100vh;
  @media (min-width: ${desktopBp}px) {
    --desktop-main-max-width: ${600 / 16}rem;
    grid-template:
      "left header  right" minmax(auto, 90px)
      "left content right" 1fr
      "footer footer footer" minmax(120px, auto)
      / 1fr minmax(auto, var(--desktop-main-max-width)) 1fr;
  }
`;

export const Content = styled.main`
  grid-area: content;
  padding: 0 1rem 2rem;
  --app-content-max-width: calc(var(--desktop-main-max-width) - 2rem);
`;

export const Header = styled.header`
  grid-area: header;
`;

export const Footer = styled.footer`
  grid-area: footer;
`;

export const Left = styled.div`
  grid-area: left;
`;

export const Right = styled.div`
  grid-area: right;
`;
