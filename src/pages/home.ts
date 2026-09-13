import "../style.css";
import { setupHeroCarousel } from "../components/heroCarousel";
import { renderHeader } from "../components/header";
import { setupMobileMenu } from "../components/mobileMenu";
import { renderFooter } from "../components/footer";

renderHeader();
setupMobileMenu();
setupHeroCarousel();
renderFooter();
