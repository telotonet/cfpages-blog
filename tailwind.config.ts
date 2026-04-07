import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        // Mapped to CSS custom properties — supports light/dark switching
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          subtle: 'hsl(var(--accent-subtle))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'article-base': ['1.0625rem', { lineHeight: '1.8' }],
      },
      maxWidth: {
        'article': '72ch',
        'site': '1280px',
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--foreground))',
            '--tw-prose-headings': 'hsl(var(--foreground))',
            '--tw-prose-links': 'hsl(var(--accent))',
            '--tw-prose-bold': 'hsl(var(--foreground))',
            '--tw-prose-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-bullets': 'hsl(var(--muted-foreground))',
            '--tw-prose-hr': 'hsl(var(--border))',
            '--tw-prose-quotes': 'hsl(var(--foreground))',
            '--tw-prose-quote-borders': 'hsl(var(--accent))',
            '--tw-prose-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-code': 'hsl(var(--foreground))',
            '--tw-prose-pre-code': '#e2e8f0',
            '--tw-prose-pre-bg': '#1e293b',
            '--tw-prose-th-borders': 'hsl(var(--border))',
            '--tw-prose-td-borders': 'hsl(var(--border))',
            // Dark mode
            '--tw-prose-invert-body': 'hsl(var(--foreground))',
            '--tw-prose-invert-headings': 'hsl(var(--foreground))',
            '--tw-prose-invert-links': 'hsl(var(--accent))',
            '--tw-prose-invert-bold': 'hsl(var(--foreground))',
            '--tw-prose-invert-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-bullets': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-hr': 'hsl(var(--border))',
            '--tw-prose-invert-quotes': 'hsl(var(--foreground))',
            '--tw-prose-invert-quote-borders': 'hsl(var(--accent))',
            '--tw-prose-invert-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-pre-bg': '#0f172a',
            // Typography styles
            fontFamily: 'var(--font-lora), Georgia, serif',
            fontSize: '1.0625rem',
            lineHeight: '1.8',
            maxWidth: '72ch',
            a: {
              fontWeight: '500',
              textDecoration: 'underline',
              textDecorationColor: 'hsl(var(--accent) / 0.4)',
              textUnderlineOffset: '3px',
              transition: 'text-decoration-color 0.15s',
              '&:hover': {
                textDecorationColor: 'hsl(var(--accent))',
              },
            },
            h1: {
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontWeight: '700',
              letterSpacing: '-0.02em',
            },
            h2: {
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontWeight: '600',
              letterSpacing: '-0.015em',
              scrollMarginTop: '5rem',
            },
            h3: {
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontWeight: '600',
              scrollMarginTop: '5rem',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            code: {
              backgroundColor: 'hsl(var(--muted))',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.375rem',
              fontSize: '0.875em',
              fontFamily: 'var(--font-mono), monospace',
              fontWeight: '400',
            },
            pre: {
              borderRadius: '0.75rem',
              border: '1px solid hsl(var(--border))',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            table: {
              fontSize: '0.9375rem',
            },
            thead: {
              backgroundColor: 'hsl(var(--muted))',
            },
            'thead th': {
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontWeight: '600',
            },
          },
        },
      }),
    },
  },
  plugins: [typography, forms],
}

export default config
