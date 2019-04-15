import { Getters } from '@devexpress/dx-react-core';
import { pageTriggersMeta } from './helpers';

export const nextPageReferenceIndex = (
  payload: any,
  getters: Getters,
) => {
  const triggersMeta = pageTriggersMeta(payload, getters);
  if (triggersMeta === null) {
    return null;
  }

  const {
    topTriggerPosition, bottomTriggerPosition, topTriggerIndex, bottomTriggerIndex,
  } = triggersMeta;
  const { viewportTop, estimatedRowHeight, containerHeight } = payload;
  const referencePosition = viewportTop + containerHeight / 2;

  const getReferenceIndex = (triggetIndex: number, triggerPosition: number) => (
    triggetIndex + Math.round((referencePosition - triggerPosition) / estimatedRowHeight)
  );

  let referenceIndex: number | null = null;
  if (referencePosition < topTriggerPosition) {
    referenceIndex = getReferenceIndex(topTriggerIndex, topTriggerPosition);
  }
  if (bottomTriggerPosition < referencePosition) {
    referenceIndex = getReferenceIndex(bottomTriggerIndex, bottomTriggerPosition);
  }

  return referenceIndex;
};
