import './styles.css';

const yearNode = document.querySelector<HTMLElement>('#year');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

const shareButton = document.querySelector<HTMLButtonElement>('#share-button');
const toast = document.querySelector<HTMLElement>('#toast');
let toastTimer: number | undefined;

function showToast(message: string): void {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

shareButton?.addEventListener('click', async () => {
  const shareData = {
    title: 'ASYLUM COMMUNITY — The Jersey Drop',
    text: 'Four designs. One community. Find your jersey and join the Asylum Community drop.',
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('Link copied — send it to your crew.');
  } catch {
    const fallback = document.createElement('textarea');
    fallback.value = window.location.href;
    fallback.setAttribute('readonly', '');
    fallback.style.position = 'fixed';
    fallback.style.opacity = '0';
    document.body.append(fallback);
    fallback.select();
    const copied = document.execCommand('copy');
    fallback.remove();
    showToast(
      copied
        ? 'Link copied — send it to your crew.'
        : 'Copy this page URL from your browser address bar.'
    );
  }
});

document
  .querySelectorAll<HTMLAnchorElement>('a[href="#collection"]')
  .forEach(link => {
    link.addEventListener('click', () => {
      document
        .querySelector('#collection')
        ?.classList.add('collection-arrived');
      window.setTimeout(
        () =>
          document
            .querySelector('#collection')
            ?.classList.remove('collection-arrived'),
        900
      );
    });
  });


const previewModal = document.querySelector<HTMLElement>('#jersey-preview-modal');
const previewImage = document.querySelector<HTMLImageElement>('#jersey-preview-image');
const previewTitle = document.querySelector<HTMLElement>('#jersey-preview-title');
const previewDescription = document.querySelector<HTMLElement>('#jersey-preview-description');
const previewClose = document.querySelector<HTMLButtonElement>('#jersey-preview-close');
const previewOrderLink = document.querySelector<HTMLAnchorElement>('#jersey-preview-order');
let lastPreviewTrigger: HTMLElement | null = null;

function closeJerseyPreview(): void {
  if (!previewModal || previewModal.hidden) return;
  previewModal.hidden = true;
  document.body.classList.remove('modal-open');
  lastPreviewTrigger?.focus();
}

function openJerseyPreview(trigger: HTMLElement): void {
  if (!previewModal || !previewImage || !previewTitle || !previewDescription || !previewOrderLink) return;
  const card = trigger.closest<HTMLElement>('.jersey-card');
  if (!card) return;

  const image = card.querySelector<HTMLImageElement>('.jersey-art');
  const title = card.querySelector<HTMLElement>('.card-info h3');
  const description = card.querySelector<HTMLElement>('.card-info p');
  if (!image || !title || !description) return;

  lastPreviewTrigger = trigger;
  previewImage.src = image.currentSrc || image.src;
  previewImage.alt = image.alt;
  previewTitle.textContent = title.textContent || 'Asylum Community Jersey';
  previewDescription.textContent = description.textContent || 'Choose your Asylum Community jersey.';
  previewOrderLink.setAttribute('aria-label', `Order ${previewTitle.textContent}`);
  previewModal.hidden = false;
  document.body.classList.add('modal-open');
  previewClose?.focus();
}

document.querySelectorAll<HTMLElement>('.jersey-card [data-jersey-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => openJerseyPreview(trigger));
});

previewClose?.addEventListener('click', closeJerseyPreview);
previewModal?.addEventListener('click', (event) => {
  if (event.target === previewModal) closeJerseyPreview();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeJerseyPreview();
});
