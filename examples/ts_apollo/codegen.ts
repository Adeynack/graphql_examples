import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/typeDefs.graphql',
  generates: {
    'src/__generated__/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        { add: { content: "import { DeepPartial } from 'utility-types';" } },
      ],
      config: {
        useIndexSignature: true,
        contextType: '../context#Context',
        defaultMapper: 'DeepPartial<{T}>',
        enumsAsConst: true,
      },
    },
  },
};

export default config;
