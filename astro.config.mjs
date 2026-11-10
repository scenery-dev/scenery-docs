// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightLinksValidator from 'starlight-links-validator';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.scenery.dev',
	integrations: [
		starlight({
			plugins: [starlightLlmsTxt(), starlightLinksValidator()],
			title: 'Scenery Docs',
			description: 'Documentation for Scenery, enterprise AI tool governance.',
			logo: { src: './src/assets/logo.svg', alt: 'Scenery' },
			favicon: '/favicon.svg',
			customCss: ['./src/styles/scenery.css'],
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
				SocialIcons: './src/components/SocialIcons.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/scenery-dev/scenery-docs' },
			],
			editLink: { baseUrl: 'https://github.com/scenery-dev/scenery-docs/edit/main/' },
			sidebar: [
				{ label: 'Overview', items: [{ autogenerate: { directory: 'overview' } }] },
				{ label: 'Concepts', items: [{ autogenerate: { directory: 'concepts' } }] },
				{ label: 'How it works', items: [{ autogenerate: { directory: 'how-it-works' } }] },
				{ label: 'Under the hood', items: [{ autogenerate: { directory: 'under-the-hood' } }] },
				{ label: 'Rolling out Scenery', items: [{ autogenerate: { directory: 'rollout' } }] },
				{ label: 'For employees', items: [{ autogenerate: { directory: 'employees' } }] },
				{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
			],
		}),
	],
});
