<script>
    import { onMount, onDestroy } from "svelte";
 
    export let video;
    let cameraActive = false;
    let errorMsg = "";
    let mediaStream = null;
 
    onMount(async () => {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });
 
            if (video) {
                video.srcObject = mediaStream;
                await video.play();
                cameraActive = true;
            }
        } catch (err) {
            console.error("Camera access error:", err);
            errorMsg = err.name === "NotAllowedError" 
                ? "Camera access denied. Please enable it in settings." 
                : "Unable to access camera sensor.";
        }
    });

    onDestroy(() => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
    });
</script>


<div class="camera-container glass-panel">
    <div class="header">
        <div class="status-tag">
            <div class="status-dot"></div>
            <span>Live Feed</span>
        </div>
    </div>
    
    <div class="viewfinder">
        <video bind:this={video} autoplay playsinline muted></video>
        <div class="scanline"></div>
        <div class="corners">
            <div class="top-left"></div>
            <div class="top-right"></div>
            <div class="bottom-left"></div>
            <div class="bottom-right"></div>
        </div>
        {#if !cameraActive}
            <div class="loading-overlay">
                {#if errorMsg}
                    <span class="error-text">{errorMsg}</span>
                {:else}
                    <span class="loading-text">Initializing Sensor...</span>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .camera-container {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }


    .viewfinder {
        position: relative;
        aspect-ratio: 16/9;
        background: #000;
        border-radius: 0.75rem;
        overflow: hidden;
        border: 1px solid var(--border);
    }

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(1) brightness(0.8) contrast(1.2);
        opacity: 0.6;
        transform: scaleX(-1);
    }


    .scanline {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--accent);
        opacity: 0.5;
        box-shadow: 0 0 10px var(--accent);
        animation: scan 3s linear infinite;
        pointer-events: none;
    }

    @keyframes scan {
        from { transform: translateY(0); }
        to { transform: translateY(300px); }
    }

    .corners > div {
        position: absolute;
        width: 15px;
        height: 15px;
        border: 2px solid var(--accent);
        opacity: 0.5;
    }

    .top-left { top: 10px; left: 10px; border-right: none; border-bottom: none; }
    .top-right { top: 10px; right: 10px; border-left: none; border-bottom: none; }
    .bottom-left { bottom: 10px; left: 10px; border-right: none; border-top: none; }
    .bottom-right { bottom: 10px; right: 10px; border-left: none; border-top: none; }

    .loading-overlay {
        position: absolute;
        inset: 0;
        background: var(--bg);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .loading-text, .error-text {
        font-size: 0.875rem;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        animation: pulse 1.5s ease-in-out infinite;
    }

    .error-text {
        color: #ff4444;
        text-align: center;
        padding: 2rem;
    }
</style>