document.addEventListener("DOMContentLoaded", () => {
    function fitImageToWindow(): void {
        const image = document.getElementById('data-target') as HTMLImageElement;
        if (image.naturalWidth / image.naturalHeight > window.innerWidth / window.innerHeight) {
            // Image width is greater, so fit width to window width
            image.style.width = 'calc(100vw - 20px)';
            image.style.height = 'auto';
        } else {
            // Image height is greater, so fit height to window height
            image.style.height = 'calc(100vh - 20px)';
            image.style.width = 'auto';
        }
    }

    // Resize inner image as window is loaded
    window.addEventListener("load", fitImageToWindow);
    // Resize inner image as window is resized
    window.addEventListener('resize', fitImageToWindow);
});
