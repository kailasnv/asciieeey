<script>
    import Camera from "./components/Camera.svelte";
    import Controls from "./components/Controls.svelte";
    import Display from "./components/Display.svelte";
    import { imageToAscii } from "./lib/ascii.js";
    import html2canvas from "html2canvas";
    import { onMount, onDestroy } from "svelte";

    let video;
    let canvas;
    let ctx;

    let ascii = "";
    let color = "#ccff00";
    
    const profiles = {
        cyber: {
            charset: "@#&$%WM0QOBUAGK69542SZEPHY371TJVCILN?!()*+;:-_~^'. ",
            contrast: 1.7,
            brightness: -45,
            resolution: 80
        },

        sharp: {
            charset: "0123456789@#8&WM*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^' ",
            contrast: 1.6,
            brightness: -40,
            resolution: 100
        },
        detailed: {
            charset: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
            contrast: 1.2,
            brightness: -5,
            resolution: 140
        },
        alphanum: {
            charset: "MWB8695420SZEPHY371TJVCILN ",
            contrast: 1.5,
            brightness: -15,
            resolution: 90
        }
    };

    let activeProfile = profiles.detailed;
    let fontSize = 12;
    let isCapturing = false;
    let frameId;
    let lastTime = 0;

    function setColor(c) {
        color = c;
    }

    function setCharset(keyOrValue) {
        if (profiles[keyOrValue]) {
            activeProfile = profiles[keyOrValue];
        } else {
            activeProfile = { ...activeProfile, charset: keyOrValue };
        }
    }



    let windowWidth;
    let windowHeight;


    function captureFrame() {
        if (!video || video.readyState !== 4) return;

        const mainArea = document.querySelector('.content');
        if (!mainArea) return;

        const rect = mainArea.getBoundingClientRect();
        
        // Space Mono Aspect Ratio is ~0.6 (Width/Height)
        const charAspect = 0.6;
        const targetCols = activeProfile.resolution;
        
        // Calculate font size to bridge screen pixels and columns
        // 1. Columns needed to fill width: targetCols
        // 2. Pixels per column: rect.width / targetCols
        // 3. Font Size (Height) needed: (rect.width / targetCols) / charAspect
        fontSize = (rect.width / targetCols) / charAspect;
        
        // 4. Rows needed to fill height: rect.height / fontSize
        const targetRows = Math.round(rect.height / fontSize);

        canvas.width = targetCols;
        canvas.height = targetRows;

        // Visual aspect ratio on screen matches container precisely
        const visualAspect = rect.width / rect.height;

        // Video Cover Logic
        const videoAspect = video.videoWidth / video.videoHeight;
        let sx, sy, sWidth, sHeight;
        
        if (videoAspect > visualAspect) {
            sHeight = video.videoHeight;
            sWidth = sHeight * visualAspect;
            sx = (video.videoWidth - sWidth) / 2;
            sy = 0;
        } else {
            sWidth = video.videoWidth;
            sHeight = sWidth / visualAspect;
            sx = 0;
            sy = (video.videoHeight - sHeight) / 2;
        }

        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ascii = imageToAscii(imageData, canvas.width, canvas.height, activeProfile.charset, { 
            contrast: activeProfile.contrast, 
            brightness: activeProfile.brightness 
        });

        fontSize = Math.max(4, Math.min(fontSize, 60));
    }

    function startLoop() {
        const loop = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const elapsed = timestamp - lastTime;

            if (elapsed > 100) { // Throttle to ~10 FPS (100ms)
                captureFrame();
                lastTime = timestamp;
            }
            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
    }

    onDestroy(() => {
        if (frameId) cancelAnimationFrame(frameId);
    });

    async function screenshot() {
        isCapturing = true;
        const element = document.querySelector(".cyber-display");

        if (!(element instanceof HTMLElement)) {
            console.error("Display element not found");
            isCapturing = false;
            return;
        }

        try {
            const canvasImg = await html2canvas(element, {
                backgroundColor: "#000",
                scale: 2
            });
            const link = document.createElement("a");
            link.download = `ascii-capture-${Date.now()}.png`;
            link.href = canvasImg.toDataURL();
            link.click();
        } catch (err) {
            console.error("Screenshot failed:", err);
        } finally {
            setTimeout(() => { isCapturing = false; }, 500);
        }
    }

    onMount(() => {
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        startLoop();
    });
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div class="app-shell" style="--ascii-font-size: {fontSize}px">
    <aside class="sidebar">
        <header class="app-header">
            <h1 class="logo">asciieeey</h1>
            <button class="screenshot-btn primary" on:click={screenshot} disabled={isCapturing}>
                {#if isCapturing}
                    <div class="spinner"></div>
                    <span>Capturing...</span>
                {:else}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                    <span>Take Screenshot</span>
                {/if}
            </button>
        </header>

        <section class="controls-wrapper">
            <div class="divider"></div>
            <Camera bind:video={video} />
            <Controls {setColor} {setCharset} />
        </section>
    </aside>

    <main class="content">
        <Display {ascii} {color} />
    </main>
</div>


<style>
    :global(body) {
        overflow: hidden !important;
        margin: 0;
        padding: 0;
    }

    .app-shell {
        display: flex;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background: #000;
    }

    .sidebar {
        width: 320px;
        min-width: 320px;
        height: 100%;
        background: rgba(10, 10, 15, 0.8);
        backdrop-filter: blur(12px);
        border-right: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        padding: 2rem;
        gap: 2rem;
        z-index: 10;
        overflow-y: auto;
    }


    .content {
        flex: 1;
        background: #000;
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
        position: relative;
    }

    .app-header {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .logo {
        font-size: 1.25rem;
        font-weight: 900;
        letter-spacing: 0.1em;
        color: var(--accent);
        text-transform: uppercase;
        margin: 0;
    }

    .screenshot-btn.primary {
        background: var(--accent);
        color: #000;
        border-radius: 6px;
        padding: 0.6rem 1rem;
        font-size: 0.8rem;
    }

    .controls-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .divider {
        height: 1px;
        background: var(--border);
        width: 100%;
    }

    .screenshot-btn {
        width: 100%;
        justify-content: center;
        background: var(--accent);
        color: #000;
        border: none;
        padding: 1.2rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transition: all 0.2s ease;
    }

    .screenshot-btn:hover {
        background: white;
        transform: translateY(-2px);
    }




    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(0, 0, 0, 0.3);
        border-top-color: #000;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @media (max-width: 900px) {
        .app-shell {
            flex-direction: column-reverse;
        }

        .sidebar {
            width: 100%;
            height: auto;
            max-height: 45%;
            border-right: none;
            border-top: 1px solid var(--border);
            padding: 1.5rem;
        }

        .content {
            flex: 1;
            height: 55vh;
        }
    }
</style>