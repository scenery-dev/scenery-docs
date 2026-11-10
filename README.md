# Scenery Docs

Source for [docs.scenery.dev](https://docs.scenery.dev), the documentation for Scenery, an enterprise AI tool governance platform. Built with [Astro Starlight](https://starlight.astro.build).

## Develop

Requires Node 22.23.4 or newer.

```bash
npm install
npm run dev      # local dev server
npm run build    # static build into dist/
npm run preview  # serve the build
```

Pages live in `src/content/docs/` under `overview`, `concepts`, `how-it-works`, `under-the-hood`, `rollout`, `employees` and `reference`. The theme is in `src/styles/scenery.css`.

## Contributing

Edit any page via the "Edit on GitHub" link, or open a pull request.

## Security

See [SECURITY.md](SECURITY.md).

## License

Content (the pages in `src/content/docs/`) is licensed under [CC BY 4.0](LICENSE). Code, including `scripts/` and `infra/`, is licensed under [Apache-2.0](LICENSE-CODE).
