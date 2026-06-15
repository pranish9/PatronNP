import $ from "jquery";

export const openModal = (overlayId, panelId) => {
  const $overlay = $(`#${overlayId}`);
  const $panel = $(`#${panelId}`);
  $overlay.addClass("is-open").css("display", "flex");
  requestAnimationFrame(() => $panel.addClass("is-open"));
  $("body").css("overflow", "hidden");
};

export const closeModal = (overlayId, panelId) => {
  const $overlay = $(`#${overlayId}`);
  const $panel = $(`#${panelId}`);
  $panel.removeClass("is-open");
  $overlay.removeClass("is-open");
  setTimeout(() => {
    if (!$overlay.hasClass("is-open")) {
      $overlay.css("display", "none");
      $("body").css("overflow", "");
    }
  }, 250);
};

export const initModalClose = (overlayId, panelId, closeSelector) => {
  $(document).on("click", closeSelector, () => closeModal(overlayId, panelId));
  $(`#${overlayId}`).on("click", (e) => {
    if (e.target.id === overlayId) closeModal(overlayId, panelId);
  });
};

export default $;
