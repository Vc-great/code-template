import { defineConfig } from 'vitepress'
import {sidebar} from '../element-ui/component'
import {tsSidebar} from '../ts/component'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base:'/code-template/',
  title: "code-template",
  description: "code block",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Element-ui', link: '/element-ui/table' },
      { text: 'ts', link: '/ts/index' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: {
      '/element-ui/': sidebar,
      '/ts/':tsSidebar
    },


/*        [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],*/

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
