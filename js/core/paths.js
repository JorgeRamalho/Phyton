/**
 * Resolução de caminhos relativa à raiz do projeto.
 * index.html usa data-root="./" · páginas em /pages usam data-root="../"
 */
const Paths = {
  root() {
    const value = document.body.getAttribute("data-root");
    return value == null || value === "" ? "./" : value;
  },

  join(path) {
    const base = this.root();
    if (!base || base === "./") return path;
    return `${base.replace(/\/?$/, "/")}${path}`;
  },

  home() {
    return this.join("index.html");
  },

  page(name) {
    return this.join(`pages/${name}`);
  },

  brand(file) {
    return this.join(`assets/brand/${file}`);
  },
};
