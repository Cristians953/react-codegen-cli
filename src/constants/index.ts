import { ExportType, StyleFormats } from '@/types';
import * as utils from '@/utils';

// export const ROOT = path.dirname(require.main.filename);
export const STYLE_FORMATS: StyleFormats[] = ['CSS', 'SCSS', 'SASS', 'Less', 'Stylus'];
export const EXPORT_TYPES: ExportType[] = ['named', 'default'];
export const APP_ROOT = utils.getAppRoot();
