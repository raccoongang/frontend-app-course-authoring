import { IntlShape } from 'react-intl';

import { BASIC_BLOCK_TYPES, CATEGORIES_KEYS } from './constants';
import { ITreeNode, IXBlockInfo, IAncestor } from './interfaces';
import messages from './messages';

/**
 * Determines the XBlock type based on the provided category and parent information.
 *
 * @param {string} category - The category of the XBlock (e.g., 'chapter', 'sequential', 'vertical').
 * @returns {string} - The determined XBlock type (e.g., 'section', 'subsection', 'unit').
 */
export const getXBlockType = (category: string): string => {
  switch (true) {
    case category === CATEGORIES_KEYS.chapter:
      return CATEGORIES_KEYS.section;
    case category === CATEGORIES_KEYS.sequential:
      return CATEGORIES_KEYS.subsection;
    case category === CATEGORIES_KEYS.vertical:
      return CATEGORIES_KEYS.unit;
    default:
      return category;
  }
};

/**
 * Recursively finds the parent IDs of the target ID in a hierarchical object structure.
 * It returns an array of IDs leading to the target, including the target's own ID.
 *
 * @param {Object} tree - The hierarchical object to search through.
 * @param {string} targetId - The ID of the target element for which to find the parent IDs.
 * @returns {string[]}  - An array of IDs representing the path from the root to the target element.
 */
export const findParentIds = (
  tree: ITreeNode | undefined,
  targetId: string,
): string[] => {
  let path: string[] = [];

  function traverse(node: ITreeNode | undefined, targetId: string, currentPath: string[]): boolean {
    if (!node) {
      return false;
    }

    currentPath.push(node.id);

    if (node.id === targetId) {
      path = currentPath.slice();
      return true;
    }

    for (const child of node.child_info?.children ?? []) {
      if (traverse(child, targetId, currentPath)) {
        return true;
      }
    }

    currentPath.pop();
    return false;
  }

  traverse(tree, targetId, []);
  return path;
};

/**
 * Checks if the target category is valid for moving.
 * @param {Object} sourceParentInfo - Current parent information.
 * @param {Object} targetParentInfo - Target parent information.
 * @returns {boolean} - Returns true if moving is valid.
 */
export const isValidCategory = (
  sourceParentInfo: IXBlockInfo,
  targetParentInfo: IXBlockInfo,
): boolean => {
  let { category: sourceParentCategory, hasChildren: sourceParentHasChildren } = sourceParentInfo;
  let { category: targetParentCategory, has_children: targetParentHasChildren } = targetParentInfo;

  if (
    sourceParentHasChildren
      && sourceParentCategory
      && !BASIC_BLOCK_TYPES.includes(sourceParentCategory)
  ) {
    sourceParentCategory = CATEGORIES_KEYS.vertical;
  }

  if (
    targetParentHasChildren
      && targetParentCategory
      && !BASIC_BLOCK_TYPES.includes(targetParentCategory)
      && targetParentCategory !== CATEGORIES_KEYS.split_test
  ) {
    targetParentCategory = CATEGORIES_KEYS.vertical;
  }

  return targetParentCategory === sourceParentCategory;
};

/**
 * Builds breadcrumbs based on visited ancestors.
 * @param {Array} visitedAncestors - Array of ancestors.
 * @param {Function} formatMessage - Intl formatting function.
 * @returns {Array} - Array of breadcrumb elements.
 */
export const getBreadcrumbs = (
  visitedAncestors: IAncestor[],
  formatMessage: IntlShape['formatMessage'],
): string[] => {
  if (!Array.isArray(visitedAncestors)) {
    return [];
  }

  return visitedAncestors.map((ancestor) => {
    if (ancestor?.category === CATEGORIES_KEYS.course) {
      return formatMessage(messages.moveModalBreadcrumbsBaseCategory);
    }

    return ancestor?.display_name || '';
  });
};
