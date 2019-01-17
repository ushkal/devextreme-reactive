import { getTargetColumnGeometries } from './column-geometries';
import { TargetColumnGeometry } from '../types';

const isOnTheSameLine = (geometry: TargetColumnGeometry, y: number) => (
  y >= geometry.top && y <= geometry.bottom
);

const rectToObject = ({
  top, right, bottom, left,
}: TargetColumnGeometry) => ({
  top, right, bottom, left,
});

const collapseGapsBetweenItems = (geometries: TargetColumnGeometry[]) => (
  geometries.map((geometry, index) => {
    if (index !== geometries.length - 1 && geometry.top === geometries[index + 1].top) {
      return {
        ...geometry,
        right: geometries[index + 1].left,
      };
    }
    return geometry;
  }));

type GetGroupCellTargetIndexFn = (
  ...args: [TargetColumnGeometry[], number, { x: number, y: number }]
) => number;

export const getGroupCellTargetIndex: GetGroupCellTargetIndexFn = (
  geometries, sourceIndex, { x, y },
) => {
  if (geometries.length === 0) return 0;

  const targetGeometries = sourceIndex !== -1
    ? getTargetColumnGeometries(geometries, sourceIndex)
    : geometries.map(rectToObject);

  const targetIndex = collapseGapsBetweenItems(targetGeometries)
    .findIndex((geometry, index) => {
      const inVerticalBounds = isOnTheSameLine(geometry, y);
      const inHorizontalBounds = x >= geometry.left && x <= geometry.right;
      const shouldGoFirst = index === 0 && x < geometry.left;
      const shouldGoOnLineBreak = !inVerticalBounds
        && !!geometries[index - 1]
        && isOnTheSameLine(geometries[index - 1], y);

      return (inVerticalBounds && inHorizontalBounds)
        || shouldGoFirst
        || shouldGoOnLineBreak;
    });

  return targetIndex === -1 ? geometries.length : targetIndex;
};
