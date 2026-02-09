# Edge Delivery Services + Adobe Commerce Boilerplate

Starter repository for Edge Delivery Services projects that integrate with Adobe Commerce. Use it to scaffold storefront code and content, then evolve it for your implementation.

## Documentation

Recommended reading to get productive quickly:

1. [Storefront Developer Tutorial](https://experienceleague.adobe.com/developer/commerce/storefront/get-started/)
1. [AEM Docs](https://www.aem.live/docs/)
1. [AEM Developer Tutorial](https://www.aem.live/developer/tutorial)
1. [The Anatomy of an AEM Project](https://www.aem.live/developer/anatomy-of-a-project)
1. [Web Performance](https://www.aem.live/developer/keeping-it-100)
1. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Setup

1. Use the [Site Creator Tool](https://da.live/app/adobe-commerce/storefront-tools/tools/site-creator/site-creator) to spin up your own copy of code and content.
1. For a deeper walkthrough, follow the [Storefront Guide](https://experienceleague.adobe.com/developer/commerce/storefront/get-started/).
1. Install dependencies.

```bash
npm install
```

## Local Development

Run the local Edge Delivery Services development server:

```bash
npm start
```

## Testing

Run the linters:

```bash
npm run lint
```

Auto-fix lint issues where possible:

```bash
npm run lint:fix
```

## Deployment

Deployment and publishing follow Edge Delivery Services and Adobe Commerce storefront workflows. Use the documentation above to align environments, content, and publishing flows for your project.

## Update Drop-in Dependencies

If you upgrade a drop-in component or either of these packages:

- `@adobe/magento-storefront-event-collector`
- `@adobe/magento-storefront-events-sdk`

Run `postinstall` so the `scripts/__dropins__` directory is updated to the latest build:

```bash
npm install @dropins/storefront-cart@2.0. # Updates the dependency in node_modules
npm run postinstall # Copies scripts into scripts/__dropins__
```

`postinstall` is a custom script that copies files out of `node_modules` into a local directory that EDS can serve. npm does not run `postinstall` after installing a specific package, so this step is required.

## Support

Open issues for bugs and feature requests in the repo:

https://github.com/hlxsites/aem-boilerplate-commerce/issues

## Security

If you discover a security issue, use your organization’s responsible disclosure process and avoid filing a public issue.

## Contributing

See `CONTRIBUTING.md` for contribution guidelines and `CODE_OF_CONDUCT.md` for community standards.

## Changelog

Major changes are tracked via the `changelog` label in closed pull requests:

https://github.com/hlxsites/aem-boilerplate-commerce/issues?q=label%3Achangelog+is%3Aclosed
