import { easeOutCubic } from '@devexpress/dx-core';
import { getTargetColumnGeometries } from './column-geometries';

export const getTableColumnGeometries = (columns, tableWidth) => {
  const columnWidths = columns
    .map(column => column.width);

  const freeSpace = tableWidth;
  const restrictedSpace = columnWidths
    .reduce((accum, width) => accum + (width || 0), 0);
  const freeSpacePortions = columnWidths
    .reduce((accum, width) => accum + (width === undefined ? 1 : 0), 0);
  const freeSpacePortion = (freeSpace - restrictedSpace) / freeSpacePortions;

  let lastRightPosition = 0;
  return columnWidths
    .map(width => (width === undefined ? freeSpacePortion : width))
    .map((width) => {
      lastRightPosition += width;
      return {
        left: lastRightPosition - width,
        right: lastRightPosition,
      };
    });
};

export const getTableTargetColumnIndex = (
  columnGeometries, sourceIndex, offset,
) => getTargetColumnGeometries(columnGeometries, sourceIndex)
  .findIndex(({ left, right }) => offset > left && offset < right);

const ANIMATION_DURATION = 200;

const getAnimationProgress = animation => (
  new Date().getTime() - animation.startTime) / ANIMATION_DURATION;

export const getAnimations = (
  prevColumns,
  nextColumns,
  tableWidth,
  prevAnimations,
) => {
  const resizing = prevColumns.map(column => column.key).join()
    === nextColumns.map(column => column.key).join();

  const prevColumnGeometries = new Map(getTableColumnGeometries(prevColumns, tableWidth)
    .map((geometry, index) => [prevColumns[index].key, geometry])
    .map(([key, geometry]) => {
      const animation = prevAnimations.get(key);
      if (!animation) return [key, geometry];
      const progress = easeOutCubic(getAnimationProgress(animation));
      const left = ((animation.left.to - animation.left.from) * progress) + animation.left.from;
      return [key, {
        left,
        right: geometry.right - (geometry.left - left),
      }];
    }));

  const nextColumnGeometries = new Map(getTableColumnGeometries(nextColumns, tableWidth)
    .map((geometry, index) => [nextColumns[index].key, geometry]));

  return new Map([...nextColumnGeometries.keys()]
    .map((key): [any, object] => {
      const prev: any = prevColumnGeometries.get(key);
      const next: any = nextColumnGeometries.get(key);

      const result: any = { startTime: new Date().getTime(), style: {} };
      const takePrevColumnIntoAccount = !!prevAnimations.get(key) || (prev && !resizing);
      if (Math.abs((takePrevColumnIntoAccount ? prev!.left : next!.left) - next!.left) > 1) {
        result.left = { from: prev.left, to: next.left };
      }
      return [key, result];
    })
    .filter((animation: any[]) => animation[1].left));
};

export const filterActiveAnimations = animations => new Map([...animations.entries()]
  .filter(([, animation]) => getAnimationProgress(animation) < 1));

export const evalAnimations = animations => new Map([...animations.entries()]
  .map(([key, animation]): [any, object] => {
    const progress = easeOutCubic(getAnimationProgress(animation));
    const result = { ...animation.style };
    if (animation.left) {
      const offset = (animation.left.to - animation.left.from) * (progress - 1);
      result.transform = `translateX(${offset}px)`;
    }
    return [key, result];
  }));
