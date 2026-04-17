<script>
    export let ascii = "";
    export let color = "#00f3ff"; // Cyber Cyan
</script>

<div class="cyber-display" style="--text-color: {color}">
    <pre class="ascii">{ascii}</pre>
    <div class="cyber-effects">
        <div class="neon-glow"></div>
    </div>
</div>

<style>
    .cyber-display {
        position: relative;
        width: 100%;
        height: 100%;
        background: #020205;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    pre {
        color: var(--text-color);
        font-family: var(--font-mono);
        font-size: var(--ascii-font-size, 12px);
        line-height: 1.0;
        letter-spacing: 0;
        text-align: left;
        font-weight: 700;
        text-shadow: 0 0 2px var(--text-color);
        white-space: pre;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }


    .cyber-effects {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
    }

    .neon-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, transparent 30%, rgba(2, 2, 5, 0.8) 100%);
    }
</style>