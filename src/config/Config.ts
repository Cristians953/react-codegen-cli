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

  jsxExt: boolean;

  typescript: boolean;

  wrapFolder: boolean;

  cssModules: boolean;

  arrowFunction: boolean;

  prefixes: ConfigPrefixes;

  ext: ConfigExt;

  exportType: ExportType;

  constructor(config: IConfig) {
    const cfg = Object.assign(DEFAULT_CONFIG, config);

    this.setVariables(cfg);
    this.setFilesExtension();
    this.setPrefixes();
  }

  private setVariables(config) {
    // Boolean

    this.jsxExt = config.jsxExt ?? this.jsxExt;
    this.typescript = config.typescript ?? this.typescript;
    this.wrapFolder = config.wrapFolder ?? this.wrapFolder;
    this.cssModules = config.cssModules ?? this.cssModules;
    this.arrowFunction = config.arrowFunction ?? this.arrowFunction;

    // Enum

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

    this.path = path.resolve(APP_ROOT, config.path ?? DEFAULT_CONFIG.path);
  }

  private setFilesExtension() {
    let styleExt = this.styles.toLowerCase();
    if (styleExt === 'stylus') {
      styleExt = 'styl';
    }

    this.ext = {
      component: this.typescript ? 'tsx' : `j${this.jsxExt ? 'sx' : 's'}`,
      script: `${this.typescript ? 't' : 'j'}s`,
      style: styleExt,
    };
  }

  private setPrefixes() {
    this.prefixes = {
      style: this.cssModules ? 'module' : 'styles',
      test: 'test',
    };
  }

  public update(config: IConfig) {
    this.setVariables(config);
    this.setFilesExtension();
    this.setPrefixes();
  }
}