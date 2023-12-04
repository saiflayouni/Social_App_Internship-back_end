import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const createPath = (to) => join(dirname(fileURLToPath(import.meta.url)), to);

export default createPath;
