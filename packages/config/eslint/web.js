import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import eslintPluginVue from 'eslint-plugin-vue';

export default await withVueTs(
    eslintPluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,
    {
        files: ['**/*.vue'],
        rules: {
            'vue/html-indent': ['error', 4],
        },
    },
);
