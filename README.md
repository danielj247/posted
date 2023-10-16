![posted](https://github.com/danielj247/posted/assets/92366070/181e2b0a-90c6-41b5-9635-481b8f8472a6)

I wanted to create something with some identity, so decided on the name **posted** and worked from there. I like clean and minimal UI, so I utilised styles from Tailwind UI and shadcn components (both of which I love) with custom styles to create **posted** as a technical test for Netwatch.

The store will initialise by retrieving users, posts and comments from the [JSON Placeholder API](https://jsonplaceholder.typicode.com/). Then the user can continue using the application from that snapshot of data.

You can create, read, update and delete posts and comments. Filtering is available by query string, user selection or sorting by ID as no date values are available.

Cypress is being used for the E2E solution, run `yarn cypress:open` to load the Cypress UI. Here you can run the specs found in `cypress/e2e` - currently there are E2E tests for auth flows, create user page, feed page and post page. The page tests try to cover all interactions a user can make on that page.

Vitest is being used as the unit testing solution, run `yarn test` to run the tests. Currently there are 4 unit test files, two for libs, one for a composable and another for the store. These files will be prefixed with `.test.ts`. The store test is the largest and most comprehensive.

## Development

Install dependencies
```bash
yarn
```

Run development server on 5173:
```bash
yarn dev
```

To lint the codebase:
```bash
yarn lint # or yarn lint:fix
```

To run the unit tests with Vitest:
```bash
yarn test
```

To run the e2e tests with Cypress:
```bash
yarn cypress:open
```

## Additional packages used
- `@headlessui/vue` -> headless components used in TailwindUI
- `@vueuse/core` -> Vue utility composables
- `lucide-vue-next` -> icons
- `cypress` -> for testing
- `cypress-vite` -> to use vite as the build process for cypress
- `msw` -> for mocking api calls in vitest
- `prettier` -> formatting
- `vitest` -> for unit testing
