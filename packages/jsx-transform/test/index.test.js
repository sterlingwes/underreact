const Path = require('path');
const Fs = require('fs');

const Babel = require('@babel/core');

const scenariosDirectory = Path.join(__dirname, 'scenarios');

const babelOptions = (options) => ({
  plugins: [require('@babel/plugin-external-helpers'), [require('../src').default, options]],
});

Fs.readdirSync(scenariosDirectory).forEach(testDirectory);

// testDirectory('should-use-underreact-runtime-default');

function testDirectory(name) {
  const options = { noInterop: true };
  const testDirectory = Path.join(scenariosDirectory, name);
  const actualCode = Fs.readFileSync(Path.join(testDirectory, 'actual.js'), 'utf8');

  if (Fs.existsSync(Path.join(testDirectory, 'options.json'))) {
    Object.assign(
      options,
      JSON.parse(Fs.readFileSync(Path.join(testDirectory, 'options.json'), 'utf8')),
    );
  }

  it(name, () => {
    const transformedCode = Babel.transformSync(actualCode, babelOptions(options)).code;
    expect(transformedCode).toMatchSnapshot();
  });
}
