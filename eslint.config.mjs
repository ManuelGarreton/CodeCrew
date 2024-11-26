// eslint.config.mjs
// Configuración de ESLint para asegurar estilo y mejores prácticas en JavaScript

import { builtinModules } from 'module';

export default [
  {
    ignores: ["node_modules/**"],  // Ignorar el directorio node_modules
  },
  {
    // Aplicar configuración a archivos .js
    files: ["**/*.js"],  
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        // Asignar los módulos nativos de Node.js como solo lectura
        ...builtinModules.reduce((acc, mod) => {
          acc[mod] = "readonly";
          return acc;
        }, {}),
        browser: true,  // Para entorno de navegador
        node: true      // Para entorno de Node.js
      }
    },
    rules: {
      "no-undef": "error",                  // Error si hay variables no definidas
      "quotes": ["warn", "double"],         // Usar comillas dobles de forma consistente
      "no-console": "error",                // Error si se usa console.log
      "semi": ["error", "always"],          // Requiere punto y coma al final
      "no-var": "warn",                     // Usar let o const en lugar de var
      "func-names": "error",                // Requiere nombres para funciones anónimas
      "no-trailing-spaces": "warn",         // Advertencia de espacios al final de líneas
      "space-before-blocks": ["error", "always"],  // Espacio antes de abrir bloques
      "quote-props": ["error", "consistent"],      // Consistencia en las propiedades con comillas
      "no-unused-vars": "error",            // Error si hay variables no usadas  
      "indent": ["error", 2],               // Indentación de 2 espacios
      "no-eval": "error",                   // Prohíbe el uso de eval()
      "camelcase": ["warn", { "properties": "never" }],  // Nombres de propiedades en camelCase opcional
      "no-multiple-empty-lines": ["error", { "max": 1 }] // Limitar líneas vacías a una
    }
  }
];
