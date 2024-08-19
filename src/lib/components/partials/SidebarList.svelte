<script lang="ts">
	import { isSidebarOpen } from '$lib/stores/index.store';

	export let active = false;
	export let label = '';
	export let href = '';
</script>

<a {href}>
	<div
		class="flex gap-6 my-1 py-[4px] text-base font-medium cursor-pointer relative"
		class:dark:after:bg-base-dark-900={active}
		class:after:bg-base-100={active}
		class:active
		class:sidebar-list={$isSidebarOpen}
	>
		<div title={label} class:py-2={!$isSidebarOpen} class="flex items-center sidebar-icon z-[99] pl-[21px] text-white relative" class:active>
			<div class="w-7 h-7" id={label}>
				<slot name="icon" />
			</div>
		</div>
		<div
			class:hidden={!$isSidebarOpen}
			class="sidebar-label w-full px-6 py-2 rounded-l-full"
			class:bg-base-100={active}
			class:dark:bg-base-dark-900={active}
			class:text-primary-900={active}
			class:dark:text-base-200={active}
		>
			{label}
		</div>
	</div>
</a>

<style>
	div.active,
	.sidebar-list.active {
		position: relative;
		transition: all 0.3s ease-in-out;
	}

	.sidebar-icon.active::before {
		content: '';
		position: absolute;
		top: -1%;
		left: 0px;
		height: 100%;
		width: 4px;
		border-radius: 20px;
		background-color: white;
	}

	.sidebar-list.active::before {
		content: '';
		position: absolute;
		width: 20px;
		height: 20px;
		top: -16px;
		right: 0px;
		border-bottom-right-radius: 20px;
		box-shadow: 5px 5px 0 5px #edeef1;
	}

	.sidebar-list.active::after {
		content: '';
		position: absolute;
		width: 20px;
		height: 20px;
		bottom: -16px;
		background-color: inherit;
		right: 0;
		border-top-right-radius: 40px;
		box-shadow: 5px -5px 0 5px #edeef1;
	}

	.sidebar-list:nth-child(1).active {
		transform: translateY(calc(64px * 0));
	}
	.sidebar-list:nth-child(2).active {
		transform: translateY(calc(64px * 1));
	}
	.sidebar-list:nth-child(3).active {
		transform: translateY(calc(64px * 2));
	}
	.sidebar-list:nth-child(4).active {
		transform: translateY(calc(64px * 3));
	}
	.sidebar-list:nth-child(5).active {
		transform: translateY(calc(64px * 4));
	}
</style>
