import { getConfig } from '@edx/frontend-platform';

const assetPathRoot = (imageAssetPath) => `${getConfig().LMS_BASE_URL}${imageAssetPath}`;
const assetsUrl = (courseId) => `${getConfig().STUDIO_BASE_URL}/assets/${courseId}`;

export { assetPathRoot, assetsUrl };
