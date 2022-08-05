import { Icon } from "solid-heroicons";
import { chatAlt_2, arrowRight, menu } from "solid-heroicons/solid";
import { Link } from "solid-app-router";
import '~/styles/SiteHeader.css';

export default function SiteHeader() {
  return (
    <div class="app-header">
      <Link style={{"text-decoration": "none"}} href="/">
      <p class="brand">
        <Icon path={chatAlt_2} /> FreeSpeech <span>AAC</span>
      </p>
      </Link>
      <div class="nav-item">
        <Link href="/docs">Documentation</Link>
      </div>
      <div class="nav-item">
        <p>Enterprise</p>
      </div>
      <div class="spacer"></div>
      <div class="nav-item">
        <p class="nav-btn">
          App <Icon width="1.5rem" path={arrowRight} />
        </p>
      </div>
      <div class="mobile-menu nav-item">
        <Icon style="width: 30px;" path={menu} />
      </div>
    </div>
  );
}
