import "htmx.org";
import "htmx-ext-head-support";

document.addEventListener("htmx:afterRequest", (event) => {
  if(!(event.target instanceof HTMLFormElement)) return;
  const url = new URL(window.location.href);
  url.search = new URLSearchParams(new FormData(event.target)).toString();
  history.replaceState({}, "", url);
});
