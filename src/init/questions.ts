import { STYLE_FORMATS } from '@/constants';
import { changeCase } from '@/utils';

function getFileName(format, answers) {
  const name = changeCase('my component', format);
  const ext = answers.typescript ? 'tsx' : `j${answers.jsxExt ? 'sx' : 's'}`;

  return `${name}.${ext}`;
}

export const question = [
  {
    type: 'list',
    name: 'styles',
    message: 'Which stylesheet format would you like to use?',
    choices: STYLE_FORMATS,
  },
  {
    type: 'confirm',
    name: 'cssModules',
    message: 'Use css modules?',
    when: values => values.styles !== 'styled-components',
  },
  {
    type: 'confirm',
    name: 'typescript',
    message: 'Use typescript?',
  },
  {
    type: 'confirm',
    name: 'jsxExt',
    message: 'Use JSX format',
    when: values => !values.typescript,
  },
  {
    type: 'confirm',
    name: 'wrapFolder',
    message: 'Should create a wrap folder?',
  },
  {
    type: 'confirm',
    name: 'arrowFunction',
    message: 'Use arrow function syntax?',
  },
  {
    type: 'list',
    name: 'fileNameCase',
    message: 'Which file name case would you like to use?',
    choices: values => [
      {
        value: 'pascal',
        name: `Pascal Case       [ ${getFileName('pascal', values)}  ]`,
      },
      {
        value: 'kebab',
        name: `Kebab Case        [ ${getFileName('kebab', values)} ]`,
      },
      {
        value: 'camel',
        name: `Camel Case        [ ${getFileName('camel', values)}  ]`,
      },
      {
        value: 'snake',
        name: `Snake Case        [ ${getFileName('snake', values)} ]`,
      },
      {
        value: 'snakeUpper',
        name: `Snake Upper Case  [ ${getFileName('snakeUpper', values)} ]`,
      },
    ],
  },
  {
    type: 'input',
    name: 'path',
    message: 'Where to generate files?',
    default: 'src/components',
    validate: str => str.length > 0,
  },
  {
    type: 'confirm',
    name: 'script',
    message: 'Add script in package.json?',
  },
  {
    type: 'input',
    name: 'scriptName',
    message: 'Script name?',
    default: 'react-codegen',
    when: answers => answers.script,
    validate: str => str.length > 0,
  },
];
