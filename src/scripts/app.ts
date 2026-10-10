import "../styles/theme.css";
import "../styles/foundation.css";
import "../styles/glass.css";
import "../styles/content.css";
import "../styles/document.css";
import { initGlass } from "./glass";
import { initPanel } from "./panel";
import { initSpy } from "./spy";
import { initTheme } from "./theme";

initTheme();
initGlass();
initSpy();
initPanel();
