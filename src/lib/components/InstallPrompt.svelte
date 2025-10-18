<script lang="ts">
	import { onMount } from 'svelte';
	
	let deferredPrompt: any;
	let showInstallButton = false;

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			showInstallButton = true;
		});

		window.addEventListener('appinstalled', () => {
			showInstallButton = false;
			deferredPrompt = null;
		});

		// Check if app is already installed
		if (window.matchMedia('(display-mode: standalone)').matches) {
			showInstallButton = false;
		}
	});

	async function installApp() {
		if (!deferredPrompt) return;
		
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		
		if (outcome === 'accepted') {
			showInstallButton = false;
		}
		
		deferredPrompt = null;
	}
</script>

{#if showInstallButton}
	<button on:click={installApp} class="install-button">
		📱 Install App
	</button>
{/if}

<style>
	.install-button {
		position: fixed;
		bottom: 20px;
		right: 20px;
		background: var(--button, #ff436c);
		color: var(--text, white);
		border: 2px solid var(--border, #ff436c);
		padding: 12px 20px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;
		z-index: 1000;
	}

	.install-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
	}

	.install-button:active {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}
</style>