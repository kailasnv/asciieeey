<script>
    export let setColor;
    export let setCharset;

    const charsets = {
        cyber: "@!#$%^&*()!~_+ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ",
        sharp: "0123456789@#8&WM*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^' ",
        detailed: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
        alphanum: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "
    };









    const colors = [
        { name: 'Cyber Cyan', value: '#00f3ff' },
        { name: 'Neon Pink', value: '#ff00ff' },
        { name: 'Voltage Lime', value: '#ccff00' },
        { name: 'Plasma Purple', value: '#b026ff' }
    ];



    let activeCharset = 'detailed';
    let activeColor = '#ccff00';




    function handleCharsetChange(key) {
        activeCharset = key;
        setCharset(key); // Send the key so App.svelte can use the profile
    }


    function handleColorChange(value) {
        activeColor = value;
        setColor(value);
    }
</script>

<div class="controls-container glass-panel">
    <div class="section">
        <span class="label">Character Set</span>
        <div class="button-grid">
            {#each Object.keys(charsets) as key}
                <button 
                    class:active={activeCharset === key}
                    on:click={() => handleCharsetChange(key)}
                >
                    {key}
                </button>
            {/each}
        </div>
    </div>

    <div class="divider"></div>

    <div class="section">
        <span class="label">Color Filter</span>
        <div class="color-grid">
            {#each colors as color}
                <button 
                    class="color-btn"
                    class:active={activeColor === color.value}
                    style="--btn-color: {color.value}"
                    on:click={() => handleColorChange(color.value)}
                    title={color.name}
                >
                    <span class="color-swatch" style="background: {color.value}"></span>
                </button>
            {/each}
        </div>
    </div>
</div>

<style>
    .controls-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--text-secondary);
    }

    .button-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
    }

    button {
        width: 100%;
        justify-content: center;
        background: rgba(255, 255, 255, 0.03);
        font-size: 0.75rem;
    }

    button.active {
        background: var(--accent);
        color: var(--bg);
        border-color: var(--accent);
        box-shadow: 0 0 15px var(--accent-glow);
    }

    .divider {
        height: 1px;
        background: var(--border);
    }

    .color-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .color-btn {
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.03);
    }

    .color-btn.active {
        background: var(--btn-color);
        box-shadow: 0 0 15px var(--btn-color);
        border-color: transparent;
    }

    .color-swatch {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        transition: transform 0.3s ease;
    }

    .color-btn:hover .color-swatch {
        transform: scale(1.5);
    }

    .color-btn.active .color-swatch {
        background: var(--bg) !important;
    }
</style>