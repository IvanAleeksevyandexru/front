var replace = require("replace");
const envObj = require("./envs");
for (let env in envObj) {
  if (env !== 'prod') {
    // папка prod уже сбилжена
    replace({
      regex: "https://gu-st.ru/sf-portal-st/",
      replacement: envObj[env],
      paths: [`./dist/sf-portal-st/${env}`],
      recursive: true,
      silent: true,
    });
  }
  replace({
    regex: `/lib-assets/fonts`,
    replacement: `${envObj[env]}lib-assets/fonts`,
    paths: [`./dist/sf-portal-st/${env}`],
    recursive: true,
    silent: true,
  });
  replace({
    regex: `/assets/fonts`,
    replacement: `${envObj[env]}assets/fonts`,
    paths: [`./dist/sf-portal-st/${env}`],
    recursive: true,
    silent: true,
  });
  replace({
    regex: "/assets/svg",
    replacement: `${envObj[env]}assets/svg`,
    paths: [`./dist/sf-portal-st/${env}/index.html`],
    recursive: true,
    silent: true,
  });
}

