import { useMemo } from 'react';

import { useTaxonomyListDataResponse, useIsTaxonomyListDataLoaded } from '../../taxonomy/data/apiHooks';
import { useContentTaxonomyTagsData } from '../data/apiHooks';
import { extractOrgFromContentId } from '../utils';

const useContentTagsDrawer = (contentId) => {
  const org = extractOrgFromContentId(contentId);

  const useTaxonomyListData = () => {
    const taxonomyListData = useTaxonomyListDataResponse(org);
    const isTaxonomyListLoaded = useIsTaxonomyListDataLoaded(org);
    return { taxonomyListData, isTaxonomyListLoaded };
  };

  const {
    data: contentTaxonomyTagsData,
    isSuccess: isContentTaxonomyTagsLoaded,
  } = useContentTaxonomyTagsData(contentId);
  const { taxonomyListData, isTaxonomyListLoaded } = useTaxonomyListData();

  const taxonomies = useMemo(() => {
    if (taxonomyListData && contentTaxonomyTagsData) {
      // Initialize list of content tags in taxonomies to populate
      const taxonomiesList = taxonomyListData.results.map((taxonomy) => ({
        ...taxonomy,
        contentTags: /** @type {ContentTagData[]} */([]),
      }));

      const contentTaxonomies = contentTaxonomyTagsData.taxonomies;

      // eslint-disable-next-line array-callback-return
      contentTaxonomies.map((contentTaxonomyTags) => {
        const contentTaxonomy = taxonomiesList.find((taxonomy) => taxonomy.id === contentTaxonomyTags.taxonomyId);
        if (contentTaxonomy) {
          contentTaxonomy.contentTags = contentTaxonomyTags.tags;
        }
      });

      return taxonomiesList;
    }
    return [];
  }, [taxonomyListData, contentTaxonomyTagsData]);

  return {
    taxonomies,
    isTaxonomyListLoaded,
    isContentTaxonomyTagsLoaded,
  };
};

export default useContentTagsDrawer;
