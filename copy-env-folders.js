const cpx = require("cpx");
const envObj = require("./envs");
for( let env in envObj) {
  if(env !== 'prod') {
    // папка prod уже сбилжена
    cpx.copy('./dist/sf-portal-st/prod/**/*',`./dist/sf-portal-st/${env}`);
  }
}
