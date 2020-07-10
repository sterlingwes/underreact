import { Script } from 'vm';
import { JSDOM } from 'jsdom';

const render = (htmlTemplate: string, bundleScript: string) => {
  const script = new Script(bundleScript);

  const dom = new JSDOM(htmlTemplate, {
    runScripts: 'outside-only',
  });
  const vmContext = dom.getInternalVMContext();

  script.runInContext(vmContext);

  return dom.serialize();
};

export { render };
