import { ExportType, FileNameCase, IConfig, StyleFormats } from '@/types';
import {
  APP_ROOT,
  DEFAULT_CONFIG,
  EXPORT_TYPES,
  STYLE_FORMATS,
} from '@/constants';
import { Logger } from '@/core/Logger';
import path from 'path';

export type ConfigPrefixes = {
  style: 'module' | 'styles';
  test: 'test';
};

export type ConfigExt = {
  component: string;
  script: string;
  style: string;
};

export class Config implements IConfig {
  fileNameCase: FileNameCase;

  styles: StyleFormats;

  path: string;

  newJsx: boolean;

  jsxExt: boolean;

  typescript: boolean;

  wrapFolder: boolean;

  cssModules: boolean;

  arrowFunction: boolean;

  prefixes: ConfigPrefixes;

  ext: ConfigExt;

  exportType: ExportType;

  userConfig: IConfig;

  constructor(config: IConfig) {
    this.userConfig = config;
    const cfg = { ...DEFAULT_CONFIG, ...config };

    this.setVariables(cfg);
    this.setFilesExtension();
    this.setPrefixes();
  }

  private setVariables(config) {
    this.jsxExt = config.jsxExt ?? this.jsxExt;
    this.newJsx = config.newJsx ?? this.newJsx;
    this.typescript = config.typescript ?? this.typescript;
    this.wrapFolder = config.wrapFolder ?? this.wrapFolder;
    this.arrowFunction = config.arrowFunction ?? this.arrowFunction;

    this.fileNameCase = config.fileNameCase ?? this.fileNameCase;

    if (config.styles) {
      const styles = config.styles.toLowerCase();
      const formats = STYLE_FORMATS.map(v => v.toLowerCase());
      const isSupported = formats.includes(styles);

      if (isSupported) {
        this.styles = config.styles;
      } else {
        Logger.warn(
          chalk =>
            `Unsupported "styles" value - ${styles} ${chalk.white(
              `(using default value - ${DEFAULT_CONFIG.styles})`
            )}`
        );
        this.styles = DEFAULT_CONFIG.styles;
      }
    }

    if (config.exportType) {
      if (EXPORT_TYPES.includes(config.exportType)) {
        this.exportType = config.exportType;
      } else {
        Logger.warn(
          chalk =>
            `Unsupported "exportType" value - ${
              config.exportType
            } ${chalk.white(
              `(using default value - ${DEFAULT_CONFIG.exportType})`
            )}`
        );
        this.exportType = DEFAULT_CONFIG.exportType;
      }
    }

    // Other

    if (!this.path || config.path) {
      this.path = path.resolve(APP_ROOT, config.path ?? DEFAULT_CONFIG.path);
    }

    if (this.styles !== 'styled-components') {
      this.cssModules = config.cssModules ?? this.cssModules;
    } else if (config.cssModules) {
      Logger.warn(
        chalk =>
          `CSS Modules are incompatible with stylesheet format - ${chalk.white(
            'styled-components'
          )}`
      );
    }
  }

  private setFilesExtension() {
    const component = this.typescript ? 'tsx' : `j${this.jsxExt ? 'sx' : 's'}`;
    const script = `${this.typescript ? 't' : 'j'}s`;

    let style = this.styles.toLowerCase();
    if (style === 'styled-components') {
      style = script;
    } else if (style === 'stylus') {
      style = 'styl';
    }

    this.ext = { component, script, style };
  }

  private setPrefixes() {
    this.prefixes = {
      style: this.cssModules ? 'module' : 'styles',
      test: 'test',
    };
  }

  public update(config: Partial<IConfig>) {
    this.setVariables(config);
    this.setFilesExtension();
    this.setPrefixes();
  }

  public reset() {
    this.update({ ...DEFAULT_CONFIG, ...this.userConfig });
  }
}
