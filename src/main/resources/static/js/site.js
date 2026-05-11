import "htmx.org";
import "htmx-ext-head-support";

const form = document.getElementById("filter-form");

form?.addEventListener("htmx:afterRequest", () => {
  const url = new URL(window.location.href);
  url.search = new URLSearchParams(new FormData(form)).toString();
  history.replaceState({}, "", url);
});
