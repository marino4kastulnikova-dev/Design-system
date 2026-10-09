/// <reference types="vite/client" />
declare module 'virtual:docs-index' {
  const docs: { slug: string; sections: { title: string; id: string; text: string }[] }[];
  export default docs;
}
